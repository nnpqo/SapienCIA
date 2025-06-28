import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { Course } from "@/lib/mock-data"

interface CourseCardProps {
  course: Course;
  userRole: 'student' | 'teacher';
}

export function CourseCard({ course, userRole }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image src={course.imageUrl} alt={course.title} fill className="object-cover" data-ai-hint={course.aiHint} />
      </div>
      <CardHeader className="p-6">
        <CardTitle className="font-headline text-xl">{course.title}</CardTitle>
        <p className="text-sm text-muted-foreground pt-2">Taught by {course.teacher}</p>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow">
        <CardDescription className="font-body">{course.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto bg-card">
        <Link href={`/${userRole}/course/${course.id}`} className="w-full">
          <Button className="w-full font-headline">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
