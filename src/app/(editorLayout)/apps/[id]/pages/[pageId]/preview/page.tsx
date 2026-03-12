import ApplicationPreview from "@/modules/apps/editor/preview/ApplicationPreview"
import React from "react"

interface ParamsProps {
  id: string
  pageId: string
}
export default async function PreviewPage({
  params,
}: {
  params: Promise<ParamsProps>
}) {
  const { id, pageId } = await params
  return <ApplicationPreview applicationId={id} pageId={pageId} />
}
