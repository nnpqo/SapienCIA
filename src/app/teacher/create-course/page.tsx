import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateCoursePage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link href="/teacher/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
        </Link>
        <h1 className="text-4xl font-headline font-bold">Create a New Course</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Course Details</CardTitle>
          <CardDescription>Fill in the details for your new course. A unique join code will be generated automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" placeholder="e.g., Advanced Mathematics" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea id="description" placeholder="A brief description of the course content and objectives." />
          </div>
           <div className="space-y-2">
            <Label htmlFor="image">Course Image</Label>
            <Input id="image" type="file" />
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/teacher/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Link href="/teacher/dashboard">
                <Button>Create Course</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
