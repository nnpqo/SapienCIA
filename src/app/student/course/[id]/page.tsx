"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses, mockStudents, type Assignment, type Challenge, type Prize } from "@/lib/mock-data"
import { FileText, Award as AwardIcon, CheckCircle2, HelpCircle, ClipboardCheck, ListTodo, Send, BrainCircuit, FileUp, Gift, Lock, CheckCircle } from "lucide-react"
import { Chatbot } from "@/components/chatbot"
import { QuizChallengeModal } from "@/components/quiz-challenge-modal"
import { SubmissionChallengeModal } from "@/components/submission-challenge-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const assignmentIcons = {
  quiz: <HelpCircle className="h-5 w-5 text-primary" />,
  survey: <ListTodo className="h-5 w-5 text-primary" />,
  assignment: <ClipboardCheck className="h-5 w-5 text-primary" />,
};

const challengeIcons = {
  quiz: <BrainCircuit className="h-5 w-5 text-primary" />,
  submission: <FileUp className="h-5 w-5 text-primary" />,
};

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)
  
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [prizes, setPrizes] = React.useState<Prize[]>([]);
  const [completedChallenges, setCompletedChallenges] = React.useState<Set<string>>(new Set());
  const [completedAssignments, setCompletedAssignments] = React.useState<Set<string>>(new Set());
  const [claimedPrizes, setClaimedPrizes] = React.useState<Set<string>>(new Set());
  const [viewingAssignment, setViewingAssignment] = React.useState<Assignment | null>(null);
  const [assignmentSubmission, setAssignmentSubmission] = React.useState("");
  
  const quizForm = useForm<{ answers: Record<string, string> }>()
  const [quizResults, setQuizResults] = React.useState<{ score: number, total: number } | null>(null)

  // For this mock, we assume the logged-in student is the first one in the list.
  const currentStudent = mockStudents[0];

  React.useEffect(() => {
    if (typeof window !== 'undefined' && course) {
      const storedAssignments = localStorage.getItem(`assignments-${course.id}`);
      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));

      const storedChallenges = localStorage.getItem(`challenges-${course.id}`);
      if (storedChallenges) setChallenges(JSON.parse(storedChallenges));
      
      const storedPrizes = localStorage.getItem(`prizes-${course.id}`);
      if (storedPrizes) setPrizes(JSON.parse(storedPrizes));

      const storedCompletedChallenges = localStorage.getItem(`completedChallenges-${course.id}`);
      if (storedCompletedChallenges) setCompletedChallenges(new Set(JSON.parse(storedCompletedChallenges)));

      const storedCompletedAssignments = localStorage.getItem(`completedAssignments-${course.id}`);
      if (storedCompletedAssignments) setCompletedAssignments(new Set(JSON.parse(storedCompletedAssignments)));

      const storedClaimedPrizes = localStorage.getItem(`claimedPrizes-${course.id}-${currentStudent.id}`);
      if (storedClaimedPrizes) setClaimedPrizes(new Set(JSON.parse(storedClaimedPrizes)));
    }
  }, [course?.id, currentStudent.id]);

  const handleChallengeComplete = (challengeId: string) => {
    const updatedCompleted = new Set(completedChallenges).add(challengeId);
    setCompletedChallenges(updatedCompleted);
     if (course) {
      localStorage.setItem(`completedChallenges-${course.id}`, JSON.stringify(Array.from(updatedCompleted)));
    }
  };

  const handleAssignmentComplete = (assignmentId: string) => {
    const updatedCompleted = new Set(completedAssignments).add(assignmentId);
    setCompletedAssignments(updatedCompleted);
    if (course) {
      localStorage.setItem(`completedAssignments-${course.id}`, JSON.stringify(Array.from(updatedCompleted)));
    }
    setViewingAssignment(null);
    setQuizResults(null);
    quizForm.reset();
    setAssignmentSubmission("");
  };
  
  const handleClaimPrize = (prizeId: string) => {
    const updatedClaimed = new Set(claimedPrizes).add(prizeId);
    setClaimedPrizes(updatedClaimed);
    if (course) {
      localStorage.setItem(`claimedPrizes-${course.id}-${currentStudent.id}`, JSON.stringify(Array.from(updatedClaimed)));
    }
  };

  const handleOpenAssignment = (assignment: Assignment) => {
    setQuizResults(null);
    quizForm.reset();
    setAssignmentSubmission("");
    setViewingAssignment(assignment);
  }

  const onQuizSubmit = (data: { answers: Record<string, string> }) => {
    if (!viewingAssignment || !viewingAssignment.questions) return;
    let score = 0;
    viewingAssignment.questions.forEach((q, index) => {
      const userAnswerIndex = parseInt(data.answers[String(index)], 10);
      if (userAnswerIndex === q.correctAnswerIndex) {
        score++;
      }
    });
    setQuizResults({ score, total: viewingAssignment.questions.length });
  };

  if (!course) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Curso no encontrado.</p>
        </div>
    )
  }
  
  const courseMaterialForBot = `
  Curso: ${course.title}
  Descripción: ${course.description}
  Materiales:
  - Capítulo 1: Introducción a la IA.pdf
  - Capítulo 2: Fundamentos de Machine Learning.pdf
  `;

  return (
    <div className="p-4 md:p-8">
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="prizes">Premios</TabsTrigger>
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="leaderboard">Clasificación</TabsTrigger>
        </TabsList>
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materiales del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-md border gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary" />
                    <span>Capítulo 1: Introducción a la IA.pdf</span>
                  </div>
                  <Button variant="outline" size="sm">Descargar</Button>
                </li>
                <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-md border gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary" />
                    <span>Capítulo 2: Fundamentos de Machine Learning.pdf</span>
                  </div>
                  <Button variant="outline" size="sm">Descargar</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
             <CardHeader>
                <CardTitle>Tareas Pendientes</CardTitle>
                <CardDescription>Completa las siguientes tareas para avanzar en el curso.</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <ul className="space-y-3">
                    {assignments.map(assignment => (
                      <li key={assignment.id} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          {assignmentIcons[assignment.type]}
                          <div className="flex flex-col">
                            <span className="font-semibold">{assignment.title}</span>
                             <span className="text-sm text-muted-foreground capitalize">{assignment.type}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenAssignment(assignment)}
                          disabled={completedAssignments.has(assignment.id)}
                        >
                          {completedAssignments.has(assignment.id) 
                            ? <><CheckCircle2 className="mr-2 h-4 w-4"/>Realizada</>
                            : 'Realizar Tarea'}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>¡Felicidades! No tienes tareas pendientes por ahora.</p>
                  </div>
                )}
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
            <Card>
                <CardHeader>
                    <CardTitle>Desafíos Disponibles</CardTitle>
                    <CardDescription>¡Completa desafíos para ganar puntos y subir en la clasificación!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.map(challenge => (
                                <Card key={challenge.id} className="flex flex-col justify-between">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {challengeIcons[challenge.type]} {challenge.title}
                                        </CardTitle>
                                        <CardDescription>{challenge.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">Tema: <span className="font-semibold">{challenge.topic}</span></p>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between">
                                        <p className="font-bold text-yellow-500 text-lg">+{challenge.points} Puntos</p>
                                        {completedChallenges.has(challenge.id) ? (
                                            <Button size="sm" variant="outline" disabled>
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                                Completado
                                            </Button>
                                        ) : (
                                            challenge.type === 'quiz' ? (
                                                <QuizChallengeModal 
                                                  challenge={challenge} 
                                                  onChallengeComplete={() => handleChallengeComplete(challenge.id)}
                                                >
                                                    <Button size="sm">Iniciar Desafío</Button>
                                                </QuizChallengeModal>
                                            ) : (
                                                <SubmissionChallengeModal
                                                    challenge={challenge}
                                                    onChallengeComplete={() => handleChallengeComplete(challenge.id)}
                                                >
                                                    <Button size="sm">Iniciar Desafío</Button>
                                                </SubmissionChallengeModal>
                                            )
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Tu profesor aún no ha publicado ningún desafío. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="prizes">
            <Card>
                <CardHeader>
                    <CardTitle>Premios Disponibles</CardTitle>
                    <CardDescription>¡Canjea tus puntos por increíbles recompensas!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {prizes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {prizes
                                .filter(prize => prize.target === 'course' || prize.studentId === currentStudent.id)
                                .map(prize => {
                                    const canClaim = currentStudent.points >= prize.pointsRequired;
                                    const isClaimed = claimedPrizes.has(prize.id);
                                    
                                    return (
                                        <Card key={prize.id} className="flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-xl flex items-center gap-2">
                                                    <Gift className="text-primary" /> {prize.title}
                                                </CardTitle>
                                                <CardDescription>{prize.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <p className="text-lg font-bold text-yellow-500">{prize.pointsRequired.toLocaleString()} Puntos</p>
                                            </CardContent>
                                            <CardFooter>
                                                <Button 
                                                    className="w-full"
                                                    onClick={() => handleClaimPrize(prize.id)}
                                                    disabled={!canClaim || isClaimed}
                                                >
                                                    {isClaimed ? <><CheckCircle className="mr-2"/>Reclamado</> : 
                                                     !canClaim ? <><Lock className="mr-2"/>Insuficiente</> : 'Reclamar Premio'}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Tu profesor aún no ha publicado ningún premio. ¡Sigue acumulando puntos!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!viewingAssignment} onOpenChange={(open) => !open && setViewingAssignment(null)}>
        <DialogContent className="sm:max-w-2xl">
          {viewingAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{viewingAssignment.title}</DialogTitle>
                <DialogDescription>{viewingAssignment.content}</DialogDescription>
              </DialogHeader>
              
              {viewingAssignment.type === 'quiz' && viewingAssignment.questions && (
                quizResults ? (
                  <div className="py-4">
                    <Alert variant={quizResults.score === quizResults.total ? "default" : "destructive"}>
                      <AlertTitle>¡Resultados del Cuestionario!</AlertTitle>
                      <AlertDescription>
                        Obtuviste {quizResults.score} de {quizResults.total} respuestas correctas.
                      </AlertDescription>
                    </Alert>
                    <DialogFooter className="mt-4">
                      <Button variant="secondary" onClick={() => handleAssignmentComplete(viewingAssignment!.id)}>
                        Cerrar
                      </Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <Form {...quizForm}>
                    <form onSubmit={quizForm.handleSubmit(onQuizSubmit)} className="space-y-6 py-4">
                      <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-6">
                        {viewingAssignment.questions.map((q, index) => (
                           <FormField
                            key={index}
                            control={quizForm.control}
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
              )}

              {viewingAssignment.type === 'assignment' && (
                <div className="py-4 space-y-4">
                    <Textarea 
                      placeholder="Escribe tu respuesta aquí..." 
                      rows={10}
                      value={assignmentSubmission}
                      onChange={(e) => setAssignmentSubmission(e.target.value)}
                    />
                    <DialogFooter>
                        <Button onClick={() => handleAssignmentComplete(viewingAssignment.id)} disabled={!assignmentSubmission}>
                            <Send className="mr-2 h-4 w-4"/> Enviar Tarea
                        </Button>
                    </DialogFooter>
                </div>
              )}

              {viewingAssignment.type === 'survey' && (
                <div className="py-4 space-y-4">
                     <p className="text-sm text-muted-foreground">Responde las siguientes preguntas:</p>
                     <Textarea 
                       placeholder="Tus comentarios son importantes..." 
                       rows={10}
                       value={assignmentSubmission}
                       onChange={(e) => setAssignmentSubmission(e.target.value)}
                     />
                    <DialogFooter>
                        <Button onClick={() => handleAssignmentComplete(viewingAssignment.id)} disabled={!assignmentSubmission}>
                            Enviar Encuesta
                        </Button>
                    </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>


      <Chatbot courseMaterial={courseMaterialForBot} />
    </div>
  )
}
