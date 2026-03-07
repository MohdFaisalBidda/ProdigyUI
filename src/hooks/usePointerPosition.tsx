"use client"

import { useEffect, useRef } from "react"

export default function usePointerPosition() {
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const update = (e: PointerEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }

    window.addEventListener("pointermove", update)

    return () => window.removeEventListener("pointermove", update)
  }, [])

  return pos
}