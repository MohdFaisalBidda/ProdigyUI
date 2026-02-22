"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// gsap.registerPlugin(SplitText);

function Cards() {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const titleRef = useRef<HTMLHeadingElement>(null);

  // useEffect(() => {
  //   if (!containerRef.current || !titleRef.current) return;

  //   const cardContainer = containerRef.current;
  //   const cardPaths = cardContainer.querySelectorAll(
  //     ".svg-stroke-1 svg path, .svg-stroke-2 svg path"
  //   );

  //   const split = SplitText.create(titleRef.current, {
  //     type: "words",
  //     mask: "words",
  //   });

  //   gsap.set(split.words, { yPercent: 100 });

  //   // Setup stroke dash
  //   cardPaths.forEach((path) => {
  //     const length = (path as SVGPathElement).getTotalLength();
  //     path.style.strokeDasharray = `${length}`;
  //     path.style.strokeDashoffset = `${length}`;
  //   });

  //   let tl: gsap.core.Timeline;

  //   const handleEnter = () => {
  //     if (tl) tl.kill();
  //     tl = gsap.timeline();

  //     cardPaths.forEach((path) => {
  //       tl.to(
  //         path,
  //         {
  //           strokeDashoffset: 0,
  //           attr: { "stroke-width": 700 },
  //           duration: 1.5,
  //           ease: "power2.out",
  //         },
  //         0
  //       );
  //     });

  //     tl.to(
  //       split.words,
  //       {
  //         yPercent: 0,
  //         duration: 0.75,
  //         ease: "power3.out",
  //         stagger: 0.075,
  //       },
  //       0.35
  //     );
  //   };

  //   const handleLeave = () => {
  //     if (tl) tl.kill();
  //     tl = gsap.timeline();

  //     cardPaths.forEach((path) => {
  //       const length = (path as SVGPathElement).getTotalLength();

  //       tl.to(
  //         path,
  //         {
  //           strokeDashoffset: length,
  //           attr: { "stroke-width": 200 },
  //           duration: 1,
  //           ease: "power2.out",
  //         },
  //         0
  //       );
  //     });

  //     tl.to(
  //       split.words,
  //       {
  //         yPercent: 100,
  //         duration: 0.5,
  //         ease: "power3.out",
  //         stagger: { each: 0.05, from: "end" },
  //       },
  //       0
  //     );
  //   };

  //   cardContainer.addEventListener("mouseenter", handleEnter);
  //   cardContainer.addEventListener("mouseleave", handleLeave);

  //   return () => {
  //     cardContainer.removeEventListener("mouseenter", handleEnter);
  //     cardContainer.removeEventListener("mouseleave", handleLeave);
  //     split.revert();
  //   };
  // }, []);

  return (
    <div
    // ref={containerRef}
    className="relative flex-1 aspect-square rounded-4xl overflow-hidden" id='card-1'>
      <div className="card-img">
        <img src="/img2.avif" alt="" className='w-full h-full object-cover' />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full text-[var(--svg-stroke-1)]">
        <svg
          width="2453"
          height="2273"
          viewBox="0 0 2453 2273"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className='w-full h-full object-cover'
        >
          <path
            d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.26C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
            stroke="#F5EE41"
            strokeWidth="200"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full text-[var(--svg-stroke-2)]">
        <svg
          width="2250"
          height="2535"
          viewBox="0 0 2250 2535"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className='w-full h-full object-cover'
        >
          <path
            d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C318.177 401.672 244.781 193.012 244.781 193.012"
            stroke="#6E44FF"
            strokeWidth="200"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-[var(--card-copy)]">
        <h3
        // ref={titleRef}
        className='text-[clamp(1.25rem,2.5vw,3rem)] font-[450] leading-[1.25] tracking-[-0.025rem]will-change-transform'>Hello World</h3>
      </div>
    </div>
  );
}

export default Cards;