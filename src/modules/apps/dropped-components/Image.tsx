"use client"

import React, { useState, useEffect } from "react"
import { DroppedComponentProps } from "@/types"
import { useApplicationStore } from "@/lib/store/app"
import DroppedComponentWrapper from "../editor/DroppedComponentWrapper"
import { useMutation } from "@tanstack/react-query"
import { AddComponentReqType } from "../schema"
import { api } from "@/lib/eden.client"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageProps extends DroppedComponentProps {}

const ImageComponent: React.FC<ImageProps> = ({ value, dimensions }) => {
  const updateComponentStore = useApplicationStore(
    (state) => state.updateComponent,
  )
  const updateComponentApi = useMutation({
    mutationFn: async (data: AddComponentReqType) => {
      const response = await api.app.update.component.post(data)
      return response.data
    },
  })

  // Use src from options, fallback to content for backward compatibility
  const initialSrc = value.options?.src || value.options?.content || ""
  const [url, setUrl] = useState(initialSrc)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Reset states when URL changes
  useEffect(() => {
    if (url) {
      setIsLoading(true)
      setHasError(false)
    }
  }, [url])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleBlur = () => {
    if (url === (value.options?.src || value.options?.content || "")) return

    const req = {
      ...value,
      options: {
        ...value.options,
        src: url,
      },
      style: {
        ...value.style,
      },
    }
    updateComponentStore?.(req)
    updateComponentApi.mutate(req)
  }

  const ImageToolbar = (
    <div className="absolute -top-12 left-0 min-w-[300px] bg-background border rounded-lg shadow-xl p-1.5 flex gap-2 items-center z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2 px-2 w-full bg-muted/50 rounded-md border border-border/50 focus-within:border-primary/50 transition-colors">
        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Input
          placeholder="Enter image URL (HTTPS recommended)..."
          value={url}
          onChange={handleUrlChange}
          onBlur={handleBlur}
          className="h-7 text-[11px] border-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  )

  return (
    <DroppedComponentWrapper
      value={value}
      dimensions={dimensions}
      toolbar={ImageToolbar}
    >
      <div className="size-full flex overflow-hidden rounded-sm relative group">
        {url ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-[1px] animate-pulse">
                <Loader2 className="h-5 w-5 text-muted-foreground/40 animate-spin" />
              </div>
            )}
            {hasError ? (
              <div className="flex flex-col items-center justify-center text-destructive/60 gap-1.5 p-4 text-center">
                <AlertCircle className="h-6 w-6 stroke-[1.5px]" />
                <span className="text-[9px] font-semibold uppercase tracking-tight">
                  Failed to load image
                </span>
              </div>
            ) : (
              <img
                src={url}
                alt="Uploaded content"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
                className={cn(
                  "size-full object-center transition-opacity duration-300 pointer-events-none",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/30 gap-2 border-2 border-dashed border-muted-foreground/10 size-full m-1 rounded-md">
            <ImageIcon className="h-10 w-10 stroke-[1px] opacity-20" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                Empty Image
              </span>
              <span className="text-[8px] uppercase tracking-tighter opacity-30 mt-0.5">
                Paste URL in toolbar
              </span>
            </div>
          </div>
        )}
      </div>
    </DroppedComponentWrapper>
  )
}

export default ImageComponent
