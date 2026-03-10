"use client"

import Image from 'next/image'
import React from 'react'
import SpringBackCard from '@/components/UIElement/SpringBackCard/SpringBackCard'

function Cards() {
    return (
        <section className='h-screen w-full flex items-center justify-center bg-[var(--base-300)] relative overflow-hidden'>
            <SpringBackCard
                imgSrc="/img2.avif"
                initialRotation={-6}
                offsetX={0}
                index={0}
                className="left-[25%] sm:left-[28%] md:left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8"
                widthClass="w-28 md:w-36 lg:w-48 xl:w-56"
                heightClass="h-36 md:h-48 lg:h-64 xl:h-72"
            >
                <Image
                    src="/img2.avif"
                    alt='card1'
                    width={1000}
                    height={1000}
                    className='w-full h-full object-cover'
                />
            </SpringBackCard>

            <SpringBackCard
                imgSrc="/img5.avif"
                initialRotation={5}
                offsetX={0}
                index={1}
                className="left-[50%] top-[55%] sm:left-[38%] md:left-[40%] sm:top-[55%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8"
                widthClass="w-28 md:w-36 lg:w-48 xl:w-56"
                heightClass="h-36 md:h-48 lg:h-64 xl:h-72"
            >
                <Image
                    src="/img5.avif"
                    alt='card2'
                    width={1000}
                    height={1000}
                    className='w-full h-full object-cover'
                />
            </SpringBackCard>

            <SpringBackCard
                imgSrc="/img4.avif"
                initialRotation={-5}
                offsetX={0}
                index={2}
                className="left-[50%] sm:left-[48%] md:left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8"
                widthClass="w-28 md:w-36 lg:w-48 xl:w-56"
                heightClass="h-36 md:h-48 lg:h-64 xl:h-72"
                mobileVisible={false}
            >
                <Image
                    src="/img4.avif"
                    alt='card3'
                    width={1000}
                    height={1000}
                    className='w-full h-full object-cover'
                />
            </SpringBackCard>

            <SpringBackCard
                imgSrc="/img3.avif"
                initialRotation={6}
                offsetX={0}
                index={3}
                className="left-[75%] top-[52%] sm:left-[58%] md:left-[60%] sm:top-[55%] -translate-x-1/2 -translate-y-1/2"
                widthClass="w-28 md:w-36 lg:w-48 xl:w-56"
                heightClass="h-36 md:h-48 lg:h-64 xl:h-72"
            >
                <Image
                    src="/img3.avif"
                    alt='card4'
                    width={1000}
                    height={1000}
                    className='w-full h-full object-cover'
                />
            </SpringBackCard>

            <SpringBackCard
                initialRotation={0}
                offsetX={0}
                index={4}
                className=" top-[35%] sm:top-[40%] left-[30%] sm:left-[35%] -translate-x-1/2 -translate-y-1/2"
                widthClass="auto"
                heightClass="auto"
            >
                <p className='rounded-full rounded-bl-none bg-pink-300 pointer-events-none whitespace-nowrap text-xs sm:text-sm'
                    style={{ padding: "0.5rem 1rem" }}
                >This card looks like a spring back</p>
            </SpringBackCard>

            <SpringBackCard
                initialRotation={0}
                offsetX={0}
                index={5}
                className="bottom-[30%] sm:bottom-[35%] left-[45%] sm:left-[45%] -translate-x-1/2 -translate-y-1/2"
                widthClass="auto"
                heightClass="auto"
            >
                <p className='rounded-full rounded-bl-none bg-red-500 pointer-events-none whitespace-nowrap text-xs sm:text-sm'
                style={{ padding: "0.5rem 1rem" }}
                >Catch me if you can</p>
            </SpringBackCard>

            <SpringBackCard
                initialRotation={0}
                offsetX={0}
                index={6}
                className="right-[20%] sm:right-[23%] top-[45%] sm:top-[50%] -translate-x-1/2 -translate-y-1/2"
                widthClass="auto"
                heightClass="auto"
            >
                <p className='rounded-full rounded-bl-none bg-amber-100 pointer-events-none whitespace-nowrap text-xs sm:text-sm'
                style={{ padding: "0.5rem 1rem" }}
                >I&apos;m a spring back card</p>
            </SpringBackCard>
        </section>
    )
}

function SpringBackCards() {
    return (
        <div>
            <Cards />
        </div>
    )
}

export default SpringBackCards
