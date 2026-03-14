"use client"

import { Button } from "@/components/ui/button"
import { Eye, ChevronLeft, PaintBucket } from "lucide-react"
import Link from "next/link"
import { useApplicationStore } from "@/lib/store/app"
import { useCallback } from "react"

const EditorTopbar = ({ appId, pageId }: { appId: string; pageId: string }) => {
  const setSelectedPage = useApplicationStore((state) => state.setSelectedPage)

  const handleSelectPage = useCallback(() => {
    setSelectedPage(pageId)
  }, [pageId, setSelectedPage])
  return (
    <div className="bg-background/10 fixed bottom-3 left-1/2 -translate-x-1/2 rounded-lg p-1 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon-sm" asChild>
          <Link href={`/apps/${appId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <Button variant="secondary" size="icon-sm" className="gap-2" asChild>
          <Link href={`/apps/${appId}/pages/${pageId}/preview`} target="_blank">
            <Eye className="size-4" />
          </Link>
        </Button>
        <Button type="button" onClick={handleSelectPage} size="icon-sm">
          <PaintBucket className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default EditorTopbar
