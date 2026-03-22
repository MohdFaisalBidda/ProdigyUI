"use client";

import Lenis from 'lenis';
import lottie from 'lottie-web';
import React, { useEffect, useRef, useState } from 'react'

export interface GlowingLightProps {
    lottiePath?: string;
}

function GlowingLight({ lottiePath = "/fire.json" }: GlowingLightProps) {
    const lottieRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const spotlightMaskRef = useRef<HTMLDivElement>(null);

    const state = useRef({
        isTracking: false,
        cursorDetected: false,
    })

    const pos = useRef({
        mouse: {
            target: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
        },
        lottie: {
            current: { x: 0, y: 0 },
            center: { x: 0, y: 0 },
        }
    })

    function init() {
        if (!spotlightRef.current || !lottieContainerRef.current) return;

        const spotlightRect = spotlightRef.current.getBoundingClientRect();
        const lottieRect = lottieContainerRef.current.getBoundingClientRect();

        // Calculate lottie center relative to spotlight
        pos.current.lottie.center.x =
            lottieRect.left - spotlightRect.left + lottieRect.width / 2;

        pos.current.lottie.center.y =
            lottieRect.top - spotlightRect.top + lottieRect.height / 2;

        // Set mouse starting position to lottie center
        pos.current.mouse.current.x = pos.current.lottie.center.x;
        pos.current.mouse.current.y = pos.current.lottie.center.y;

        pos.current.mouse.target.x = pos.current.lottie.center.x;
        pos.current.mouse.target.y = pos.current.lottie.center.y;
    }

    function updateCursor(x: number, y: number) {
        if (!state.current.cursorDetected) return;

        pos.current.mouse.last.x = x;
        pos.current.mouse.last.y = y;

        const spotlightRect = spotlightRef.current?.getBoundingClientRect();
        const isInsideSpotlight = x >= spotlightRect?.left! && x <= spotlightRect?.right! && y >= spotlightRect?.top! && y <= spotlightRect?.bottom!;

        if (isInsideSpotlight) {
            pos.current.mouse.target.x = x - spotlightRect?.left!;
            pos.current.mouse.target.y = y - spotlightRect?.top!;
            state.current.isTracking = true;
            spotlightMaskRef.current?.style.setProperty("opacity", "0.85");
        } else {
            state.current.isTracking = false;
            spotlightMaskRef.current?.style.setProperty("opacity", "0");

        }
    }

    let rafId: number;
    function animate() {
        pos.current.mouse.current.x += (pos.current.mouse.target.x - pos.current.mouse.current.x) * 0.1;
        pos.current.mouse.current.y += (pos.current.mouse.target.y - pos.current.mouse.current.y) * 0.1;

        spotlightMaskRef.current?.style.setProperty("--mouse-x", `${pos.current.mouse.current.x}px`);
        spotlightMaskRef.current?.style.setProperty("--mouse-y", `${pos.current.mouse.current.y}px`);

        const targetX = state.current.isTracking ? pos.current.mouse.current.x - pos.current.lottie.center.x : 0;

        const targetY = state.current.isTracking ? pos.current.mouse.current.y - pos.current.lottie.center.y : 0;

        pos.current.lottie.current.x += (targetX - pos.current.lottie.current.x) * 0.1;
        pos.current.lottie.current.y += (targetY - pos.current.lottie.current.y) * 0.1;

        if (!lottieContainerRef.current) return;
        lottieContainerRef.current.style.transform = `translate(${pos.current.lottie.current.x}px, ${pos.current.lottie.current.y}px)`;

        rafId = requestAnimationFrame(animate);
    }

    useEffect(() => {
        if (typeof window === "undefined") return;

        new Lenis({ autoRaf: true });

        if (!lottieRef.current) return;
        lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: lottiePath
        })
    }, [lottiePath]);

    useEffect(() => {
        animate();
        return () => cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            init();
        });

        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            init();
        }

        const handleScroll = () => {
            if (state.current.cursorDetected) {
                updateCursor(pos.current.mouse.last.x, pos.current.mouse.last.y)
            }
        }

        const onMouseEnter = (e: MouseEvent) => {
            state.current.cursorDetected = true;
            updateCursor(e.clientX, e.clientY);
        }

        const onMouseMove = (e: MouseEvent) => {
            state.current.cursorDetected = true;
            updateCursor(e.clientX, e.clientY);
        }

        window.addEventListener("mouseenter", onMouseEnter);
        window.addEventListener("mousemove", onMouseMove);

        window.addEventListener("scroll", handleScroll);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mouseenter", onMouseEnter);
            window.removeEventListener("mousemove", onMouseMove);
        }
    }, []);


    return (
        <div
            className='bg-[#141414] text-[#f2eec2]'>
            {/* <section className='intro relative w-full h-svh flex flex-col justify-center items-center gap-4'
                style={{
                    padding: "2rem"
                }}
            >
                <h1 className='text-[clamp(3rem,5vw,7rem)] tracking-tighter font-medium'>Enter the Field</h1>
            </section> */}

            <section
                ref={spotlightRef}
                className="spotlight relative isolate w-full h-svh flex flex-col justify-center items-center gap-4 p-8 group">

                {/* Content */}
                <div
                    className="lottie-container relative z-10 flex flex-col items-center gap-4 group-hover:opacity-100 opacity-40">

                    <div ref={lottieContainerRef} className="relative w-32 h-32 pointer-events-none">
                        <div className="fire-glow absolute inset-0
        bg-[radial-gradient(circle,rgba(255,0,72,0.75)_0%,rgba(255,145,0,0.6)_30%,rgba(255,242,140,0.25)_50%,transparent_70%)]
        blur-xl opacity-40">
                        </div>

                        <div ref={lottieRef} className="lottie relative w-full h-full scale-125 z-10"></div>
                    </div>
                </div>


                <h1 className="text-[clamp(3rem,5vw,7rem)] tracking-tighter font-medium">
                    Guided by Interaction
                </h1>

                <p className="text-[1.5rem] w-full lg:text-3xl lg:w-[60%] text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore facere vitae minima. Quasi fugit totam officia consequuntur nisi dignissimos, perspiciatis praesentium tempore perferendis ad esse tempora cumque numquam architecto accusamus! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur nam nisi et vitae odio error deleniti consequuntur, voluptatibus ut eligendi. Atque, amet eligendi harum obcaecati libero rerum laudantium quae laborum.
                </p>

                {/* Mask */}
                <div
                    ref={spotlightMaskRef}
                    className="spotlight-mask absolute top-0 left-0 w-full h-full z-0 pointer-events-none
    bg-[#141414]
    transition-opacity duration-300 ease-in-out
    [mask:radial-gradient(circle_200px_at_var(--mouse-x)_var(--mouse-y),transparent_0%,transparent_40%,#141414_80%,#141414_100%)]
    [-webkit-mask:radial-gradient(circle_200px_at_var(--mouse-x)_var(--mouse-y),transparent_0%,transparent_40%,#141414_80%,#141414_100%)] opacity-0 group-:active:opacity-85">
                </div>

            </section>

            {/* <section className='outro relative w-full h-svh flex flex-col justify-center items-center gap-4'
                style={{
                    padding: "2rem"
                }}
            >
                <h1 className='text-[clamp(3rem,5vw,7rem)] tracking-tighter font-medium'>The Interaction Ends</h1>
            </section> */}
        </div>
    )
}

export default GlowingLight