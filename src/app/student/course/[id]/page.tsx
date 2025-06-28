"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses } from "@/lib/mock-data"
import { FileText, Award as AwardIcon, CheckCircle2 } from "lucide-react"
import { Chatbot } from "@/components/chatbot"
import { QuizChallengeModal } from "@/components/quiz-challenge-modal"

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)

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
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground font-body mt-2">{course.description}</p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
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
                <CardTitle>Tareas</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-10">
                <p>Aún no se han publicado tareas. ¡Vuelve pronto!</p>
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
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> El Explorador</h3>
                          <p className="text-sm text-muted-foreground">Completa los dos primeros capítulos.</p>
                      </div>
                      <div className="text-right shrink-0">
                          <p className="font-bold text-primary">+100 Puntos</p>
                          <Button size="sm" className="mt-1" variant="outline" disabled>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            Reclamado
                          </Button>
                      </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> Genio del Cuestionario</h3>
                          <p className="text-sm text-muted-foreground">Obtén 80% o más en el cuestionario de IA.</p>
                      </div>
                       <div className="text-right shrink-0">
                          <p className="font-bold text-primary">+150 Puntos</p>
                          <QuizChallengeModal topic={course.title}>
                             <Button size="sm" className="mt-1">Iniciar Desafío</Button>
                          </QuizChallengeModal>
                      </div>
                  </div>
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>

      <Chatbot courseMaterial={courseMaterialForBot} />
    </div>
  )
}
