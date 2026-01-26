import type React from "react"
import { useState, useRef } from "react"
import { Upload, ImageIcon, Sparkles, Loader2, Trash2, RotateCcw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { ScrollArea } from "@/shared/components/ui/scroll-area"

interface EditImageModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditImageModal({ isOpen, onClose }: EditImageModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setEditedImageUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setEditedImageUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile || !prompt.trim()) return

    setIsProcessing(true)

    // Aqui iria la logica para enviar la imagen y el prompt al modelo de IA
    // Por ahora simulamos un delay
    // Ejemplo de datos a enviar:
    // const formData = new FormData()
    // formData.append("image", imageFile)
    // formData.append("prompt", prompt)
    // const response = await fetch("/api/edit-image", { method: "POST", body: formData })

    console.log({
      image: imageFile,
      prompt: prompt,
    })

    // Simulacion de procesamiento
    setTimeout(() => {
      setIsProcessing(false)
      // Aqui se estableceria la URL de la imagen editada
      // setEditedImageUrl(response.editedImageUrl)
    }, 2000)
  }

  const handleClearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setEditedImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleReset = () => {
    setEditedImageUrl(null)
    setPrompt("")
  }

  const promptSuggestions = [
    "Enhance lighting and colors",
    "Add a professional background",
    "Modern minimalist style",
    "Convert to illustration style",
    "Remove the background",
    "Increase resolution",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Image with AI</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Scrollable area for form fields */}
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 text-gray-900">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seccion de carga de imagen */}
                <div className="space-y-4">
                <Label htmlFor="image-upload">
                  Original Image
                </Label>

                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
                  >
                    <label htmlFor="image-upload" className="cursor-pointer block text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drag an image or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                      <input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleClearImage}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {imageFile && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        <span className="truncate">{imageFile.name}</span>
                        <span className="text-muted-foreground/70">
                          ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Seccion de resultado editado */}
              <div className="space-y-4">
                <Label htmlFor="result">
                  Result
                </Label>

                <div className="border-2 border-dashed border-border rounded-lg p-8 min-h-[280px] flex items-center justify-center bg-muted/50">
                  {isProcessing ? (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-3" />
                      <p className="text-sm text-foreground font-medium">Processing image...</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                    </div>
                  ) : editedImageUrl ? (
                    <div className="relative w-full">
                      <img
                        src={editedImageUrl || "/placeholder.svg"}
                        alt="Edited"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={handleReset}
                        className="absolute top-3 right-3 h-8 w-8"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The edited image will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seccion de prompt */}
            <div className="space-y-4">
              <Label htmlFor="prompt">
                Describe how you want to edit the image
              </Label>

              <div className="relative">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="E.g: Improve colors, add a soft light effect, change background to a gradient..."
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {prompt.length}/500
                </div>
              </div>

              {/* Sugerencias de prompt */}
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          </ScrollArea>

          {/* Action Buttons: Cancel, Edit with AI */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!imageFile || !prompt.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Edit with AI
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
