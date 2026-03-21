"use client";

import { LenisRef, ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import MoreSpaceProjects from '@/components/UIElement/MoreSpaceScroll/MoreSpaceProjects'
import gsap from 'gsap'

function MoreSpaceScroll() {
    const lenisRef = useRef<LenisRef | null>(null)

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }
        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)
        return () => gsap.ticker.remove(update)
    }, [])

    return (
        <>
            <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
            <section className='intro relative w-full h-svh flex justify-center items-center overflow-hidden'>
                <p className='uppercase text-base font-medium leading-4 letter-spacing-wide text-[#e8e8e2]'>
                    Discover the Future of Web Design
                </p>
            </section>

            <MoreSpaceProjects />

            <section className='outro relative w-full h-svh flex justify-center items-center overflow-hidden'>
                <p className='uppercase text-base font-medium leading-4 letter-spacing-wide text-[#e8e8e2]'>
                    Thank You for Exploring
                </p>
            </section>
        </>
    )
}

export default MoreSpaceScroll
