"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses, mockStudents, type Assignment, type Challenge, type Prize, type ChallengeSubmission, type Student } from "@/lib/mock-data"
import { FileText, PlusCircle, User, Trash2, HelpCircle, ClipboardCheck, ListTodo, Pencil, Wand2, BrainCircuit, FileUp, Gift, Calendar as CalendarIcon, Clock, Check, X, Eye } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"


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
  const [submissions, setSubmissions] = React.useState<ChallengeSubmission[]>([]);
  const [assignmentToEdit, setAssignmentToEdit] = React.useState<Assignment | null>(null);
  const [viewingImage, setViewingImage] = React.useState<string | null>(null);
  const { toast } = useToast()

  const { register, handleSubmit, setValue, getValues, control, reset, formState: {isDirty} } = useForm<Assignment>();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && course) {
      const storedAssignments = localStorage.getItem(`assignments-${course.id}`);
      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      
      const storedChallenges = localStorage.getItem(`challenges-${course.id}`);
      if (storedChallenges) setChallenges(JSON.parse(storedChallenges));
      
      const storedPrizes = localStorage.getItem(`prizes-${course.id}`);
      if (storedPrizes) setPrizes(JSON.parse(storedPrizes));

      const storedSubmissions = localStorage.getItem(`challengeSubmissions-${course.id}`);
      if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
    }
  }, [course?.id]);

  React.useEffect(() => {
    if (assignmentToEdit) {
      reset({
        ...assignmentToEdit,
        dueDate: new Date(assignmentToEdit.dueDate) as any,
      });
    }
  }, [assignmentToEdit, reset]);

  const saveState = (key: string, value: any) => {
    if (course) {
      localStorage.setItem(`${key}-${course.id}`, JSON.stringify(value));
    }
  }

  const handlePublishAssignment = (newAssignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...newAssignmentData,
      id: `asg-${Date.now()}`
    };
    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    saveState('assignments', updatedAssignments);
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
    
    const updatedAssignment = { 
        ...data, 
        questions,
        dueDate: new Date(data.dueDate).toISOString()
    };

    const updatedAssignments = assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a);
    setAssignments(updatedAssignments);
    saveState('assignments', updatedAssignments);
    setAssignmentToEdit(null);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    saveState('assignments', updatedAssignments);
  };

  const handlePublishChallenge = (newChallengeData: Omit<Challenge, 'id'>) => {
    const newChallenge: Challenge = {
      ...newChallengeData,
      id: `chl-${Date.now()}`,
    };
    const updatedChallenges = [...challenges, newChallenge];
    setChallenges(updatedChallenges);
    saveState('challenges', updatedChallenges);
  };

  const handleDeleteChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.filter(c => c.id !== challengeId);
    setChallenges(updatedChallenges);
    saveState('challenges', updatedChallenges);
  };
  
  const handlePublishPrize = (newPrizeData: Omit<Prize, 'id'>) => {
    const newPrize: Prize = {
      ...newPrizeData,
      id: `prz-${Date.now()}`,
    };
    const updatedPrizes = [...prizes, newPrize];
    setPrizes(updatedPrizes);
    saveState('prizes', updatedPrizes);
  };

  const handleDeletePrize = (prizeId: string) => {
      const updatedPrizes = prizes.filter(p => p.id !== prizeId);
      setPrizes(updatedPrizes);
      saveState('prizes', updatedPrizes);
  };

  const handleReviewSubmission = (submissionId: string, newStatus: 'approved' | 'rejected') => {
    const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updatedSubmissions);
    saveState('challengeSubmissions', updatedSubmissions);
    toast({
        title: "Revisión enviada",
        description: `La entrega ha sido marcada como ${newStatus === 'approved' ? 'aprobada' : 'rechazada'}.`
    });
  };

  if (!course) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Curso no encontrado.</p>
        </div>
    )
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const submissionsByChallenge = pendingSubmissions.reduce((acc, sub) => {
    if (!acc[sub.challengeTitle]) {
      acc[sub.challengeTitle] = [];
    }
    acc[sub.challengeTitle].push(sub);
    return acc;
  }, {} as Record<string, ChallengeSubmission[]>);


  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground font-body mt-2">Código del Curso: <Badge variant="secondary" className="text-base font-mono">{course.code}</Badge></p>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="submissions">
            Revisiones
            {pendingSubmissions.length > 0 && 
              <Badge className="ml-2">{pendingSubmissions.length}</Badge>
            }
          </TabsTrigger>
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
                    {assignments.map(assignment => {
                       const dueDate = new Date(assignment.dueDate);
                       return (
                       <AccordionItem value={assignment.id} key={assignment.id} className="border rounded-md px-4">
                        <AccordionTrigger className="hover:no-underline">
                           <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                {assignmentIcons[assignment.type]}
                                <div className="flex flex-col text-left">
                                  <span className="font-semibold">{assignment.title}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {!isNaN(dueDate.getTime()) ? (
                                      <span>Vence: {format(dueDate, "dd MMM, yyyy 'a las' p", { locale: es })}</span>
                                    ) : null}
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
                       )
                    })}
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

        <TabsContent value="submissions">
            <Card>
                <CardHeader>
                    <CardTitle>Entregas Pendientes de Revisión</CardTitle>
                    <CardDescription>Revisa el trabajo de tus estudiantes para los desafíos de entrega.</CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingSubmissions.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {Object.entries(submissionsByChallenge).map(([challengeTitle, subs]) => (
                                <AccordionItem value={challengeTitle} key={challengeTitle} className="border rounded-md px-4">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">{challengeTitle}</span>
                                            </div>
                                            <Badge variant="secondary">{subs.length} pendiente(s)</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-3 pt-2">
                                            {subs.map(sub => (
                                                <li key={sub.id} className="flex items-center justify-between p-3 rounded-md border bg-background">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://placehold.co/40x40.png?text=${sub.studentName.charAt(0)}`} />
                                                            <AvatarFallback>{sub.studentName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                          <p className="font-semibold">{sub.studentName}</p>
                                                          <p className="text-xs text-muted-foreground">Entregado: {format(new Date(sub.submittedAt), "dd MMM, yyyy", { locale: es })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="icon" onClick={() => setViewingImage(sub.imageUrl)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleReviewSubmission(sub.id, 'rejected')}><X className="mr-2 h-4 w-4"/>Rechazar</Button>
                                                        <Button size="sm" onClick={() => handleReviewSubmission(sub.id, 'approved')}><Check className="mr-2 h-4 w-4"/>Aprobar</Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>¡Buen trabajo! No hay entregas pendientes.</p>
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
                    render={({ field }) => {
                        const dateValue = field.value ? new Date(field.value) : null;
                        const timeValue = dateValue ? format(dateValue, 'HH:mm') : '';

                        const handleDateSelect = (date: Date | undefined) => {
                            if (!date) {
                                field.onChange(undefined);
                                return;
                            }
                            const currentValue = field.value ? new Date(field.value) : new Date();
                            const newDate = new Date(date);
                            newDate.setHours(currentValue.getHours());
                            newDate.setMinutes(currentValue.getMinutes());
                            field.onChange(newDate);
                        };

                        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const time = e.target.value;
                            if (!time) return;

                            const [hours, minutes] = time.split(':').map(Number);
                            const currentValue = field.value ? new Date(field.value) : new Date();
                            const newDate = new Date(currentValue);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            field.onChange(newDate);
                        };

                        return (
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateValue && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateValue ? format(dateValue, "dd MMM, yyyy 'a las' p", { locale: es }) : <span>Elige una fecha y hora</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dateValue}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                            <div className="p-3 border-t border-border">
                                <Label className="text-sm">Hora de entrega</Label>
                                <Input
                                    type="time"
                                    className="mt-2"
                                    value={timeValue}
                                    onChange={handleTimeChange}
                                />
                            </div>
                            </PopoverContent>
                        </Popover>
                        );
                    }}
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
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Revisión de Entrega</DialogTitle>
            <DialogDescription>
              Esta es la imagen que el estudiante ha entregado para el desafío.
            </DialogDescription>
          </DialogHeader>
          {viewingImage && <Image src={viewingImage} alt="Entrega de estudiante" width={1200} height={800} className="rounded-md mt-4" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
