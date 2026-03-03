import ApplicationPreview from "@/modules/apps/preview/ApplicationPreview"
import React from "react"

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ApplicationPreview applicationId={id} />
}
