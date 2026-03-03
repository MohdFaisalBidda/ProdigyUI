"use client"

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger);

const data = [
    { label: "Alex Morgan", value: "Founder & CEO" },
    { label: "Sophia Carter", value: "Creative Director" },
    { label: "Ethan Williams", value: "Lead Developer" },
    { label: "Noah Thompson", value: "Marketing Strategist" },
    { label: "Isabella Reed", value: "UX Designer" },
    { label: "James Turne", value: "Product Manager" },
];

function TextContainer({ label, value, contactRows }: { label: string; value: string; contactRows: (el: HTMLDivElement | null) => void; }) {
    return (
        <div ref={contactRows} className="contact-row flex justify-center gap-4 will-change-auto z-40">
            <p className='text-base md:text-lg font-medium leading-6 tracking-tight flex-1 nth-[1]:text-right'>{label}</p>
            <p className='text-base md:text-lg font-medium leading-6 tracking-tight flex-1 nth-[2]:text-[var(--base-200)]'>{value}</p>
        </div>
    );
}

function page() {
    const containerInfo = useRef<HTMLDivElement>(null);
    const contactVisual = useRef<HTMLDivElement>(null);
    const contactRows = useRef<HTMLDivElement[]>([]);
    const lastCenteredRow = useRef<HTMLDivElement | null>(null);
    const currentIconIndex = useRef(1);
    const contactIcon = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const lenis = new Lenis({ infinite: true });

        lenis.on("scroll", ScrollTrigger.update);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        lenis.on("scroll", () => {
            const viewportCenter = window.innerHeight / 2;

            let closestRow: HTMLDivElement | null = null;
            let minDistance = Infinity;

            let centeredRow: HTMLDivElement | null = null;

            const allRows = document.querySelectorAll<HTMLDivElement>(".contact-row");

            allRows.forEach(row => {
                const rect = row.getBoundingClientRect();

                const rowTop = rect.top;
                const rowBottom = rect.bottom;

                // Check if viewport center is inside this row
                if (viewportCenter >= rowTop && viewportCenter <= rowBottom) {
                    centeredRow = row;
                }
            });

            if (centeredRow && centeredRow !== lastCenteredRow.current) {
                lastCenteredRow.current = centeredRow;

                const allRowsArray = Array.from(allRows);
                const rowIndex = allRowsArray.indexOf(centeredRow);
                const originalIndex = rowIndex % data.length;

                if (contactIcon.current) {
                    contactIcon.current.src = `/img${originalIndex + 1}.avif`;
                }
            }
        });

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
        };
    }, []);


    useEffect(() => {
        const containerRowMaxGap = window.innerWidth < 1000 ? 6 : 10

        for (let i = 0; i < 10; i++) {
            const clone = containerInfo.current?.cloneNode(true) as HTMLDivElement;
            if (clone) {

                containerInfo.current?.parentElement?.appendChild(clone);
            }
        }

        const allRows = gsap.utils.toArray(".contact-row") as HTMLDivElement[];
        allRows.forEach(element => {
            ScrollTrigger.create({
                trigger: element,
                start: "top-=100 center",
                end: "bottom+=100 center",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    // smooth in-out curve (no hard midpoint flip)
                    const eased = Math.sin(progress * Math.PI);

                    const gap = 1 + (containerRowMaxGap - 1) * eased;

                    element.style.gap = `${gap}rem`;
                }
            });
        });

    }, [])

    // const getVisualCenter = () => {
    //     if (!contactVisual.current) return 0;

    //     const rect = contactVisual.current.getBoundingClientRect();
    //     return rect.top + rect.height / 2 + window.scrollY;
    // };

    return (
        <div className='font-sans bg-[var(--base-300)] text-[var(--base-100)]'>
            <section ref={contactVisual} className='fixed top-0 left-0 w-full h-svh flex justify-center items-center overflow-hidden'>
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <img ref={contactIcon} src="/img4.avif" alt="" className='w-full h-full object-cover' style={{
                        borderRadius: "100px"
                    }} />
                </div>
            </section>
            <section ref={containerInfo} className="relative w-full min-h-svh flex flex-col justify-start pt-32 md:pt-40 gap-4 overflow-hidden">
                {data.map((item, index) => (
                    <TextContainer
                        key={index}
                        label={item.label}
                        value={item.value}
                        contactRows={(el) => {
                            if (el) contactRows.current[index] = el;
                        }}
                    />
                ))}
            </section>
        </div>
    )
}

export default page