import { Editor } from "@/modules/apps/editor"
import { Suspense } from "react"

export default function AppById() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <Editor />
    </Suspense>
  )
}
