import { restrictToParentElement } from "@dnd-kit/modifiers"
import type { Modifier } from "@dnd-kit/core"

export const COLS = 120
export const ROW_HEIGHT = 10

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

export const restrictToCanvas: Modifier = (args) => {
  if (args.active?.data?.current?.accept === "move") {
    return restrictToParentElement(args)
  }
  return args.transform
}
