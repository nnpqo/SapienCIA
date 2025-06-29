import { Header } from "@/components/header";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  // En una app real, esto vendría de un contexto de autenticación
  const user = {
    name: 'Profesor/a',
    email: 'profesor@ejemplo.com',
    avatarUrl: 'https://placehold.co/40x40.png?text=P',
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header user={user} role="teacher" />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  )
}
