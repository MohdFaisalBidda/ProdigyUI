  "use client";

  import { useEffect, useRef } from "react";
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";
  import Image from "next/image";

  gsap.registerPlugin(SplitText);

  export interface TeamMember {
    image: string;
    name: string;
    imageClassName?: string;
    imageStyle?: React.CSSProperties;
    nameClassName?: string;
    nameStyle?: React.CSSProperties;
  }

  export interface TeamSectionProps {
    /** Text displayed when no member is hovered */
    defaultName?: string;
    /** Array of team members */
    members: TeamMember[];
    /** Background color of the section (default: '#0f0f0f') */
    backgroundColor?: string;
    /** Default text color (default: '#e3e3db') */
    textColor?: string;
    /** Hover name color (default: '#f93535') */
    accentColor?: string;
    /** Extra class for the section container */
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
    profileImagesContainerClassName?: string;
    profileImagesContainerStyle?: React.CSSProperties;
    profileNamesContainerClassName?: string;
    profileNamesContainerStyle?: React.CSSProperties;
    defaultNameClassName?: string;
    defaultNameStyle?: React.CSSProperties;
    memberNameClassName?: string;
    memberNameStyle?: React.CSSProperties;
    /** Scale multiplier when a profile image is hovered (default: 2) */
    hoverScaleFactor?: number;
    /** Animation duration in seconds (default: 0.75) */
    animDuration?: number;
    /** Stagger each char by this amount (default: 0.025) */
    charStagger?: number;
  }

  export default function TeamSection({
    defaultName = "Our Squad",
    members,
    backgroundColor = "#0f0f0f",
    textColor = "#e3e3db",
    accentColor = "#f93535",
    containerClassName = "",
    containerStyle = {},
    profileImagesContainerClassName = "",
    profileImagesContainerStyle = {},
    profileNamesContainerClassName = "",
    profileNamesContainerStyle = {},
    defaultNameClassName = "",
    defaultNameStyle = {},
    memberNameClassName = "",
    memberNameStyle = {},
    hoverScaleFactor = 2,
    animDuration = 0.75,
    charStagger = 0.025,
  }: TeamSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultNameRef = useRef<HTMLHeadingElement>(null);
    const animationRef = useRef<gsap.Context | null>(null);
    const isHoveringImageRef = useRef(false);
    const defaultTextDelayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;

      animationRef.current = gsap.context(() => {
        // Run animation on ALL screen sizes (removed the < 900 guard)
        const nameHeadings = gsap.utils.toArray(".name h1") as HTMLElement[];
        nameHeadings.forEach((heading) => {
          const split = new SplitText(heading, { type: "chars" });
          split.chars.forEach((char) => char.classList.add("letter"));
        });

        const defaultLetters = defaultNameRef.current?.querySelectorAll(".letter");
        if (defaultLetters) gsap.set(defaultLetters, { y: "0%" });

        const profileImages = gsap.utils.toArray(".profile-image");

        profileImages.forEach((image, index) => {
          const typedImage = image as HTMLElement;
          const correspondingName = document.querySelector(
            `.profile-names .name:nth-child(${index + 2})`
          );
          const letters = correspondingName?.querySelectorAll(".letter");

          if (letters) gsap.set(letters, { y: "100%" });

          const originalWidth = typedImage.offsetWidth;
          const originalHeight = typedImage.offsetHeight;

          // Shared activate/deactivate logic used by both mouse and touch
          const activate = () => {
            isHoveringImageRef.current = true;
            if (defaultTextDelayRef.current) {
              clearTimeout(defaultTextDelayRef.current);
              defaultTextDelayRef.current = null;
            }

            gsap.to(typedImage, {
              width: originalWidth * hoverScaleFactor,
              height: originalHeight * hoverScaleFactor,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
            if (defaultLetters) {
              gsap.killTweensOf([defaultLetters, letters]);
              gsap.to(defaultLetters, {
                y: "-110%",
                ease: "power4.out",
                overwrite: "auto",
                stagger: { each: charStagger, from: "center" },
              });
            }
            if (letters) {
              gsap.to(letters, {
                y: "0%",
                ease: "power4.out",
                overwrite: "auto",
                stagger: { each: charStagger, from: "center" },
              });
            }
          };

          const deactivate = () => {
            isHoveringImageRef.current = false;

            gsap.killTweensOf([defaultLetters, letters, typedImage]);
            gsap.to(typedImage, {
              width: originalWidth,
              height: originalHeight,
              overwrite: "auto",
              ease: "power4.out",
            });
            if (letters) {
              gsap.to(letters, {
                y: "100%",
                ease: "power4.out",
                overwrite: "auto",
                stagger: { each: charStagger, from: "center" },
              });
            }
            if (!isHoveringImageRef.current && defaultLetters) {
              gsap.killTweensOf(defaultLetters);
              defaultTextDelayRef.current = setTimeout(() => {
                if (!isHoveringImageRef.current && defaultLetters) {
                  gsap.to(defaultLetters, {
                    y: "0%",
                    ease: "power4.out",
                    overwrite: "auto",
                    stagger: { each: charStagger, from: "center" },
                  });
                }
              }, 350);
            }
          };

          // Mouse events (desktop)
          typedImage.addEventListener("mouseenter", activate);
          typedImage.addEventListener("mouseleave", deactivate);

          // Touch events (mobile) — touchstart activates, touchend deactivates
          typedImage.addEventListener("touchstart", (e) => {
            e.preventDefault(); // prevent ghost click / scroll interference
            activate();
          }, { passive: false });

          typedImage.addEventListener("touchend", () => {
            // Small delay so the name is visible briefly before reverting
            setTimeout(() => deactivate(), 600);
          });
        });

        const container = containerRef.current;
        if (!container) return;

        const handleContainerLeave = () => {
          if (defaultLetters) {
            gsap.killTweensOf(defaultLetters);
            gsap.to(defaultLetters, {
              y: "0%",
              ease: "power4.out",
              duration: 0.4,
              delay: 0.35,
              stagger: { each: charStagger, from: "center" },
            });
          }
        };

        container.addEventListener("mouseleave", handleContainerLeave);
        return () => container.removeEventListener("mouseleave", handleContainerLeave);
      }, containerRef);

      return () => animationRef.current?.revert();
    }, [members, hoverScaleFactor, animDuration, charStagger]);

    return (
      <section
        ref={containerRef}
        className={`relative w-full h-screen flex flex-col justify-center items-center space-y-10 ${containerClassName}`}
        style={{ backgroundColor, ...containerStyle }}
      >
        {/* Names block — always on top on both mobile and desktop */}
        <div
          className={`profile-names w-full min-h-[4rem] md:min-h-[16rem] overflow-hidden relative ${profileNamesContainerClassName}`}
          style={profileNamesContainerStyle}
        >
          <div className="name default absolute w-full text-center">
            <h1
              ref={defaultNameRef}
              className={`uppercase text-[4rem] font-black tracking-[-0.3rem] leading-none select-none md:text-[12rem] lg:text-[10rem] xl:text-[14rem] md:tracking-normal ${defaultNameClassName}`}
              style={{ color: textColor, fontFamily: "'Barlow Condensed', sans-serif", ...defaultNameStyle }}
            >
              {defaultName}
            </h1>
          </div>

          {members.map((member, index) => (
            <div key={index} className="name absolute w-full text-center">
              <h1
                className={`uppercase text-[4rem] font-black tracking-[-0.3rem] leading-none select-none md:text-[15rem]  md:tracking-normal ${memberNameClassName} ${member.nameClassName || ""}`}
                style={{ color: accentColor, fontFamily: "'Barlow Condensed', sans-serif", ...memberNameStyle, ...(member.nameStyle || {}) }}
              >
                {member.name}
              </h1>
            </div>
          ))}
        </div>

        {/* Images block — always on bottom on both mobile and desktop */}
        <div
          className={`profile-images w-full flex justify-center items-center flex-wrap gap-x-2 ${profileImagesContainerClassName}`}
          style={profileImagesContainerStyle}
        >
          {members.map((member, index) => (
            <div
              key={index}
              className={`profile-image relative w-[70px] h-[70px] cursor-pointer transition-[width,height] duration-300 md:w-[80px] md:h-[80px] ${member.imageClassName || ""}`}
              style={member.imageStyle}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={140}
                height={140}
                className="w-full h-full rounded object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }