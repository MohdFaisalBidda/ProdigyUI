"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SplitCardsProps {
  cards: {
    id: string;
    frontImage: string;
    backTitle: string;
    backDescription: string;
  }[];
  introTitle?: string;
  headerTitle?: string;
  outroTitle?: string;
  containerClassName?: string;
}

export default function SplitCards({
  cards = [],
  introTitle = "Building the Future of Global Connectivity",
  headerTitle = "Three Forces Behind a Connected World",
  outroTitle = "Start Connecting Without Limits",
  containerClassName = "",
}: SplitCardsProps) {
  const stickyHeaderRef = useRef<HTMLHeadingElement>(null);

  const defaultCards = [
    {
      id: "card-1",
      frontImage: "/split1.png",
      backTitle: "Global Reach",
      backDescription: "Connect users, systems, and data across borders seamlessly.",
    },
    {
      id: "card-2",
      frontImage: "/split2.png",
      backTitle: "Intelligent Core",
      backDescription: "AI-powered decision making at the heart of everything.",
    },
    {
      id: "card-3",
      frontImage: "/split3.png",
      backTitle: "Rapid Expansion",
      backDescription: "Scale globally with speed, precision, and reliability.",
    },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;
  const firstCardId = displayCards[0]?.id || "card-1";
  const lastCardId = displayCards[displayCards.length - 1]?.id || "card-3";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const cardContainer = document.querySelector(".card-container");
    const stickyHeader = document.querySelector(".sticky-header h1");
    if (!cardContainer || !stickyHeader) return;

    let isGapAnimationCompleted = false;
    let isFlipAnimationCompleted = false;

    function initAnimation() {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      const mm = gsap.matchMedia();

      mm.add("(max-width: 999px)", () => {
        document.querySelectorAll(".sticky-header h1").forEach((el: any) => (el.style = ""));
        return {};
      });

      mm.add("(min-width: 1000px)", () => {
        ScrollTrigger.create({
          trigger: ".stickyy",
          start: "top top",
          end: `+=${window.innerHeight * 4}px`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress >= 0.1 && progress <= 0.25) {
              const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
              const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
              const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

              gsap.set(stickyHeader, {
                y: yValue,
                opacity: opacityValue,
              });
            } else if (progress < 0.1) {
              gsap.set(stickyHeader, {
                y: 40,
                opacity: 0,
              });
            } else if (progress > 0.25) {
              gsap.set(stickyHeader, {
                y: 0,
                opacity: 1,
              });
            }

            if (progress <= 0.25) {
              const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
              gsap.set(cardContainer, { width: `${widthPercentage}%` });
            } else {
              gsap.set(cardContainer, { width: "60%" });
            }

            if (progress >= 0.35 && !isGapAnimationCompleted) {
              gsap.to(cardContainer, {
                gap: "20px",
                duration: 0.5,
                ease: "power3.out",
              });

              gsap.to(".card", {
                borderRadius: "20px",
                duration: 0.5,
                ease: "power3.out",
              });

              isGapAnimationCompleted = true;
            } else if (progress < 0.35 && isGapAnimationCompleted) {
              gsap.to(cardContainer, {
                gap: "0px",
                duration: 0.5,
                ease: "power3.out",
              });

              gsap.to(`#${firstCardId}`, {
                borderRadius: "20px 0 0 20px",
                duration: 0.5,
                ease: "power3.out",
              });

              displayCards.slice(1, -1).forEach((card) => {
                gsap.to(`#${card.id}`, {
                  borderRadius: "0",
                  duration: 0.5,
                  ease: "power3.out",
                });
              });

              gsap.to(`#${lastCardId}`, {
                borderRadius: "0 20px 20px 0",
                duration: 0.5,
                ease: "power3.out",
              });

              isGapAnimationCompleted = false;
            }

            if (progress >= 0.7 && !isFlipAnimationCompleted) {
              gsap.to(".card", {
                rotationY: 180,
                duration: 0.75,
                ease: "power3.inOut",
                stagger: 0.1,
              });

              gsap.to([`#${firstCardId}`, `#${lastCardId}`], {
                y: 30,
                rotationZ: (i) => [-15, 15][i],
                duration: 0.75,
                ease: "power3.inOut",
              });

              isFlipAnimationCompleted = true;
            } else if (progress < 0.7 && isFlipAnimationCompleted) {
              gsap.to(".card", {
                rotationY: 0,
                duration: 0.75,
                ease: "power3.inOut",
                stagger: -0.1,
              });

              gsap.to([`#${firstCardId}`, `#${lastCardId}`], {
                y: 0,
                rotationZ: 0,
                duration: 0.75,
                ease: "power3.inOut",
              });

              isFlipAnimationCompleted = false;
            }
          },
        });
      });
    }

    initAnimation();

    let resizeTimer: NodeJS.Timeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initAnimation();
      }, 250);
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, [firstCardId, lastCardId]);

  return (
    <div className={containerClassName}>
      <section className="intro relative w-full h-svh p-8 bg-black text-white text-center flex justify-center items-center">
        <h1 className="text-4xl md:text-[4rem] font-medium mx-auto my-0 md:w-1/2 w-full">
          {introTitle}
        </h1>
      </section>
      <section className="stickyy h-max flex-col md:flex justify-center items-center relative w-full md:h-svh md:p-8 bg-black text-white">
        <div className="sticky-header relative top-0 left-0 transform-none mb-0 md:absolute md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <h1
            ref={stickyHeaderRef}
            className="text-4xl md:text-[4rem] font-medium relative text-center transform opacity-100 md:opacity-0"
          >
            {headerTitle}
          </h1>
        </div>

        <div className="card-container relative w-full flex-col gap-8 md:gap-0 md:flex-row md:w-[75%] flex perspective-[1000px] translate-y-20 will-change-auto">
          {displayCards.map((card, index) => (
            <div
              key={card.id}
              className={`card w-full max-w-[400px] md:w-auto md:max-w-full mx-auto relative flex-1 aspect-[5/7] transform-3d transform ${index === 0
                  ? "rounded-l-[20px] md:rounded-l-[20px] md:rounded-r-none"
                  : index === displayCards.length - 1
                    ? "rounded-[20px] md:rounded-r-[20px] md:rounded-l-none"
                    : "rounded-none"
                }`}
              id={card.id}
            >
              <div className="card-front absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={card.frontImage}
                  alt={card.backTitle}
                />
              </div>
              <div
                className="card-back absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden flex justify-center items-center text-center rotate-y-180 p-8"
                style={{
                  backgroundImage: `url(${card.frontImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                <div className="flex flex-col gap-1 z-10">
                  <h2 className="text-[2rem] font-medium">{card.backTitle}</h2>
                  <p className="text-sm">{card.backDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="outro relative w-full h-svh p-8 bg-black text-white text-center flex justify-center items-center">
        <h1 className="text-4xl md:text-[4rem] font-medium mx-auto my-0 md:w-1/3 w-full">
          {outroTitle}
        </h1>
      </section>
    </div>
  );
}
