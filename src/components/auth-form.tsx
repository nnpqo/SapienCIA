"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthForm() {
  return (
    <Tabs defaultValue="student" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student">Estudiante</TabsTrigger>
        <TabsTrigger value="teacher">Profesor</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Acceso Estudiante</CardTitle>
            <CardDescription className="font-body">Accede a tus cursos y herramientas de aprendizaje.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-email" className="font-body">Correo Electrónico</Label>
              <Input id="student-email" type="email" placeholder="estudiante@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-password">Contraseña</Label>
              <Input id="student-password" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/student/dashboard" className="w-full">
              <Button className="w-full font-headline">Ingresar</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground font-body">
              ¿No tienes una cuenta? <a href="#" className="text-primary hover:underline">Regístrate</a>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="teacher">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Acceso Profesor</CardTitle>
            <CardDescription className="font-body">Gestiona tus cursos y estudiantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-email">Correo Electrónico</Label>
              <Input id="teacher-email" type="email" placeholder="profesor@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-password">Contraseña</Label>
              <Input id="teacher-password" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/teacher/dashboard" className="w-full">
                <Button className="w-full font-headline">Ingresar</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground font-body">
              ¿No tienes una cuenta? <a href="#" className="text-primary hover:underline">Regístrate</a>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
