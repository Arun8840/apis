"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import React from "react"

interface ModalComponentProps {
  children: React.ReactNode
  title: string
  description?: string
  open: boolean
  setOpen: (value: boolean) => void
  direction?: "top" | "bottom" | "left" | "right"
  className?: string
}

const baseClass = "max-h-full flex-1 flex flex-col gap-2  overflow-y-auto"
export const ModalDrawer = ({
  children,
  open,
  title,
  description,
  setOpen,
  direction = "right",
  className,
}: ModalComponentProps) => {
  // * MODAL WRAPPER

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={direction} className="font-sans">
        <SheetHeader className="pb-0">
          <SheetTitle className="capitalize">{title}</SheetTitle>
          <SheetDescription>
            {description ?? "Fill out the form below to create a new template."}
          </SheetDescription>
        </SheetHeader>
        <div className={cn(baseClass, className)}>
          <div className="size-full  p-3 pt-0">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
