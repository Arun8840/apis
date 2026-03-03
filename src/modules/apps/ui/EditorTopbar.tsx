"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Eye, 
  CloudUpload,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { useApplicationStore } from "@/lib/store/app"

const EditorTopbar = () => {
  const application = useApplicationStore((state) => state.app)

  return (
    <header className="p-2 border-b bg-background flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/apps">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold font-sans leading-none">{application?.title || "Untitled App"}</span>
        </div>
      </div>

      {/* <div className="flex items-center bg-muted/50 rounded-lg p-1 gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background shadow-sm">
          <Monitor className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
          <Tablet className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
          <Smartphone className="h-4 w-4" />
        </Button>
      </div> */}

      <div className="flex items-center gap-2">
        <div className="flex items-center border-r pr-2 mr-2 gap-1">
          <Button variant="ghost" size="icon-xs" className="h-8 w-8 text-muted-foreground">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="h-8 w-8 text-muted-foreground">
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="xs" className="gap-2" asChild>
          <Link href={`/apps/${application?.id}/preview`} target="_blank">
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        </Button>
        <Button size="xs" className="gap-2 bg-primary hover:bg-primary/90">
          <CloudUpload className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </header>
  )
}

export default EditorTopbar
