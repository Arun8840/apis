"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface BuildLoaderProps {
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: 24,
  md: 40,
  lg: 56,
}

export default function BuildLoader({ size = "sm" }: BuildLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])

  useGSAP(() => {
    dotsRef.current.forEach((dot, i) => {
      gsap.to(dot, {
        scale: 1.4,
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.15,
      })
    })

    gsap.to(containerRef.current, {
      scale: 1.05,
      duration: 0.8,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    })
  }, [])

  const dotSize = sizes[size] / 5

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) dotsRef.current[i] = el
          }}
          className="rounded-full bg-primary"
          style={{
            width: dotSize,
            height: dotSize,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  )
}
