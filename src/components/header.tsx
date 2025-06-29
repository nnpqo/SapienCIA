import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Trophy } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    points?: number;
  }
  role: 'student' | 'teacher';
}

export function Header({ user, role }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-3 text-foreground no-underline">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold">Studia</h1>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {role === 'student' && typeof user.points === 'number' && (
            <div className="flex items-center gap-2 p-2 rounded-full bg-secondary">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="font-bold text-lg">{user.points.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground font-body hidden sm:inline">puntos</span>
            </div>
          )}
           <div className="flex items-center gap-3">
              <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={`Avatar de ${user.name}`} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
          </div>
          <Link href="/">
            <Button variant="outline">
              <LogOut className="md:mr-2" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
