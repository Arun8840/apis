import EditorLayout from "@/layouts/EditorLayout"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EditorLayout>{children}</EditorLayout>
}
