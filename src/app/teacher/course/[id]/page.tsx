"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses, mockStudents, type Assignment } from "@/lib/mock-data"
import { FileText, PlusCircle, User, Award as AwardIcon, Trash2, HelpCircle, ClipboardCheck, ListTodo } from "lucide-react"
import { AIContentGenerator } from "@/components/ai-content-generator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const assignmentIcons = {
  quiz: <HelpCircle className="h-5 w-5 text-primary" />,
  survey: <ListTodo className="h-5 w-5 text-primary" />,
  assignment: <ClipboardCheck className="h-5 w-5 text-primary" />,
}

export default function TeacherCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && course) {
      const storedAssignments = localStorage.getItem(`assignments-${course.id}`);
      if (storedAssignments) {
        setAssignments(JSON.parse(storedAssignments));
      }
    }
  }, [course?.id]);

  const handlePublish = (newAssignmentData: Omit<Assignment, 'id'>) => {
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

  const handleDeleteAssignment = (assignmentId: string) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    if (course) {
      localStorage.setItem(`assignments-${course.id}`, JSON.stringify(updatedAssignments));
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

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
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
                <AIContentGenerator courseName={course.title} onPublish={handlePublish} />
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
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.id)}>
                          <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </li>
                    ))}
                  </ul>
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
                    <CardTitle>Desafíos</CardTitle>
                    <CardDescription>Crea desafíos gamificados para tus estudiantes.</CardDescription>
                  </div>
                  <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Crear Desafío</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> El Explorador</h3>
                          <p className="text-sm text-muted-foreground">Completa los dos primeros capítulos.</p>
                      </div>
                      <p className="font-bold text-primary shrink-0">+100 Puntos</p>
                  </div>
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
    </div>
  )
}
