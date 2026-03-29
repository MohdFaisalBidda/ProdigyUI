"use client"

import React from 'react'
import SpringBackCard from './SpringBackCard'
import { getLocalImage } from '@/lib/images'

const defaultImages = [
  { src: getLocalImage(0, 1), alt: 'card1' },
  { src: getLocalImage(1, 2), alt: 'card2' },
  { src: getLocalImage(2, 3), alt: 'card3' },
  { src: getLocalImage(3, 4), alt: 'card4' },
]

const defaultLabels = [
  {
    text: 'Follows you ✨',
    bgColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm',
  },
  {
    text: 'Catch me 👀',
    bgColor: 'bg-amber-400/20 text-amber-200 border border-amber-400/30 backdrop-blur-sm',
  },
  {
    text: 'Smooth bounce',
    bgColor: 'bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm',
  },
]

export default function SpringBackCards({
  images = defaultImages,
  labels = defaultLabels,
  className = ''
}: {
  images?: { src: string; alt: string }[]
  labels?: { text: string; bgColor: string }[]
  className?: string
}) {
  return (
    <section className={`h-screen w-full flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden ${className}`}>
      {images.slice(0, 4).map((img, i) => (
        <SpringBackCard
          key={`img-${i}`}
          imgSrc={img.src}
          initialRotation={i % 2 === 0 ? -6 : 6}
          offsetX={0}
          index={i}
          className={
            [
              'left-[25%] sm:left-[28%] md:left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8',
              'left-[50%] top-[55%] sm:left-[38%] md:left-[40%] sm:top-[55%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8',
              'left-[50%] sm:left-[48%] md:left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8',
              'left-[75%] top-[52%] sm:left-[58%] md:left-[60%] sm:top-[55%] -translate-x-1/2 -translate-y-1/2',
            ][i]
          }
          widthClass="w-28 md:w-36 lg:w-48 xl:w-56"
          heightClass="h-36 md:h-48 lg:h-64 xl:h-72"
          mobileVisible={i === 2 ? false : undefined}
        >
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
        </SpringBackCard>
      ))}

      {labels.slice(0, 3).map((label, i) => (
        <SpringBackCard
          key={`label-${i}`}
          initialRotation={0}
          offsetX={0}
          index={i + 4}
          className={
            [
              'top-[35%] sm:top-[40%] left-[30%] sm:left-[35%] -translate-x-1/2 -translate-y-1/2',
              'bottom-[30%] sm:bottom-[35%] left-[45%] sm:left-[45%] -translate-x-1/2 -translate-y-1/2',
              'right-[20%] sm:right-[23%] top-[45%] sm:top-[50%] -translate-x-1/2 -translate-y-1/2',
            ][i]
          }
          widthClass="auto"
          heightClass="auto"
        >
          <p
            className={`rounded-full rounded-bl-none pointer-events-none whitespace-nowrap text-xs sm:text-sm text-black ${label.bgColor}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            {label.text}
          </p>
        </SpringBackCard>
      ))}
    </section>
  )
}