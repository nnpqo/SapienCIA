"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { generateEducationalContent, type GenerateEducationalContentInput } from "@/ai/flows/generate-educational-content"
import { useForm, Controller } from "react-hook-form"

interface AIContentGeneratorProps {
  courseName: string
}

export function AIContentGenerator({ courseName }: AIContentGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{ title: string; content: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { control, handleSubmit, register, formState: { errors } } = useForm<Omit<GenerateEducationalContentInput, 'courseName'>>({
    defaultValues: {
      contentType: "quiz",
      difficultyLevel: "medium",
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
      setGeneratedContent({ title: "Error", content: "Failed to generate content. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Sparkles className="mr-2 h-4 w-4" /> Generate with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Generate Educational Content</DialogTitle>
          <DialogDescription>Use AI to quickly create quizzes, surveys, or assignments for your course.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Content Type</Label>
              <Controller
                name="contentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select content type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" {...register("topic", { required: "Topic is required" })} placeholder="e.g., Intro to Neural Networks" />
              {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <Controller
                name="difficultyLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="length">Length</Label>
              <Input id="length" {...register("length")} placeholder="e.g., 10 questions" />
            </div>
            <div>
              <Label htmlFor="additionalInstructions">Additional Instructions</Label>
              <Textarea id="additionalInstructions" {...register("additionalInstructions")} placeholder="e.g., Focus on practical examples" />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Content"}
            </Button>
          </form>

          <div className="bg-secondary/50 p-4 rounded-lg flex flex-col">
            <h3 className="font-headline mb-2 text-center">Generated Content</h3>
            <div className="flex-grow flex flex-col space-y-4">
              {isLoading ? (
                <div className="flex-grow flex items-center justify-center text-muted-foreground">
                  <p>AI is thinking...</p>
                </div>
              ) : generatedContent ? (
                <>
                  <Input readOnly value={generatedContent.title} className="font-bold bg-background" />
                  <Textarea readOnly value={generatedContent.content} className="flex-grow bg-background" rows={15} />
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center text-muted-foreground">
                  <p>Your generated content will appear here.</p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
