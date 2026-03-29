"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const SLIDE_WIDTH = 200;
const SLIDE_HEIGHT = 275;
const SLIDE_GAP = 100;
const ARC_DEPTH = 200;
const CENTER_LIFT = 100;
const SCROLL_LERP = 0.05;

const MOBILE_SLIDE_WIDTH = 120;
const MOBILE_SLIDE_HEIGHT = 165;
const MOBILE_SLIDE_GAP = 60;
const MOBILE_ARC_DEPTH = 120;
const MOBILE_CENTER_LIFT = 60;
const MOBILE_SCROLL_LERP = 0.06;

export interface InfiniteSliderProps {
    images?: string[];
    titles?: string[];
    slideCount?: number;
    isMobileBreakpoint?: number;
}

const getDefaultSlideSources = (count: number) =>
    Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${i + 1}/800/600`);

const getDefaultSlideTitles = () => [
    "Founder & CEO",
    "Creative Director",
    "Lead Developer",
    "Marketing Strategist",
    "UX Designer",
    "Product Manager",
    "Graphic Designer",
];

function createSlides(container: HTMLDivElement, sources: string[], slideWidth: number, slideHeight: number) {
    sources.forEach((src) => {
        const slideEl = document.createElement("div");
        slideEl.classList.add("slide");
        slideEl.style.position = "absolute";
        slideEl.style.width = `${slideWidth}px`;
        slideEl.style.height = `${slideHeight}px`;

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

interface SlideConfig {
    slideWidth: number;
    slideHeight: number;
    slideGap: number;
    arcDepth: number;
    centerLift: number;
}

function computeSlideTransform(
    slideIndex: number,
    scrollOffset: number,
    trackWidth: number,
    windowCenterX: number,
    windowWidth: number,
    arcBaselineY: number,
    config: SlideConfig
) {
    let wrappedOffset =
        (((slideIndex * config.slideGap - scrollOffset) % trackWidth) + trackWidth) %
        trackWidth;

    if (wrappedOffset > trackWidth / 2) wrappedOffset -= trackWidth;

    const slideCenterX = windowCenterX + wrappedOffset;

    const normalizedOffset =
        (slideCenterX - windowCenterX) / (windowWidth * 0.5);

    const absDist = Math.min(Math.abs(normalizedOffset), 1.3);

    const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);

    const scaleWidth = config.slideWidth * scaleFactor;
    const scaleHeight = config.slideHeight * scaleFactor;

    const clampedDist = Math.min(absDist, 1);

    const arcDropY = (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * config.arcDepth;

    const centerLiftY = Math.max(1 - absDist * 2, 0) * config.centerLift;

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
    config: [number, number, number, number],
    slideConfig: SlideConfig
) {
    slides.forEach((slide, i) => {
        const { distanceFromCenter, ...validTransform } = computeSlideTransform(i, scrollOffset, ...config, slideConfig);

        gsap.set(slide, validTransform);
    });
}

function syncActiveTitle(
    slides: HTMLDivElement[],
    scrollOffset: number,
    activeIndexRef: { current: number },
    titleElement: HTMLParagraphElement | null,
    config: [number, number, number, number],
    slideConfig: SlideConfig,
    titles: string[]
) {
    let closestIndex = 0;
    let closestDist = Infinity;

    slides.forEach((_, i) => {
        const { distanceFromCenter } = computeSlideTransform(i, scrollOffset, ...config, slideConfig);

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
    isMobileBreakpoint = 768,
}: InfiniteSliderProps) {
    const sliderContainer = useRef<HTMLDivElement>(null);
    const titleDisplay = useRef<HTMLParagraphElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    const slideSources = images && images.length > 0 ? images : getDefaultSlideSources(slideCount);
    const slideTitles = titles && titles.length > 0 ? titles : getDefaultSlideTitles();

    const slideGap = isMobile ? MOBILE_SLIDE_GAP : SLIDE_GAP;
    const scrollLerp = isMobile ? MOBILE_SCROLL_LERP : SCROLL_LERP;

    useEffect(() => {
        if (!sliderContainer.current) return;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < isMobileBreakpoint);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        const container = sliderContainer.current;

        const currentSlideWidth = isMobile ? MOBILE_SLIDE_WIDTH : SLIDE_WIDTH;
        const currentSlideHeight = isMobile ? MOBILE_SLIDE_HEIGHT : SLIDE_HEIGHT;

        const slides = createSlides(container, slideSources, currentSlideWidth, currentSlideHeight);

        const activeSlideIndex = { current: 0 };

        const currentSlideGap = isMobile ? MOBILE_SLIDE_GAP : SLIDE_GAP;
        const trackWidth = slideSources.length * currentSlideGap;

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowCenterX = windowWidth / 2;
        let arcBaselineY = windowHeight * 0.4;

        let scrollTarget = 0;
        let scrollCurrent = 0;

        let rafId: number;

        const slideConfig: SlideConfig = {
            slideWidth: currentSlideWidth,
            slideHeight: currentSlideHeight,
            slideGap: currentSlideGap,
            arcDepth: isMobile ? MOBILE_ARC_DEPTH : ARC_DEPTH,
            centerLift: isMobile ? MOBILE_CENTER_LIFT : CENTER_LIFT,
        };

        function animate() {
            scrollCurrent += (scrollTarget - scrollCurrent) * scrollLerp;

            const config = [trackWidth, windowCenterX, windowWidth, arcBaselineY] as [number, number, number, number];

            layoutSlides(slides, scrollCurrent, config, slideConfig);
            syncActiveTitle(
                slides,
                scrollCurrent,
                activeSlideIndex,
                titleDisplay.current,
                config,
                slideConfig,
                slideTitles
            );

            rafId = requestAnimationFrame(animate);
        }

        animate();

        function handleWheel(e: WheelEvent) {
            e.preventDefault();
            scrollTarget += e.deltaY * 0.5;
        }

        let touchStartY = 0;
        let touchStartX = 0;

        function handleTouchStart(e: TouchEvent) {
            if (e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }
        }

        function handleTouchMove(e: TouchEvent) {
            if (e.touches.length === 1) {
                e.preventDefault();
                const deltaY = touchStartY - e.touches[0].clientY;
                const deltaX = touchStartX - e.touches[0].clientX;
                scrollTarget += (deltaX !== 0 ? deltaX : deltaY) * 0.3;
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }
        }

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", checkMobile);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.innerHTML = "";
        };
    }, [slideSources, slideTitles, isMobileBreakpoint, slideGap, scrollLerp]);

    return (
        <>
            <section ref={sliderContainer} className='slider absolute inset-0 w-full h-full overflow-x-hidden' />
            <p
                ref={titleDisplay}
                id="slide-title"
                className={`absolute left-1/2 -translate-x-1/2 font-medium text-[#e8e8e2] pointer-events-none font-barlow ${isMobile ? "bottom-28 text-base sm:text-lg" : "bottom-72 text-xl sm:text-2xl"}`}
                style={{
                    textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                    zIndex: 9999,
                }}
            >
                Slide Title
            </p>
        </>
    );
}

export default InfiniteSlider;