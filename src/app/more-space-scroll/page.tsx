"use client"

import { LenisRef, ReactLenis } from 'lenis/react'
import { RefObject, useEffect, useRef } from 'react'
import MoreSpaceProjects from './MoreSpaceProjects'
import gsap from 'gsap'

function page() {
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
                <p className='uppercase text-base font-medium leading-4 letter-spacing-wide'>Intro Section</p>
            </section>

            <MoreSpaceProjects />

            <section className='outro relative w-full h-svh flex justify-center items-center overflow-hidden'>
                <p className='uppercase text-base font-medium leading-4 letter-spacing-wide'>Outro Section</p>
            </section>
        </>
    )
}

export default page