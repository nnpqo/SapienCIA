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
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="teacher">Teacher</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Student Login</CardTitle>
            <CardDescription className="font-body">Access your courses and learning tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-email" className="font-body">Email</Label>
              <Input id="student-email" type="email" placeholder="student@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-password">Password</Label>
              <Input id="student-password" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/student/dashboard" className="w-full">
              <Button className="w-full font-headline">Login</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground font-body">
              Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="teacher">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Teacher Login</CardTitle>
            <CardDescription className="font-body">Manage your courses and students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-email">Email</Label>
              <Input id="teacher-email" type="email" placeholder="teacher@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-password">Password</Label>
              <Input id="teacher-password" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/teacher/dashboard" className="w-full">
                <Button className="w-full font-headline">Login</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground font-body">
              Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
