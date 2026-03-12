import Pages from "@/modules/apps/pages"
import React from "react"

interface Params {
  id: string
}
export default async function ApplicationPages({ params }: { params: Params }) {
  const { id } = await params
  return (
    <>
      <Pages appId={id} />
    </>
  )
}
