"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React, { isValidElement, useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_PX_STEPS = [120, 80, 50, 32, 20, 12, 8, 5, 3, 2, 1]

type ImgChild = React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>

const PixelImage = ({
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = "top+=20% bottom",
  speed = 1.2,
  intialDelay = 0,
  className = "",
  style = {},
  loop = true,
  loopTimes = Infinity,
  loopDelay = 2,
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
  const tlRef = useRef<gsap.core.Timeline | null>(null)

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
      if (!img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return

      const cw = container.offsetWidth
      const ch = container.offsetHeight

      if (cw === 0 || ch === 0) return

      canvas.width = cw
      canvas.height = ch

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

      if (smallW === 0 || smallH === 0) return

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
      if (tlRef.current) {
        tlRef.current.kill()
      }

      render(pxSteps[0])

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

      tl.to(obj, {
        value: 1,
        duration: speed,
        ease: "power3.inOut",
        onUpdate: () => {
          render(obj.value)
        },
      })

      tlRef.current = tl
    }

    img.onload = () => {
      gsap.set(container, { opacity: 1 })

      const resizeHandler = () => {
        if (tlRef.current && tlRef.current.isActive()) return
        render(1)
      }
      window.addEventListener("resize", resizeHandler)

      ScrollTrigger.create({
        trigger: container,
        start: triggerStart,
        onEnter: () => {
          startLoop()
        },
        once: true,
      })

      return () => {
        window.removeEventListener("resize", resizeHandler)
      }
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
      }
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

export default PixelImage
