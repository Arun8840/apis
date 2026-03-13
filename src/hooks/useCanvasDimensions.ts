"use client"

import { useMemo, useRef } from "react"
import useResizeObserver from "use-resize-observer"
import type { Modifier } from "@dnd-kit/core"
import { COLS, ROW_HEIGHT } from "@/lib/editor-utils"

export function useCanvasDimensions() {
  const canvasRef = useRef<HTMLDivElement>(null)

  const { width: canvasWidth = 0 } = useResizeObserver({
    ref: canvasRef as React.MutableRefObject<HTMLDivElement>,
  })

  const colWidth = useMemo(() => {
    const width = canvasWidth || 0
    return width > 0 ? width / COLS : 1
  }, [canvasWidth])

  const snapToGridModifier = useMemo<Modifier>(() => {
    return (args: any) => {
      const { transform } = args
      return {
        ...transform,
        x: Math.round(transform.x / colWidth) * colWidth,
        y: Math.round(transform.y / ROW_HEIGHT) * ROW_HEIGHT,
      }
    }
  }, [colWidth])

  return {
    canvasRef,
    canvasWidth,
    colWidth,
    snapToGridModifier,
  }
}
