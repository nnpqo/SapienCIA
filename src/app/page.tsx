import { AuthForm } from '@/components/auth-form';
import { BookOpenCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-8">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-headline font-bold text-primary flex items-center justify-center gap-2">
            <BookOpenCheck className="w-12 h-12" />
            CampusConnect
          </h1>
          <p className="text-muted-foreground mt-2 font-body">Your AI-powered learning companion.</p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
