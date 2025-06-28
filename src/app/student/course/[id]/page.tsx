"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaderboard } from "@/components/leaderboard"
import { mockCourses } from "@/lib/mock-data"
import { FileText, Award as AwardIcon } from "lucide-react"
import { Chatbot } from "@/components/chatbot"

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  const course = mockCourses.find(c => c.id === resolvedParams.id)

  if (!course) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Course not found.</p>
        </div>
    )
  }
  
  const courseMaterialForBot = `
  Course: ${course.title}
  Description: ${course.description}
  Materials:
  - Chapter 1: Introduction to AI.pdf
  - Chapter 2: Machine Learning Basics.pdf
  `;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground font-body mt-2">{course.description}</p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-md border gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary" />
                    <span>Chapter 1: Introduction to AI.pdf</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-md border gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary" />
                    <span>Chapter 2: Machine Learning Basics.pdf</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
             <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-10">
                <p>No assignments posted yet. Check back soon!</p>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
            <Card>
              <CardHeader>
                  <CardTitle>Available Challenges</CardTitle>
                  <CardDescription>Complete challenges to earn points and climb the leaderboard!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> The Explorer</h3>
                          <p className="text-sm text-muted-foreground">Complete the first two chapters.</p>
                      </div>
                      <div className="text-right shrink-0">
                          <p className="font-bold text-primary">+100 Points</p>
                          <Button size="sm" className="mt-1">Claim Reward</Button>
                      </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4">
                      <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg"><AwardIcon className="text-primary"/> Quiz Whiz</h3>
                          <p className="text-sm text-muted-foreground">Score 90% or higher on the first quiz.</p>
                      </div>
                       <div className="text-right shrink-0">
                          <p className="font-bold text-primary">+150 Points</p>
                          <Button size="sm" className="mt-1" variant="outline" disabled>Complete Quiz</Button>
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
