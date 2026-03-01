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

  useEffect(() => {
    if (typeof window === "undefined") return;

    animationRef.current = gsap.context(() => {
      if (window.innerWidth < 900) return;

      const nameHeadings = gsap.utils.toArray(".name h1") as HTMLElement[];
      nameHeadings.forEach((heading) => {
        const split = new SplitText(heading, { type: "chars" });
        split.chars.forEach((char) => char.classList.add("letter"));
      });

      const defaultLetters = defaultNameRef.current?.querySelectorAll(".letter");
      if (defaultLetters) gsap.set(defaultLetters, { y: "100%" });

      const profileImages = gsap.utils.toArray(".profile-image");

      profileImages.forEach((image, index) => {
        const typedImage = image as HTMLElement;
        const correspondingName = document.querySelector(
          `.profile-names .name:nth-child(${index + 2})`
        );
        const letters = correspondingName?.querySelectorAll(".letter");

        if (letters) gsap.set(letters, { y: "-100%" });

        const originalWidth = typedImage.offsetWidth;
        const originalHeight = typedImage.offsetHeight;

        typedImage.addEventListener("mouseenter", () => {
          gsap.to(typedImage, {
            width: originalWidth * hoverScaleFactor,
            height: originalHeight * hoverScaleFactor,
            duration: animDuration,
            ease: "power2.out",
            stagger: { each: charStagger, from: "center" },
          });
          if (defaultLetters) {
            gsap.to(defaultLetters, {
              y: "-100%",
              ease: "power4.out",
              duration: animDuration * 2,
              stagger: { each: charStagger, from: "center" },
            });
          }
          if (letters) {
            gsap.to(letters, {
              y: "0%",
              ease: "power4.out",
              duration: animDuration,
              stagger: { each: charStagger, from: "center" },
            });
          }
        });

        typedImage.addEventListener("mouseleave", () => {
          gsap.to(typedImage, {
            width: originalWidth,
            height: originalHeight,
            duration: animDuration,
            ease: "power4.out",
          });
          if (letters) {
            gsap.to(letters, {
              y: "100%",
              ease: "power4.out",
              duration: animDuration,
              stagger: { each: charStagger, from: "center" },
            });
          }
          if (defaultLetters) {
            gsap.to(defaultLetters, {
              y: "100%",
              ease: "power4.out",
              duration: animDuration,
              stagger: { each: charStagger, from: "center" },
            });
          }
        });
      });

      const container = containerRef.current;
      if (!container) return;

      const handleContainerLeave = () => {
        if (defaultLetters) {
          gsap.to(defaultLetters, {
            y: "100%",
            ease: "power4.out",
            duration: animDuration,
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
      className={`relative w-full h-screen flex lg:flex-col-reverse flex-col justify-center items-center space-y-10 overflow-hidden ${containerClassName}`}
      style={{ backgroundColor, ...containerStyle }}
    >
      <div
        className={`profile-images w-full flex justify-center items-center flex-wrap gap-x-10 ${profileImagesContainerClassName}`}
        style={profileImagesContainerStyle}
      >
        {members.map((member, index) => (
          <div
            key={index}
            className={`profile-image relative w-[70px] h-[70px] cursor-pointer transition-[width,height] duration-300 md:w-[60px] md:h-[60px] ${member.imageClassName || ""}`}
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

      <div
        className={`profile-names h-[20rem] w-full overflow-hidden md:h-16 ${profileNamesContainerClassName}`}
        style={profileNamesContainerStyle}
      >
        <div className="name default absolute w-full text-center">
          <h1
            ref={defaultNameRef}
            className={`uppercase font-barlow-condensed text-[15rem] font-black tracking-[-0.5rem] leading-none translate-y-[-100%] select-none md:text-[4rem] md:tracking-normal ${defaultNameClassName}`}
            style={{ color: textColor, ...defaultNameStyle }}
          >
            {defaultName}
          </h1>
        </div>

        {members.map((member, index) => (
          <div key={index} className="name absolute w-full text-center">
            <h1
              className={`uppercase font-barlow-condensed text-[20rem] font-black tracking-[-0.5rem] leading-none select-none md:text-[4rem] md:tracking-normal ${memberNameClassName} ${member.nameClassName || ""}`}
              style={{ color: accentColor, ...memberNameStyle, ...(member.nameStyle || {}) }}
            >
              {member.name}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
}