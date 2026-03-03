import { Component } from "@/types"

/**
 * Checks if two components collide on the grid.
 */
export const collides = (a: { x: number, y: number, w: number, h: number }, b: { x: number, y: number, w: number, h: number }) => {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

/**
 * Resolves collisions by pushing components down if they overlap.
 * This is a basic vertical compaction algorithm.
 */
export const resolveCollisions = (
  allComponents: Component[],
  modifiedComponent: Component
): Component[] => {
  // Start with the modified component at its new position
  const result: Component[] = [modifiedComponent]
  const rest = allComponents.filter(c => c.id !== modifiedComponent.id)
  
  // Sort by Y so we process them from top to bottom
  const sortedRest = [...rest].sort((a, b) => a.position.y - b.position.y)

  for (const comp of sortedRest) {
    let currentPos = { ...comp.position }
    let changed = true
    
    // Iteratively push down until no collision with components ALREADY in result
    while (changed) {
      changed = false
      for (const fixed of result) {
        if (collides(currentPos, fixed.position)) {
          currentPos.y = fixed.position.y + fixed.position.h
          changed = true
        }
      }
    }
    
    result.push({
      ...comp,
      position: currentPos
    })
  }

  return result
}
