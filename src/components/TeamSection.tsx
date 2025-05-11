"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(SplitText);

interface TeamMember {
  image: string;
  name: string;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  nameClassName?: string;
  nameStyle?: React.CSSProperties;
}

interface TeamSectionProps {
  defaultName?: string;
  members: TeamMember[];
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
  animationConfig?: {
    duration?: number;
    ease?: string;
    stagger?: number;
    scaleFactor?: number;
  };
}

export default function TeamSection({
  defaultName = "Our Squad",
  members,
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
  animationConfig = {
    duration: 0.75,
    ease: "power4.out",
    stagger: 0.025,
    scaleFactor: 2,
  },
}: TeamSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultNameRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<gsap.Context>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    animationRef.current = gsap.context(() => {
      if (window.innerWidth < 900) return;

      // Split text into letters
      const nameHeadings = gsap.utils.toArray(".name h1") as HTMLElement[];

      nameHeadings.forEach((heading) => {
        const split = new SplitText(heading, { type: "chars" });
        split.chars.forEach((char) => char.classList.add("letter"));
      });

      // Set initial states
      const defaultLetters =
        defaultNameRef.current?.querySelectorAll(".letter");

      if (defaultLetters) {
        gsap.set(defaultLetters, { y: "100%" });
      }

      // Set up hover animations for profile images
      const profileImages = gsap.utils.toArray(".profile-image");

      profileImages.forEach((image: any, index: number) => {
        const correspondingName = document.querySelector(
          `.profile-names .name:nth-child(${index + 2})`
        );
        const letters = correspondingName?.querySelectorAll(".letter");

        if (letters) {
          gsap.set(letters, { y: "-100%" });
        }

        // Store original dimensions
        const originalWidth = image.offsetWidth;
        const originalHeight = image.offsetHeight;

        image.addEventListener("mouseenter", () => {
          gsap.to(image, {
            width: originalWidth * 2,
            height: originalHeight * 2,
            duration: 0.75,
            ease: "power2.out",
            stagger: { each: 0.025, from: "center" },
          });

          if (defaultLetters) {
            gsap.to(defaultLetters, {
              y: "-100%",
              ease: "power4.out",
              duration: 1.5,
              stagger: { each: 0.025, from: "center" },
            });
          }

          if (letters) {
            gsap.to(letters, {
              y: "0%",
              ease: "power4.out",
              duration: 0.75,
              stagger: { each: 0.025, from: "center" },
            });
          }
        });

        image.addEventListener("mouseleave", () => {
          gsap.to(image, {
            width: originalWidth,
            height: originalHeight,
            duration: 0.75,
            ease: "power4.out",
          });

          if (letters) {
            gsap.to(letters, {
              y: "100%",
              ease: "power4.out",
              duration: 0.75,
              stagger: { each: 0.025, from: "center" },
            });
          }

          if (defaultLetters) {
            gsap.to(defaultLetters, {
              y: "100%",
              ease: "power4.out",
              duration: 0.75,
              stagger: { each: 0.025, from: "center" },
            });
          }
        });
      });

      // Container hover animations
      const container = containerRef.current;
      if (!container) return;

      const handleContainerLeave = () => {
        if (defaultLetters) {
          gsap.to(defaultLetters, {
            y: "100%",
            ease: "power4.out",
            duration: 0.75,
            stagger: { each: 0.025, from: "center" },
          });
        }
      };

      container.addEventListener("mouseleave", handleContainerLeave);

      return () => {
        container.removeEventListener("mouseleave", handleContainerLeave);
      };
    }, containerRef);

    return () => animationRef.current?.revert();
  }, [members]);

  return (
    <section
      ref={containerRef}
      className={`relative w-screen h-screen bg-[#0f0f0f] text-[#e3e3db] flex lg:flex-col-reverse flex-col justify-center items-center space-y-10 overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      <div
        className={`profile-images w-full flex justify-center items-center flex-wrap gap-x-10 ${profileImagesContainerClassName}`}
        style={profileImagesContainerStyle}
      >
        {members.map((member, index) => (
          <div
            key={index}
            className={`profile-image relative w-[70px] h-[70px] cursor-pointer transition-[width,height] duration-300 md:w-[60px] md:h-[60px] ${
              member.imageClassName || ""
            }`}
            style={member.imageStyle}
          >
            <Image
              src={member.image}
              alt={member.name}
              width={140}
              height={140}
              className={`w-full h-full rounded object-cover ${
                member.imageClassName || ""
              }`}
              style={member.imageStyle}
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
            className={`uppercase font-barlow-condensed text-[15rem] font-black tracking-[-0.5rem] leading-none text-[#e3e3db] translate-y-[-100%]  select-none md:text-[4rem] md:tracking-normal ${defaultNameClassName}`}
            style={defaultNameStyle}
          >
            {defaultName}
          </h1>
        </div>

        {members.map((member, index) => (
          <div key={index} className="name absolute w-full text-center">
            <h1
              className={`uppercase font-barlow-condensed text-[20rem] font-black tracking-[-0.5rem] leading-none text-[#f93535] select-none md:text-[4rem] md:tracking-normal ${memberNameClassName} ${
                member.nameClassName || ""
              }`}
              style={{ ...memberNameStyle, ...(member.nameStyle || {}) }}
            >
              {member.name}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
}
