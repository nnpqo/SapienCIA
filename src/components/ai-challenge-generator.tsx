"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Wand2, FileUp, BrainCircuit } from "lucide-react"
import { generateChallengeDetails, type GenerateChallengeDetailsOutput } from "@/ai/flows/generate-challenge-details"
import { useForm, Controller } from "react-hook-form"
import type { Challenge } from "@/lib/mock-data"

interface AIChallengeGeneratorProps {
  onPublish: (challenge: Omit<Challenge, 'id'>) => void
}

type FormData = {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'submission';
};

export function AIChallengeGenerator({ onPublish }: AIChallengeGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GenerateChallengeDetailsOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { control, handleSubmit, register, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      difficulty: "medium",
      topic: "",
      type: "quiz",
    }
  })

  const topicValue = watch('topic');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setGeneratedContent(null)
    try {
      const result = await generateChallengeDetails(data)
      setGeneratedContent(result)
    } catch (error) {
      console.error("Error generating challenge details:", error)
      // You might want a more user-friendly error message here
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = () => {
    if (generatedContent) {
      onPublish({
        ...generatedContent,
        topic: topicValue,
      })
      setOpen(false)
      setGeneratedContent(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Wand2 className="mr-2 h-4 w-4" /> Crear Desafío con IA</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Generar Desafío con IA</DialogTitle>
          <DialogDescription>Crea desafíos gamificados para tus estudiantes. La IA sugerirá un título, descripción y puntos.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div>
              <Label htmlFor="topic">Tema del Desafío</Label>
              <Input id="topic" {...register("topic", { required: "El tema es obligatorio" })} placeholder="Ej: Historia de Bolivia" />
              {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
            </div>
            <div>
              <Label>Tipo de Desafío</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">
                        <div className="flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4" /> Cuestionario (IA)
                        </div>
                      </SelectItem>
                      <SelectItem value="submission">
                        <div className="flex items-center gap-2">
                           <FileUp className="h-4 w-4" /> Entrega de Archivo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Nivel de Dificultad</Label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecciona la dificultad" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading || !topicValue} className="w-full">
              {isLoading ? "Generando..." : "Generar Detalles"}
            </Button>
          </form>

          <div className="bg-secondary/50 p-4 rounded-lg flex flex-col">
            <h3 className="font-headline mb-4 text-center">Detalles Sugeridos</h3>
            <div className="bg-background rounded-md border p-4 h-full flex items-center justify-center">
              {isLoading ? (
                <div className="text-center text-muted-foreground">
                  <p>La IA está creando un desafío increíble...</p>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4 text-center">
                  <h4 className="font-bold text-lg text-primary">{generatedContent.title}</h4>
                   <p className="text-sm">{generatedContent.description}</p>
                   <p className="font-bold text-xl text-yellow-500">+{generatedContent.points} Puntos</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Los detalles del desafío aparecerán aquí.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
           <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handlePublish} disabled={!generatedContent || isLoading}>
            <Upload className="mr-2 h-4 w-4" />
            Publicar Desafío
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
