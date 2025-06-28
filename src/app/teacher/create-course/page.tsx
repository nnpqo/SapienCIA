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
            Volver al Panel
        </Link>
        <h1 className="text-4xl font-headline font-bold">Crear un Nuevo Curso</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Detalles del Curso</CardTitle>
          <CardDescription>Completa los detalles para tu nuevo curso. Se generará un código de acceso único automáticamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Curso</Label>
            <Input id="title" placeholder="Ej: Matemática Avanzada" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Curso</Label>
            <Textarea id="description" placeholder="Una breve descripción del contenido y los objetivos del curso." />
          </div>
           <div className="space-y-2">
            <Label htmlFor="image">Imagen del Curso</Label>
            <Input id="image" type="file" />
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/teacher/dashboard">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Link href="/teacher/dashboard">
                <Button>Crear Curso</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
