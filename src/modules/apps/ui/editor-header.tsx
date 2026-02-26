import { cn } from "@/lib/utils"
import React from "react"

interface EditorHeaderProps {
  title: string
  className?: string
}

const baseClass = "flex justify-center items-center p-1 sticky top-0"
const EditorHeader: React.FC<EditorHeaderProps> = ({ className, title }) => {
  return (
    <div className={cn(baseClass, className)}>
      <small>{title}</small>
    </div>
  )
}

export default EditorHeader
