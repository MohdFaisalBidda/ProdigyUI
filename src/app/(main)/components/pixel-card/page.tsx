"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React, { isValidElement, useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_PX_STEPS = [40, 20, 10, 6, 4, 2, 1]

type ImgChild = React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>

const PixelImage = ({
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = "top+=20% bottom",
  speed = 1,
  intialDelay = 0.5,
  className = "",
  style = {},
  loop = true,
  loopTimes = Infinity,
  loopDelay = 1,
}: {
  children: React.ReactNode
  pxSteps?: number[]
  triggerStart?: string
  speed?: number
  intialDelay?: number
  className?: string
  style?: React.CSSProperties
  loop?: boolean
  loopTimes?: number
  loopDelay?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const hiddenImage = container.querySelector(
      "img[data-pixel-src]"
    ) as HTMLImageElement | null

    if (!hiddenImage) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src =
      hiddenImage.getAttribute("data-pixel-src") || hiddenImage.src

    const render = (pixelSize: number) => {
      if (!img) return

      const cw = container.offsetWidth
      const ch = container.offsetHeight

      canvas.width = cw
      canvas.height = ch

      // CONTAIN (no crop, no zoom)
      let drawW = cw
      let drawH = ch
      let dx = 0
      let dy = 0

      const containerRatio = cw / ch
      const imgRatio = img.width / img.height

      if (containerRatio > imgRatio) {
        drawH = ch
        drawW = ch * imgRatio
        dx = (cw - drawW) / 2
      } else {
        drawW = cw
        drawH = cw / imgRatio
        dy = (ch - drawH) / 2
      }

      const size = Math.max(1, pixelSize)
      const smallW = Math.ceil(cw / size)
      const smallH = Math.ceil(ch / size)

      const offscreen = document.createElement("canvas")
      offscreen.width = smallW
      offscreen.height = smallH

      const offCtx = offscreen.getContext("2d")!
      offCtx.imageSmoothingEnabled = false

      offCtx.drawImage(img, 0, 0, smallW, smallH)

      ctx.clearRect(0, 0, cw, ch)
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        offscreen,
        0,
        0,
        smallW,
        smallH,
        dx,
        dy,
        drawW,
        drawH
      )
    }

    const startLoop = () => {
      const obj = { value: pxSteps[0] }

      const tl = gsap.timeline({
        repeat: loop
          ? loopTimes === Infinity
            ? -1
            : loopTimes - 1
          : 0,
        repeatDelay: loopDelay,
        delay: intialDelay,
      })

      tl.fromTo(
        obj,
        { value: pxSteps[0] },
        {
          value: 1,
          duration: speed,
          ease: "power3.out",
          onUpdate: () => {
            render(obj.value)
          },
        }
      )
    }

    img.onload = () => {
      render(1)

      const resizeHandler = () => render(1)
      window.addEventListener("resize", resizeHandler)

      ScrollTrigger.create({
        trigger: container,
        start: triggerStart,
        onEnter: () => {
          startLoop()
        },
        once: true,
      })

      gsap.set(container, { opacity: 1 })

      return () => {
        window.removeEventListener("resize", resizeHandler)
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pxSteps, triggerStart, speed, intialDelay, loop, loopTimes, loopDelay])

  const wrappedChildren = React.Children.map(children, (child) => {
    if (
      isValidElement(child) &&
      typeof child.type === "string" &&
      child.type === "img"
    ) {
      const imgChild = child as ImgChild

      return React.cloneElement(imgChild, {
        ...({ "data-pixel-src": imgChild.props.src } as any),
        style: {
          ...(imgChild.props.style || {}),
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        },
      })
    }

    return child
  })

  return (
    <div
      ref={containerRef}
      style={style}
      className={`relative opacity-0 overflow-hidden ${className}`}
    >
      {wrappedChildren}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

function Page() {
  return (
    <div className="p-8">
      <PixelImage
        className="h-[400px] w-full mt-8"
        loop
        loopTimes={Infinity}
        loopDelay={3} // ⚠️ seconds, not ms
      >
        <img src="/img4.avif" className="w-full h-full" />
      </PixelImage>
    </div>
  )
}

export default Page