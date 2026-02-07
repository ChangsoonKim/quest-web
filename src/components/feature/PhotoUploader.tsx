import * as React from "react"
import { Camera, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PhotoUploaderProps {
  onFileSelect?: (file: File) => void
  onClear?: () => void
  initialPreviewUrl?: string
  className?: string
}

export function PhotoUploader({ onFileSelect, initialPreviewUrl, onClear, className }: PhotoUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(initialPreviewUrl)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onFileSelect?.(file)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl(undefined)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onClear?.()
  }

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/70", className)}>
      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-sm"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">삭제</span>
          </Button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium">인증 사진 촬영/업로드</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
