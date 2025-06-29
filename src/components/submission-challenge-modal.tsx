"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { UploadCloud, CheckCircle } from "lucide-react"
import type { Challenge } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface SubmissionChallengeModalProps {
  challenge: Challenge
  children: React.ReactNode
  onChallengeComplete: () => void
}

export function SubmissionChallengeModal({ challenge, children, onChallengeComplete }: SubmissionChallengeModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!selectedFile) return
    setIsSubmitting(true)
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "¡Entrega exitosa!",
        description: `Has ganado ${challenge.points} puntos por completar el desafío.`,
      })
      onChallengeComplete()
      setIsSubmitting(false)
      setOpen(false)
    }, 1500)
  }

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
        // Reset state on close
        setTimeout(() => {
            setSelectedFile(null)
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl)
            }
            setPreviewUrl(null)
            setIsSubmitting(false)
        }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">{challenge.title}</DialogTitle>
          <DialogDescription className="text-center">{challenge.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor={`file-upload-${challenge.id}`}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary"
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Vista previa" width={200} height={200} className="object-contain h-full w-full p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-muted-foreground">Imágenes (PNG, JPG, etc.)</p>
                </div>
              )}
              <Input id={`file-upload-${challenge.id}`} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </Label>
          </div>
          {selectedFile && (
              <div className="flex items-center p-2 text-sm border rounded-md bg-background">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium truncate">{selectedFile.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : `Entregar y ganar ${challenge.points} puntos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
