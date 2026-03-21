"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const SLIDE_WIDTH = 200;
const SLIDE_HEIGHT = 275;
const SLIDE_GAP = 100;
const ARC_DEPTH = 200;
const CENTER_LIFT = 100;
const SCROLL_LERP = 0.05;

interface InfiniteSliderProps {
    images?: string[];
    titles?: string[];
    slideCount?: number;
}

const getDefaultSlideSources = (count: number) =>
    Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${i + 1}/800/600`);

const getDefaultSlideTitles = () => [
    "The Enchanted Forest",
    "Mystic Mountains",
    "Serene Lakeside",
    "Sunset Overdrive",
    "Whispering Meadows",
    "Hidden Caves",
    "Starlit Skies"
];

function createSlides(container: HTMLDivElement, sources: string[]) {
    sources.forEach((src) => {
        const slideEl = document.createElement("div");
        slideEl.classList.add("slide");
        slideEl.style.position = "absolute";

        const img = document.createElement("img");
        img.src = src;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";

        slideEl.appendChild(img);
        container.appendChild(slideEl);
    });

    return gsap.utils.toArray(".slide") as HTMLDivElement[];
}

function computeSlideTransform(
    slideIndex: number,
    scrollOffset: number,
    trackWidth: number,
    windowCenterX: number,
    windowWidth: number,
    arcBaselineY: number
) {
    let wrappedOffset =
        (((slideIndex * SLIDE_GAP - scrollOffset) % trackWidth) + trackWidth) %
        trackWidth;

    if (wrappedOffset > trackWidth / 2) wrappedOffset -= trackWidth;

    const slideCenterX = windowCenterX + wrappedOffset;

    const normalizedOffset =
        (slideCenterX - windowCenterX) / (windowWidth * 0.5);

    const absDist = Math.min(Math.abs(normalizedOffset), 1.3);

    const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);

    const scaleWidth = SLIDE_WIDTH * scaleFactor;
    const scaleHeight = SLIDE_HEIGHT * scaleFactor;

    const clampedDist = Math.min(absDist, 1);

    const arcDropY = (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * ARC_DEPTH;

    const centerLiftY = Math.max(1 - absDist * 2, 0) * CENTER_LIFT;

    return {
        x: slideCenterX - scaleWidth / 2,
        y: arcBaselineY - scaleHeight / 2 + arcDropY - centerLiftY,
        width: scaleWidth,
        height: scaleHeight,
        zIndex: Math.round((1 - absDist) * 100),
        distanceFromCenter: Math.abs(wrappedOffset),
    };
}

function layoutSlides(
    slides: HTMLDivElement[],
    scrollOffset: number,
    config: [number, number, number, number]
) {
    slides.forEach((slide, i) => {
        const transform = computeSlideTransform(i, scrollOffset, ...config);

        gsap.set(slide, transform);
    });
}

function syncActiveTitle(
    slides: HTMLDivElement[],
    scrollOffset: number,
    activeIndexRef: { current: number },
    titleElement: HTMLParagraphElement | null,
    config: [number, number, number, number],
    titles: string[]
) {
    let closestIndex = 0;
    let closestDist = Infinity;

    slides.forEach((_, i) => {
        const { distanceFromCenter } = computeSlideTransform(i, scrollOffset, ...config);

        if (distanceFromCenter < closestDist) {
            closestDist = distanceFromCenter;
            closestIndex = i;
        }
    });

    if (closestIndex !== activeIndexRef.current) {
        activeIndexRef.current = closestIndex;

        if (titleElement) {
            titleElement.textContent = titles[closestIndex] || "";
        }
    }
}


function InfiniteSlider({
    images,
    titles,
    slideCount = 6,
}: InfiniteSliderProps) {
    const sliderContainer = useRef<HTMLDivElement>(null);
    const titleDisplay = useRef<HTMLParagraphElement>(null);

    const slideSources = images && images.length > 0 ? images : getDefaultSlideSources(slideCount);
    const slideTitles = titles && titles.length > 0 ? titles : getDefaultSlideTitles();

    useEffect(() => {
        if (!sliderContainer.current) return;

        const container = sliderContainer.current;

        const slides = createSlides(container, slideSources);

        const activeSlideIndex = { current: 0 };

        const trackWidth = slideSources.length * SLIDE_GAP;

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowCenterX = windowWidth / 2;
        let arcBaselineY = windowHeight * 0.4;

        let scrollTarget = 0;
        let scrollCurrent = 0;

        let rafId: number;

        function animate() {
            scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_LERP;

            const config = [trackWidth, windowCenterX, windowWidth, arcBaselineY] as [number, number, number, number];

            layoutSlides(slides, scrollCurrent, config);
            syncActiveTitle(
                slides,
                scrollCurrent,
                activeSlideIndex,
                titleDisplay.current,
                config,
                slideTitles
            );

            rafId = requestAnimationFrame(animate);
        }

        animate();

        function handleWheel(e: WheelEvent) {
            e.preventDefault();
            scrollTarget += e.deltaY * 0.5;
        }

        container.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            cancelAnimationFrame(rafId);
            container.removeEventListener("wheel", handleWheel);
            container.innerHTML = "";
        };
    }, [slideSources, slideTitles]);

    return (
        <section ref={sliderContainer} className='slider relative w-full h-svh overflow-hidden'>
            <p ref={titleDisplay} id="slide-title" className='absolute bottom-[25svh] left-1/2 -translate-x-1/2 font-medium text-2xl text-[#e8e8e2]'>Slide Title</p>
        </section>
    );
}

export default InfiniteSlider;