"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses, mockStudents, type Assignment, type Challenge, type Prize } from "@/lib/mock-data"
import { FileText, PlusCircle, User, Trash2, HelpCircle, ClipboardCheck, ListTodo, Pencil, Wand2, BrainCircuit, FileUp, Gift, Calendar as CalendarIcon, Clock } from "lucide-react"
import { AIContentGenerator } from "@/components/ai-content-generator"
import { AIChallengeGenerator } from "@/components/ai-challenge-generator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { CreatePrizeModal } from "@/components/create-prize-modal"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const assignmentIcons = {
  quiz: <HelpCircle className="h-5 w-5 text-primary" />,
  survey: <ListTodo className="h-5 w-5 text-primary" />,
  assignment: <ClipboardCheck className="h-5 w-5 text-primary" />,
};

const challengeIcons = {
  quiz: <BrainCircuit className="h-5 w-5 text-primary" />,
  submission: <FileUp className="h-5 w-5 text-primary" />,
};

export default function TeacherCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [prizes, setPrizes] = React.useState<Prize[]>([]);
  const [assignmentToEdit, setAssignmentToEdit] = React.useState<Assignment | null>(null);

  const { register, handleSubmit, setValue, getValues, control, reset, formState: {isDirty} } = useForm<Assignment>();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && course) {
      const storedAssignments = localStorage.getItem(`assignments-${course.id}`);
      if (storedAssignments) {
        setAssignments(JSON.parse(storedAssignments));
      }
       const storedChallenges = localStorage.getItem(`challenges-${course.id}`);
      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      }
      const storedPrizes = localStorage.getItem(`prizes-${course.id}`);
      if (storedPrizes) {
          setPrizes(JSON.parse(storedPrizes));
      }
    }
  }, [course?.id]);

  React.useEffect(() => {
    if (assignmentToEdit) {
      reset({
        ...assignmentToEdit,
        dueDate: new Date(assignmentToEdit.dueDate) as any, // The form expects a Date object
      });
    }
  }, [assignmentToEdit, reset]);

  const handlePublishAssignment = (newAssignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...newAssignmentData,
      id: `asg-${Date.now()}`
    };
    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    if (course) {
      localStorage.setItem(`assignments-${course.id}`, JSON.stringify(updatedAssignments));
    }
  };

  const handleSaveAssignment = (data: Assignment) => {
    const questionsString = getValues('questions') as any;
    let questions;
    try {
        questions = typeof questionsString === 'string' ? JSON.parse(questionsString) : questionsString;
    } catch(e) {
        console.error("Invalid JSON for questions");
        questions = [];
    }
    
    // Ensure dueDate is an ISO string before saving
    const updatedAssignment = { 
        ...data, 
        questions,
        dueDate: new Date(data.dueDate).toISOString()
    };

    const updatedAssignments = assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a);
    setAssignments(updatedAssignments);
    if (course) {
      localStorage.setItem(`assignments-${course.id}`, JSON.stringify(updatedAssignments));
    }
    setAssignmentToEdit(null);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    if (course) {
      localStorage.setItem(`assignments-${course.id}`, JSON.stringify(updatedAssignments));
    }
  };

  const handlePublishChallenge = (newChallengeData: Omit<Challenge, 'id'>) => {
    const newChallenge: Challenge = {
      ...newChallengeData,
      id: `chl-${Date.now()}`,
    };
    const updatedChallenges = [...challenges, newChallenge];
    setChallenges(updatedChallenges);
    if (course) {
      localStorage.setItem(`challenges-${course.id}`, JSON.stringify(updatedChallenges));
    }
  };

  const handleDeleteChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.filter(c => c.id !== challengeId);
    setChallenges(updatedChallenges);
    if (course) {
      localStorage.setItem(`challenges-${course.id}`, JSON.stringify(updatedChallenges));
    }
  };
  
  const handlePublishPrize = (newPrizeData: Omit<Prize, 'id'>) => {
    const newPrize: Prize = {
      ...newPrizeData,
      id: `prz-${Date.now()}`,
    };
    const updatedPrizes = [...prizes, newPrize];
    setPrizes(updatedPrizes);
    if (course) {
      localStorage.setItem(`prizes-${course.id}`, JSON.stringify(updatedPrizes));
    }
  };

  const handleDeletePrize = (prizeId: string) => {
      const updatedPrizes = prizes.filter(p => p.id !== prizeId);
      setPrizes(updatedPrizes);
      if (course) {
        localStorage.setItem(`prizes-${course.id}`, JSON.stringify(updatedPrizes));
      }
  };

  if (!course) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Curso no encontrado.</p>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground font-body mt-2">Código del Curso: <Badge variant="secondary" className="text-base font-mono">{course.code}</Badge></p>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="prizes">Premios</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="leaderboard">Clasificación</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <CardTitle>Materiales del Curso</CardTitle>
                <CardDescription>Sube y gestiona los archivos del curso.</CardDescription>
              </div>
              <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Subir Material</Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3"><FileText className="text-primary"/><span>Capítulo 1: Introducción a la IA.pdf</span></div>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </li>
                 <li className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3"><FileText className="text-primary"/><span>Capítulo 2: Fundamentos de Machine Learning.pdf</span></div>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
             <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Tareas del Curso</CardTitle>
                  <CardDescription>Crea y publica tareas, cuestionarios y encuestas con IA.</CardDescription>
                </div>
                <AIContentGenerator courseName={course.title} onPublish={handlePublishAssignment} />
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {assignments.map(assignment => (
                       <AccordionItem value={assignment.id} key={assignment.id} className="border rounded-md px-4">
                        <AccordionTrigger className="hover:no-underline">
                           <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                {assignmentIcons[assignment.type]}
                                <div className="flex flex-col text-left">
                                  <span className="font-semibold">{assignment.title}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Vence: {format(new Date(assignment.dueDate), "dd MMM, yyyy 'a las' p", { locale: es })}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 bg-muted/50 rounded-md">
                            {assignment.type === 'quiz' && assignment.questions ? (
                              <div className="space-y-4">
                                <p className="text-sm italic">{assignment.content}</p>
                                {assignment.questions.map((q, i) => (
                                  <div key={i} className="text-sm">
                                    <p className="font-semibold">{i + 1}. {q.question}</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                      {q.options.map((opt, j) => (
                                        <li key={j} className={j === q.correctAnswerIndex ? 'text-green-600 font-bold' : ''}>
                                          {opt}
                                        </li>
                                      ))}
                                    </ul>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      <span className="font-semibold">Explicación:</span> {q.explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap text-sm">{assignment.content}</p>
                            )}
                            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                               <Button variant="outline" size="sm" onClick={() => setAssignmentToEdit(assignment)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>Aún no se ha generado contenido. Utiliza el asistente de IA para empezar.</p>
                  </div>
                )}
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                        <CardTitle>Desafíos del Curso</CardTitle>
                        <CardDescription>Crea desafíos gamificados para mantener a tus estudiantes motivados.</CardDescription>
                    </div>
                    <AIChallengeGenerator onPublish={handlePublishChallenge} />
                </CardHeader>
                <CardContent className="space-y-4">
                    {challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.map(challenge => (
                                <Card key={challenge.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                              {challengeIcons[challenge.type]} {challenge.title}
                                            </CardTitle>
                                            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleDeleteChallenge(challenge.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </div>
                                        <CardDescription>{challenge.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">Tema: <span className="font-semibold">{challenge.topic}</span></p>
                                    </CardContent>
                                    <CardFooter>
                                        <p className="font-bold text-yellow-500 text-lg">+{challenge.points} Puntos</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Aún no has creado ningún desafío. ¡Usa la IA para empezar!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="prizes">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                        <CardTitle>Premios del Curso</CardTitle>
                        <CardDescription>Crea recompensas para incentivar a tus estudiantes.</CardDescription>
                    </div>
                    <CreatePrizeModal onPublish={handlePublishPrize} courseId={course.id} />
                </CardHeader>
                <CardContent className="space-y-4">
                    {prizes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {prizes.map(prize => (
                                <Card key={prize.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Gift className="text-primary" /> {prize.title}
                                            </CardTitle>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeletePrize(prize.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <CardDescription>{prize.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Objetivo: <Badge variant="outline">{prize.target === 'course' ? 'Todo el curso' : mockStudents.find(s => s.id === prize.studentId)?.name || 'Estudiante específico'}</Badge>
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <p className="font-bold text-yellow-500 text-lg">{prize.pointsRequired.toLocaleString()} Puntos</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Aún no has creado ningún premio. ¡Crea uno para empezar!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
                <CardTitle>Estudiantes Inscritos</CardTitle>
                <CardDescription>Una lista de todos los estudiantes actualmente inscritos en este curso.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                 {mockStudents.map(student => (
                    <li key={student.id} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatarUrl} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{student.name}</span>
                        </div>
                        <span className="text-muted-foreground">{student.points} pts</span>
                    </li>
                 ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!assignmentToEdit} onOpenChange={(open) => {if (!open) setAssignmentToEdit(null)}}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>Realiza cambios en la tarea. Haz clic en guardar cuando termines.</DialogDescription>
          </DialogHeader>
          {assignmentToEdit && (
            <form onSubmit={handleSubmit(handleSaveAssignment)} className="space-y-4 py-4">
               <div>
                  <Label htmlFor="edit-title">Título</Label>
                  <Input id="edit-title" {...register("title")} />
              </div>
              <div>
                  <Label htmlFor="edit-content">Contenido / Descripción</Label>
                  <Textarea id="edit-content" {...register("content")} />
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
                          {field.value ? format(new Date(field.value), "PPP", { locale: es }) : <span>Elige una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value as any}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {assignmentToEdit.type === 'quiz' && (
                  <div>
                      <Label htmlFor="edit-questions">Preguntas (formato JSON)</Label>
                      <Textarea 
                          id="edit-questions" 
                          rows={15}
                          {...register("questions" as any)} // Registering questions as a JSON string
                          defaultValue={JSON.stringify(assignmentToEdit.questions, null, 2)}
                      />
                  </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAssignmentToEdit(null)}>Cancelar</Button>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
