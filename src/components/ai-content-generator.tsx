"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Upload, Calendar as CalendarIcon } from "lucide-react"
import { generateEducationalContent, type GenerateEducationalContentInput, type GenerateEducationalContentOutput } from "@/ai/flows/generate-educational-content"
import { useForm, Controller } from "react-hook-form"
import type { Assignment } from "@/lib/mock-data"
import { ScrollArea } from "./ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"
import { useToast } from "@/hooks/use-toast"

interface AIContentGeneratorProps {
  courseName: string
  onPublish: (assignment: Omit<Assignment, 'id'>) => void
}

type FormData = Omit<GenerateEducationalContentInput, 'courseName'> & { dueDate: Date }

export function AIContentGenerator({ courseName, onPublish }: AIContentGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GenerateEducationalContentOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();

  const { control, handleSubmit, register, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      contentType: "quiz",
      difficultyLevel: "medium",
      topic: "",
      length: "",
      additionalInstructions: "",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
    }
  })

  const onSubmit = async (data: Omit<GenerateEducationalContentInput, 'courseName'>) => {
    setIsLoading(true)
    setGeneratedContent(null)
    try {
      const result = await generateEducationalContent({ ...data, courseName })
      setGeneratedContent(result)
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent({ title: "Error", content: "No se pudo generar el contenido. Por favor, inténtalo de nuevo.", contentType: 'assignment' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = (data: FormData) => {
    if (generatedContent && generatedContent.title !== "Error") {
      onPublish({
        title: generatedContent.title,
        type: generatedContent.contentType,
        content: generatedContent.content,
        questions: generatedContent.questions,
        dueDate: data.dueDate.toISOString(),
      })
      toast({
        title: "¡Tarea Publicada!",
        description: "La nueva tarea está ahora disponible para tus estudiantes.",
      })
      setOpen(false)
      setGeneratedContent(null)
      reset()
    } else {
        toast({
            title: "Error",
            description: "Primero debes generar el contenido de la tarea antes de publicarla.",
            variant: "destructive"
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Sparkles className="mr-2 h-4 w-4" /> Generar Tarea con IA</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Generar Contenido Educativo</DialogTitle>
          <DialogDescription>Usa la IA para crear rápidamente cuestionarios, encuestas o tareas para tu curso.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <form id="ai-content-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Tipo de Contenido</Label>
              <Controller
                name="contentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecciona el tipo de contenido" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Cuestionario</SelectItem>
                      <SelectItem value="survey">Encuesta</SelectItem>
                      <SelectItem value="assignment">Tarea</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="topic">Tema</Label>
              <Input id="topic" {...register("topic", { required: "El tema es obligatorio" })} placeholder="Ej: Introducción a Redes Neuronales" />
              {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
            </div>
             <div>
              <Label>Fecha de Entrega</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Elige una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div>
              <Label htmlFor="length">Longitud</Label>
              <Input id="length" {...register("length")} placeholder="Ej: 5 preguntas" />
            </div>
            <div>
              <Label htmlFor="additionalInstructions">Instrucciones Adicionales</Label>
              <Textarea id="additionalInstructions" {...register("additionalInstructions")} placeholder="Ej: Enfocarse en ejemplos prácticos" />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generando..." : "Generar Contenido"}
            </Button>
          </form>

          <div className="bg-secondary/50 p-4 rounded-lg flex flex-col">
            <h3 className="font-headline mb-4 text-center">Contenido Generado</h3>
            <ScrollArea className="bg-background rounded-md border p-4 h-[400px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>La IA está pensando...</p>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">{generatedContent.title}</h4>
                  {generatedContent.contentType === 'quiz' && generatedContent.questions ? (
                    <div className="space-y-3 text-sm">
                      <p className="italic">{generatedContent.content}</p>
                      {generatedContent.questions.map((q, i) => (
                        <div key={i} className="pb-2">
                          <p className="font-semibold">{i + 1}. {q.question}</p>
                          <ul className="list-disc pl-5">
                            {q.options.map((opt, j) => (
                              <li key={j} className={j === q.correctAnswerIndex ? 'font-bold' : ''}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <p className="text-sm whitespace-pre-wrap">{generatedContent.content}</p>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Tu contenido generado aparecerá aquí.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit(handlePublish)} disabled={!generatedContent || isLoading || generatedContent?.title === "Error"}>
            <Upload className="mr-2 h-4 w-4" />
            Publicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
