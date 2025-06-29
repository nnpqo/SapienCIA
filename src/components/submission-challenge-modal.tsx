"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { UploadCloud, CheckCircle, PartyPopper, Frown, Loader2 } from "lucide-react"
import type { Challenge } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { analyzeSubmission, type AnalyzeSubmissionOutput } from "@/ai/flows/analyze-submission-flow"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface SubmissionChallengeModalProps {
  challenge: Challenge
  children: React.ReactNode
  onChallengeComplete: () => void
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function SubmissionChallengeModal({ challenge, children, onChallengeComplete }: SubmissionChallengeModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSubmissionOutput | null>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAnalysisResult(null); // Reset previous analysis
      setSelectedFile(file)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsSubmitting(true)
    setAnalysisResult(null)
    
    try {
      const dataUri = await fileToDataUri(selectedFile);
      const result = await analyzeSubmission({ 
        photoDataUri: dataUri,
        topic: challenge.topic,
        description: challenge.description
      });
      setAnalysisResult(result);

      if (result.isApproved) {
        toast({
          title: "¡Entrega exitosa!",
          description: `¡La IA ha aprobado tu entrega! Has ganado ${challenge.points} puntos.`,
        })
        onChallengeComplete()
      } else {
         toast({
          title: "Inténtalo de nuevo",
          description: `La IA ha revisado tu entrega y tiene algunas sugerencias.`,
          variant: "destructive",
        })
      }
    } catch (error) {
       console.error("Error analyzing submission:", error);
       toast({
         title: "Error de Análisis",
         description: "No se pudo analizar la imagen. Por favor, inténtalo de nuevo.",
         variant: "destructive",
       })
    } finally {
        setIsSubmitting(false)
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
      setIsSubmitting(false)
      setAnalysisResult(null)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
        setTimeout(() => {
           resetState()
        }, 300)
    }
  }

  const renderFooter = () => {
      if (analysisResult?.isApproved) {
          return (
               <DialogFooter>
                  <Button onClick={() => setOpen(false)}>¡Genial!</Button>
              </DialogFooter>
          )
      }
      if (analysisResult && !analysisResult.isApproved) {
           return (
               <DialogFooter>
                  <Button variant="outline" onClick={resetState}>Intentar de Nuevo</Button>
              </DialogFooter>
          )
      }
      return (
         <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : `Entregar y que la IA revise`}
          </Button>
        </DialogFooter>
      )
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
              <Input id={`file-upload-${challenge.id}`} type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isSubmitting} />
            </Label>
          </div>
          {selectedFile && !analysisResult && (
              <div className="flex items-center p-2 text-sm border rounded-md bg-background">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium truncate">{selectedFile.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}
            {analysisResult && (
                <Alert variant={analysisResult.isApproved ? 'default' : 'destructive'}>
                    {analysisResult.isApproved ? <PartyPopper className="h-4 w-4" /> : <Frown className="h-4 w-4" />}
                    <AlertTitle>{analysisResult.isApproved ? '¡Aprobado por la IA!' : 'Necesita Revisión'}</AlertTitle>
                    <AlertDescription>
                        {analysisResult.feedback}
                    </AlertDescription>
                </Alert>
            )}
        </div>
        {renderFooter()}
      </DialogContent>
    </Dialog>
  )
}
