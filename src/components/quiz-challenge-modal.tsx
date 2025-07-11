"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { generateQuizChallenge, type GenerateQuizChallengeOutput } from "@/ai/flows/generate-quiz-challenge"
import { Loader2, PartyPopper, Frown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { Challenge } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface QuizChallengeModalProps {
  challenge: Challenge
  children: React.ReactNode
  onChallengeComplete: () => void
}

const FormSchema = z.object({
  answers: z.record(z.string()),
})

export function QuizChallengeModal({ challenge, children, onChallengeComplete }: QuizChallengeModalProps) {
  const [open, setOpen] = useState(false)
  const [quiz, setQuiz] = useState<GenerateQuizChallengeOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{ score: number; total: number; explanations: { question: string, explanation: string, isCorrect: boolean }[] } | null>(null)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answers: {},
    },
  })

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !quiz && !results) {
      setIsLoading(true)
      form.reset()
      try {
        const generatedQuiz = await generateQuizChallenge({ topic: challenge.topic })
        setQuiz(generatedQuiz)
      } catch (error) {
        console.error("Error generating quiz:", error)
        toast({
          title: "Error al generar desafío",
          description: "No se pudo crear el cuestionario. Por favor, intenta de nuevo.",
          variant: "destructive",
        })
        setOpen(false)
      } finally {
        setIsLoading(false)
      }
    }
    if (!isOpen) {
      // Reset state when closing, for next time
      setTimeout(() => {
        setQuiz(null)
        setResults(null)
        setIsLoading(false)
      }, 300)
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!quiz) return
    let score = 0
    const explanations = quiz.questions.map((q, index) => {
      const userAnswerIndex = parseInt(data.answers[String(index)], 10)
      const isCorrect = userAnswerIndex === q.correctAnswerIndex
      if (isCorrect) {
        score++
      }
      return { question: q.question, explanation: q.explanation, isCorrect }
    })
    const isSuccess = score / quiz.questions.length >= 0.8;
    if (isSuccess) {
        onChallengeComplete()
    }
    setResults({ score, total: quiz.questions.length, explanations })
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Generando tu desafío de IA...</p>
        </div>
      )
    }

    if (results) {
      const isSuccess = results.score / results.total >= 0.8;
      return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-lg">
                {isSuccess ? <PartyPopper className="h-16 w-16 text-green-500" /> : <Frown className="h-16 w-16 text-destructive" />}
                <h3 className="text-2xl font-bold mt-4">{isSuccess ? "¡Desafío Completado!" : "¡Sigue intentando!"}</h3>
                <p className="text-lg text-muted-foreground mt-2">
                    Obtuviste {results.score} de {results.total} respuestas correctas.
                </p>
                {isSuccess && <p className="text-sm text-green-600 font-semibold mt-1">+{challenge.points} Puntos Obtenidos</p>}
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {results.explanations.map((item, index) => (
                    <Alert key={index} variant={item.isCorrect ? "default" : "destructive"} className={cn(item.isCorrect ? 'border-green-500' : '')}>
                        <AlertTitle className="font-bold">{item.question}</AlertTitle>
                        <AlertDescription>{item.explanation}</AlertDescription>
                    </Alert>
                ))}
            </div>
        </div>
      )
    }

    if (quiz) {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-6">
              {quiz.questions.map((q, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`answers.${index}`}
                  rules={{ required: "Por favor, selecciona una respuesta."}}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold text-base">{index + 1}. {q.question}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {q.options.map((option, optionIndex) => (
                            <FormItem key={optionIndex} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={String(optionIndex)} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">Enviar Respuestas</Button>
            </DialogFooter>
          </form>
        </Form>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
         <p className="text-muted-foreground">No se pudo generar el cuestionario. Por favor, intenta de nuevo.</p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">{quiz?.title || challenge.title}</DialogTitle>
           {!results && quiz && (
            <DialogDescription className="text-center">Responde las siguientes preguntas para completar el desafío.</DialogDescription>
           )}
        </DialogHeader>
        {renderContent()}
         {results && (
            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>Cerrar</Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
