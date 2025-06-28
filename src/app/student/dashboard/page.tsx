"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CourseCard } from "@/components/course-card"
import type { Course } from "@/lib/mock-data"
import { mockCourses } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function StudentDashboard() {
  const courses: Course[] = mockCourses.slice(0, 2);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Ready to learn something new?</p>
      </div>

      <Card className="mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle className="font-headline">Join a New Course</CardTitle>
          <CardDescription>Enter the code from your teacher to enroll in a new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Enter course code" className="max-w-xs" />
            <Button type="submit">Join Course</Button>
          </form>
        </CardContent>
      </Card>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-3xl font-headline font-bold mb-6">My Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} userRole="student" />
          ))}
        </div>
      </div>
    </div>
  )
}
