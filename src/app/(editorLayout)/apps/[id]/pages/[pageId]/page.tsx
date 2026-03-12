import { Editor } from "@/modules/apps/editor"
import React from "react"

interface PageParams {
  id: string
  pageId: string
}
export default async function PageDesign({ params }: { params: PageParams }) {
  const { id, pageId } = await params
  return <Editor appId={id} pageId={pageId} />
}
