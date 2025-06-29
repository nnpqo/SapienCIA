import { Header } from "@/components/header";
import { mockStudents } from "@/lib/mock-data";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  // En una app real, esto vendría de un contexto de autenticación
  const student = mockStudents[0]; 

  const user = {
    name: student.name,
    email: 'estudiante@ejemplo.com',
    avatarUrl: student.avatarUrl,
    points: student.points,
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header user={user} role="student" />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  )
}
