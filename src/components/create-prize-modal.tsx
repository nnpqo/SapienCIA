"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import type { Prize } from "@/lib/mock-data"
import { mockStudents } from "@/lib/mock-data"

interface CreatePrizeModalProps {
  courseId: string
  onPublish: (prize: Omit<Prize, 'id'>) => void
}

type FormData = {
  title: string;
  description: string;
  pointsRequired: number;
  target: 'course' | 'student';
  studentId?: string;
};

export function CreatePrizeModal({ courseId, onPublish }: CreatePrizeModalProps) {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit, register, formState: { errors }, watch, reset } = useForm<FormData>({
    defaultValues: {
      target: 'course',
      pointsRequired: 1000,
      title: "",
      description: "",
      studentId: undefined,
    }
  });

  const targetValue = watch('target');

  const onSubmit = (data: FormData) => {
    onPublish({
      courseId,
      ...data,
      pointsRequired: Number(data.pointsRequired) // Ensure it's a number
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Crear Premio</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Crear un Nuevo Premio</DialogTitle>
          <DialogDescription>Define una recompensa para los estudiantes que alcancen una meta de puntos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Nombre del Premio</Label>
            <Input id="title" {...register("title", { required: "El nombre es obligatorio" })} placeholder="Ej: Certificado de Excelencia" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe qué ganará el estudiante." />
          </div>
          <div>
            <Label htmlFor="pointsRequired">Puntos Requeridos</Label>
            <Input id="pointsRequired" type="number" {...register("pointsRequired", { required: "Los puntos son obligatorios", valueAsNumber: true, min: 1 })} />
            {errors.pointsRequired && <p className="text-sm text-destructive mt-1">{errors.pointsRequired.message}</p>}
          </div>
          <div>
            <Label>Dirigido a</Label>
            <Controller
              name="target"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="course" id="r1" />
                    <Label htmlFor="r1">Todo el curso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="r2" />
                    <Label htmlFor="r2">Estudiante específico</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          {targetValue === 'student' && (
            <div>
              <Label>Seleccionar Estudiante</Label>
              <Controller
                name="studentId"
                control={control}
                rules={{ required: "Debes seleccionar un estudiante" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un estudiante" /></SelectTrigger>
                    <SelectContent>
                      {mockStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.studentId && <p className="text-sm text-destructive mt-1">{errors.studentId.message}</p>}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Crear Premio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}