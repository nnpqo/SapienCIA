"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { UploadCloud, CheckCircle, Wand2, Loader2, Send } from "lucide-react"
import type { Challenge } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { analyzeSubmission, type AnalyzeSubmissionOutput } from "@/ai/flows/analyze-submission-flow"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface SubmissionChallengeModalProps {
  challenge: Challenge
  children: React.ReactNode
  onFinalSubmit: (imageDataUri: string) => void
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function SubmissionChallengeModal({ challenge, children, onFinalSubmit }: SubmissionChallengeModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AnalyzeSubmissionOutput | null>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAiFeedback(null); // Reset previous analysis
      setSelectedFile(file)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleGetFeedback = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setAiFeedback(null);
    try {
      const dataUri = await fileToDataUri(selectedFile);
      const result = await analyzeSubmission({ 
        photoDataUri: dataUri,
        topic: challenge.topic,
        description: challenge.description
      });
      setAiFeedback(result);
    } catch (error) {
       console.error("Error analyzing submission:", error);
       toast({
         title: "Error de Análisis",
         description: "No se pudo analizar la imagen. Por favor, inténtalo de nuevo.",
         variant: "destructive",
       })
    } finally {
        setIsLoading(false)
    }
  }

  const handleFinalSubmit = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const dataUri = await fileToDataUri(selectedFile);
      onFinalSubmit(dataUri);
      // Parent component will handle closing the modal and showing toast
      setOpen(false); // Close the modal on successful submission
    } catch (error) {
      toast({ title: "Error al Entregar", description: "No se pudo entregar el trabajo. Inténtalo de nuevo."});
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])
  
  const resetState = () => {
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setIsLoading(false)
      setAiFeedback(null)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
        setTimeout(() => {
           resetState()
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
              <Input id={`file-upload-${challenge.id}`} type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
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
          {aiFeedback && (
              <Alert variant={aiFeedback.isApproved ? 'default' : 'destructive'}>
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Retroalimentación de la IA</AlertTitle>
                  <AlertDescription>
                      {aiFeedback.feedback}
                  </AlertDescription>
              </Alert>
          )}
        </div>
        <DialogFooter className="gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={handleGetFeedback} disabled={!selectedFile || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
              Retroalimentación IA
            </Button>
            <Button onClick={handleFinalSubmit} disabled={!selectedFile || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
              Entregar para Revisión
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
