"use client"

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { DroppedComponentProps } from "@/types"
import DroppedComponentWrapper from "../editor/DroppedComponentWrapper"
import { Input } from "@/components/ui/input"
import { useGetAsset } from "@/hooks/use-get-asset"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, ImageIcon, UploadCloud, Link } from "lucide-react"
import { cn } from "@/lib/utils"

type ImageProps = DroppedComponentProps

type UploadMode = "local" | "url"

interface UploaderState {
  mode: UploadMode
  /** Shown in the canvas <img> preview — blob URL for local, raw string for url mode */
  previewUrl: string
  /** The value to be submitted — base64 for local files, URL string for url mode */
  submitValue: string
}

const INITIAL_STATE: UploaderState = {
  mode: "local",
  previewUrl: "",
  submitValue: "",
}

function EmptyPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-muted/30 border border-dashed border-border rounded">
      <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
      <span className="text-xs text-muted-foreground">No image</span>
    </div>
  )
}

const ImageComponent: React.FC<ImageProps> = ({ value, dimensions }) => {
  const { Component, uploadImage, updateImage } = useGetAsset({
    assetId: value?.assetId || " ",
    applicationId: value?.applicationId,
    pageId: value?.pageId,
    componentId: value?.id,
  })

  const [state, setState] = useState<UploaderState>(INITIAL_STATE)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // FIX: track the last successfully uploaded preview URL separately so the
  // canvas keeps showing the new image after the toolbar state resets
  const [committedPreviewUrl, setCommittedPreviewUrl] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const blobUrlRef = useRef<string>("")

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
    }
  }, [])

  const handleModeChange = useCallback((isUrl: boolean) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = ""
    }
    setState({ ...INITIAL_STATE, mode: isUrl ? "url" : "local" })
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setUploadError(null)
      setState((prev) => ({ ...prev, previewUrl: val, submitValue: val }))
    },
    [],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploadError(null)

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      const blobUrl = URL.createObjectURL(file)
      blobUrlRef.current = blobUrl
      setState((prev) => ({ ...prev, previewUrl: blobUrl, submitValue: "" }))

      const reader = new FileReader()
      reader.onload = () => {
        setState((prev) => ({ ...prev, submitValue: reader.result as string }))
      }
      reader.onerror = () => {
        setUploadError("Failed to read file.")
        URL.revokeObjectURL(blobUrl)
        blobUrlRef.current = ""
        setState((prev) => ({ ...prev, previewUrl: "", submitValue: "" }))
      }
      reader.readAsDataURL(file)
    },
    [],
  )

  const handleUpload = useCallback(async () => {
    if (!state.submitValue) return

    setIsUploading(true)
    setUploadError(null)

    try {
      if (!value?.assetId) {
        await uploadImage(state.submitValue)
      } else {
        await updateImage({
          id: value.assetId,
          url: state.submitValue,
          pageId: value.pageId,
          componentId: value.id,
        })
      }

      setCommittedPreviewUrl(state.previewUrl)

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = ""
      }

      setState(INITIAL_STATE)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }, [state.submitValue, state.previewUrl, uploadImage, updateImage, value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleUpload()
      }
    },
    [handleUpload],
  )

  // ── Derived ──────────────────────────────────────────────────────────────────

  const isUrlMode = state.mode === "url"
  const isReadyToUpload = Boolean(state.submitValue) && !isUploading

  const canvasPreviewUrl = useMemo(
    () => state.previewUrl || committedPreviewUrl,
    [state.previewUrl, committedPreviewUrl],
  )
  const ImageToolbar = useMemo(
    () => (
      <div className="absolute -top-2 left-0 translate-y-[-100%] min-w-[300px] bg-background border border-border rounded-xl shadow-xl p-3 flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Image Source
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                !isUrlMode ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <UploadCloud className="w-3.5 h-3.5 inline mr-1" />
              Local
            </span>
            <Switch
              checked={isUrlMode}
              onCheckedChange={handleModeChange}
              className="scale-90"
            />
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                isUrlMode ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Link className="w-3.5 h-3.5 inline mr-1" />
              URL
            </span>
          </div>
        </div>

        {/* Input — key forces full remount on mode switch */}
        {isUrlMode ? (
          <Input
            key="url-input"
            type="url"
            placeholder="https://example.com/image.png"
            value={state.submitValue}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            disabled={isUploading}
            className="h-8 text-sm"
          />
        ) : (
          <Input
            key="file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="h-8 text-sm cursor-pointer"
          />
        )}

        {/* Error */}
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}

        {/* Upload button */}
        <Button
          type="button"
          size="sm"
          onClick={handleUpload}
          disabled={!isReadyToUpload}
          className="w-full h-8 text-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
              {value?.assetId ? "Update Image" : "Upload Image"}
            </>
          )}
        </Button>
      </div>
    ),
    [
      isUrlMode,
      isReadyToUpload,
      uploadError,
      state.submitValue,
      handleModeChange,
      handleUrlChange,
      handleFileChange,
      handleKeyDown,
      handleUpload,
      isUploading,
      value?.assetId,
    ],
  )

  return (
    <DroppedComponentWrapper
      value={value}
      dimensions={dimensions}
      toolbar={ImageToolbar}
    >
      <div className="size-full">
        {canvasPreviewUrl ? (
          // Active pick preview OR committed post-upload preview
          <div className="size-full rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={canvasPreviewUrl}
              alt="Preview"
              className="w-full h-full object-center"
            />
          </div>
        ) : value?.assetId ? (
          // Saved asset with no pending changes
          <Component />
        ) : (
          <EmptyPlaceholder />
        )}
      </div>
    </DroppedComponentWrapper>
  )
}

export default ImageComponent
