"use client"

import { Button } from "@/components/ui/button"
import { Eye, ChevronLeft } from "lucide-react"
import Link from "next/link"

const EditorTopbar = ({ appId, pageId }: { appId: string; pageId: string }) => {
  return (
    <div className="bg-background fixed bottom-3 left-1/2 -translate-x-1/2 rounded p-1 shrink-0 z-50">
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
        {/* <Button size="icon-sm">
          <Send className="size-4" />
        </Button> */}
      </div>
    </div>
  )
}

export default EditorTopbar
