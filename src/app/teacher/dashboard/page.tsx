import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import type { Course } from "@/lib/mock-data"
import { mockCourses } from "@/lib/mock-data"

export default function TeacherDashboard() {
  const courses: Course[] = mockCourses;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-headline font-bold">Mi Panel</h1>
            <p className="text-muted-foreground mt-2">Aquí están los cursos que has creado.</p>
        </div>
        <Link href="/teacher/create-course">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Curso
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CourseCard course={course} userRole="teacher" />
          </div>
        ))}
      </div>
    </div>
  )
}
