"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DarkModeSwitcherType = {
  className?: string
}
const baseClass = "shadow-none"
export function DarkModeSwitcher({ className }: DarkModeSwitcherType) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(baseClass, className)}
    >
      {/* Prevent rendering theme-dependent icon on SSR to avoid hydration mismatch */}
      {!mounted ? null : theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
