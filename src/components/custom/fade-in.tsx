"use client"

import { ReactNode, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

type FadeDirection = "top" | "bottom" | "left" | "right"

interface FadeInProps {
  children: ReactNode
  direction?: FadeDirection
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  className?: string
  once?: boolean
}

const directionValues: Record<FadeDirection, { x: number; y: number }> = {
  top: { x: 0, y: -50 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 },
  right: { x: 50, y: 0 },
}

export default function FadeIn({
  children,
  direction = "bottom",
  duration = 0.6,
  delay = 0,
  stagger = 0,
  ease = "power2.out",
  className = "",
  once = true,
}: FadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const childRefs = useRef<HTMLElement[]>([])

  useGSAP(() => {
    if (!containerRef.current) return

    const children = containerRef.current.children
    const targets = stagger > 0 ? children : childRefs.current[0]

    const { x, y } = directionValues[direction]

    gsap.fromTo(
      targets,
      { opacity: 0, x: x, y: y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease,
        delay,
        stagger: stagger > 0 ? stagger : 0,
      }
    )
  }, [direction, duration, delay, stagger, ease])

  const childArray = Array.isArray(children) ? children : [children]

  return (
    <div ref={containerRef} className={className}>
      {childArray.map((child, index) => {
        const key =
          (child as React.ReactElement)?.key ??
          (child as React.ReactElement<{ key?: React.Key }>)?.key ??
          index

        return (
          <div
            key={key}
            ref={(el) => {
              if (el) childRefs.current[index] = el
            }}
            className="fade-in-child"
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
