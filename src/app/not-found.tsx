"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Button } from "@/components/ui/button"

gsap.registerPlugin(useGSAP)

export default function NotFound() {
  const container = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      // Create starry background
      if (starsRef.current) {
        for (let i = 0; i < 75; i++) {
          const star = document.createElement("div")
          star.className = "absolute rounded-full bg-white"
          const size = Math.random() * 3 + 1
          star.style.width = `${size}px`
          star.style.height = `${size}px`
          star.style.left = `${Math.random() * 100}%`
          star.style.top = `${Math.random() * 100}%`
          star.style.opacity = `${Math.random() * 0.8 + 0.2}`
          starsRef.current.appendChild(star)

          // Twinkle animation
          gsap.to(star, {
            opacity: Math.random() < 0.5 ? 0.1 : 1,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2,
          })
        }
      }

      // Initial state
      gsap.set([titleRef.current, descRef.current, buttonRef.current], {
        y: 50,
        opacity: 0,
      })

      // Timeline for main entrance
      const tl = gsap.timeline()

      // Animate 404 Text
      tl.from(textRef.current, {
        scale: 0.2,
        opacity: 0,
        rotationX: 90,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)",
      })
        // Animate secondary content
        .to(
          [titleRef.current, descRef.current, buttonRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=1",
        )
    },
    { scope: container },
  )

  return (
    <div
      ref={container}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white"
    >
      {/* Background Starfield */}
      <div
        ref={starsRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      {/* Radial Gradient overlay for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* 404 Container */}
        <div className="relative flex items-center justify-center mb-8">
          <h1
            ref={textRef}
            className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 drop-shadow-[0_0_40px_blue] select-none z-10"
            style={{ perspective: "1000px" }}
          >
            404
          </h1>
        </div>

        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4"
        >
          Lost in Space
        </h2>

        <p
          ref={descRef}
          className="text-lg md:text-xl text-slate-400 max-w-lg mb-10"
        >
          The page you are looking for has drifted into deep space and cannot be
          found.
        </p>

        <Button asChild size={"lg"}>
          <Link href={"/"}>Back to login</Link>
        </Button>
      </div>
    </div>
  )
}
