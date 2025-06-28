"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses, mockStudents } from "@/lib/mock-data"
import { FileText, PlusCircle, Upload, User, Award as AwardIcon, Trash2 } from "lucide-react"
import { AIContentGenerator } from "@/components/ai-content-generator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TeacherCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)

  if (!course) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Course not found.</p>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground font-body mt-2">Course Code: <Badge variant="secondary" className="text-base font-mono">{course.code}</Badge></p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="content">AI Content</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>Upload and manage course files.</CardDescription>
              </div>
              <Button size="sm"><Upload className="mr-2 h-4 w-4"/> Upload Material</Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3"><FileText className="text-primary"/><span>Chapter 1: Introduction to AI.pdf</span></div>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </li>
                 <li className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3"><FileText className="text-primary"/><span>Chapter 2: Machine Learning Basics.pdf</span></div>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
             <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                  <CardTitle>AI Generated Content</CardTitle>
                  <CardDescription>Create quizzes, surveys, and assignments.</CardDescription>
                </div>
                <AIContentGenerator courseName={course.title} />
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-10">
                <p>No content generated yet. Use the AI assistant to get started.</p>
              </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="challenges">
            <Card>
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <CardTitle>Challenges</CardTitle>
                    <CardDescription>Create gamified challenges for your students.</CardDescription>
                  </div>
                  <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Create Challenge</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> The Explorer</h3>
                          <p className="text-sm text-muted-foreground">Complete the first two chapters.</p>
                      </div>
                      <p className="font-bold text-primary shrink-0">+100 Points</p>
                  </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>A list of all students currently enrolled in this course.</CardDescription>
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
