"use client"

import gsap from "gsap";
import Lenis from "lenis";
import { useEffect } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger";

function page() {

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis()
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        })
        gsap.ticker.lagSmoothing(0)

        const cardContainer = document.querySelector('.card-container')
        const stickyHeader = document.querySelector('.sticky-header h1')
        if (!cardContainer || !stickyHeader) return;

        let isGapAnimationCompleted = false
        let isFlipAnimationCompleted = false

        function initAnimation() {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

            const mm = gsap.matchMedia()

            mm.add("(max-width: 999px)", () => {
                document.querySelectorAll('.sticky-header h1').forEach((el: any) => el.style = "");
                return {};
            })

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
                            const headerProgress = gsap.utils.mapRange(
                                0.1,
                                0.25,
                                0,
                                1,
                                progress
                            )
                            const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress)
                            const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

                            gsap.set(stickyHeader, {
                                y: yValue,
                                opacity: opacityValue
                            });
                        } else if (progress < 0.1) {
                            gsap.set(stickyHeader, {
                                y: 40,
                                opacity: 0
                            })
                        } else if (progress > 0.25) {
                            gsap.set(stickyHeader, {
                                y: 0,
                                opacity: 1
                            })
                        }

                        if (progress <= 0.25) {
                            const widthPercentage = gsap.utils.mapRange(
                                0, 0.25, 75, 60, progress
                            )
                            gsap.set(cardContainer, { width: `${widthPercentage}%` })
                        } else {
                            gsap.set(cardContainer, { width: '60%' })
                        }

                        if (progress >= 0.35 && !isGapAnimationCompleted) {
                            gsap.to(cardContainer, {
                                gap: "20px",
                                duration: 0.5,
                                ease: "power3.out",
                            })

                            gsap.to(["#card-1", "#card-2", "#card-3"], {
                                borderRadius: "20px",
                                duration: 0.5,
                                ease: "power3.out",
                            })

                            isGapAnimationCompleted = true
                        } else if (progress < 0.35 && isGapAnimationCompleted) {
                            gsap.to(cardContainer, {
                                gap: "0px",
                                duration: 0.5,
                                ease: "power3.out",
                            })

                            gsap.to("#card-1", {
                                borderRadius: "20px 0 0 20px",
                                duration: 0.5,
                                ease: "power3.out",
                            });

                            gsap.to("#card-2", {
                                borderRadius: "0",
                                duration: 0.5,
                                ease: "power3.out",
                            });

                            gsap.to("#card-3", {
                                borderRadius: "0 20px 20px 0",
                                duration: 0.5,
                                ease: "power3.out",
                            })

                            isGapAnimationCompleted = false
                        }

                        if (progress >= 0.7 && !isFlipAnimationCompleted) {
                            gsap.to(".card", {
                                rotationY: 180,
                                duration: 0.75,
                                ease: "power3.inOut",
                                stagger: 0.1,
                            })

                            gsap.to(["#card-1", "#card-3"], {
                                y: 30,
                                rotationZ: (i) => [-15, 15][i],
                                duration: 0.75,
                                ease: "power3.inOut",
                            })

                            isFlipAnimationCompleted = true
                        } else if (progress < 0.7 && isFlipAnimationCompleted) {
                            gsap.to(".card", {
                                rotationY: 0,
                                duration: 0.75,
                                ease: "power3.inOut",
                                stagger: -0.1,
                            })

                            gsap.to(["#card-1", "#card-3"], {
                                y: 0,
                                rotationZ: 0,
                                duration: 0.75,
                                ease: "power3.inOut",
                            })

                            isFlipAnimationCompleted = false
                        }
                    }
                })
            })
        }

        initAnimation()

        let resizeTimer: any;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                initAnimation()
            }, 250)
        })

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            lenis.destroy();
        };
    }, [])

    return (
        <>
            <section className="intro relative w-full h-svh p-8 bg-black text-white text-center flex justify-center items-center">
                <h1 className='text-4xl md:text-[4rem] font-medium mx-auto my-0 md:w-1/2 w-full'>Building the Future of Global Connectivity</h1>
            </section>
            <section className='stickyy h-max flex-col md:flex justify-center items-center relative w-full md:h-svh md:p-8 bg-black text-white'>
                <div className="sticky-header relative top-0 left-0 transform-none  mb-0 md:absolute md:top-[20%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                    <h1 className='text-4xl md:text-[4rem] font-medium relative text-center transform opacity-100 md:opacity-0'>Three Forces Behind a Connected World</h1>
                </div>

                <div className="card-container relative w-full flex-col gap-8 md:gap-0 md:flex-row md:w-[75%] flex perspective-[1000px] translate-y-20 will-change-auto">

                    <div className="card w-full max-w-[400px] md:w-auto md:max-w-full mx-auto relative flex-1 aspect-[5/7] transform-3d transform rounded-l-[20px] md:rounded-l-[20px] md:rounded-r-none" id='card-1'>
                        <div className="card-front absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden">
                            <img className='w-full h-full object-cover' src="/split1.png" alt="" />
                        </div>
                        <div className="card-back absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden flex justify-center items-center text-center rotate-y-180 p-8 "
                            style={{ backgroundImage: 'url(/split1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            <div className="flex flex-col gap-1 z-10">
                                <h2 className='text-[2rem] font-medium'>Global Reach</h2>
                                <p className='text-sm'>Connect users, systems, and data across borders seamlessly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card w-full max-w-[400px] md:w-auto md:max-w-full mx-auto relative flex-1 aspect-[5/7] transform-3d transform rounded-none" id='card-2'>
                        <div className="card-front absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden ">
                            <img className='w-full h-full object-cover' src="/split2.png" alt="" />
                        </div>
                        <div className="card-back absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden flex justify-center items-center text-center rotate-y-180 p-8 "
                            style={{ backgroundImage: 'url(/split2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            <div className="flex flex-col gap-1 z-10">
                                <h2 className='text-[2rem] font-medium'>Intelligent Core</h2>
                                <p className='text-sm'>AI-powered decision making at the heart of everything.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card w-full max-w-[400px] md:w-auto md:max-w-full mx-auto rounded-[20px] relative flex-1 aspect-[5/7] transform-3d transform rounded-r-[20px] md:rounded-r-[20px] md:rounded-l-none" id='card-3'>
                        <div className="card-front absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden">
                            <img className='w-full h-full object-cover' src="/split3.png" alt="" />
                        </div>
                        <div className="card-back absolute w-full h-full backface-hidden rounded-[inherit] overflow-hidden flex justify-center items-center text-center rotate-y-180 p-8 "
                            style={{ backgroundImage: 'url(/split3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            <div className="flex flex-col gap-1 z-10">
                                <h2 className='text-[2rem] font-medium'>Rapid Expansion</h2>
                                <p className='text-sm'>Scale globally with speed, precision, and reliability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="outro relative w-full h-svh p-8 bg-black text-white text-center flex justify-center items-center">
                <h1 className='text-4xl md:text-[4rem] font-medium mx-auto my-0 md:w-1/3 w-full'>Start Connecting Without Limits</h1>
            </section>
        </>
    )
}

export default page
