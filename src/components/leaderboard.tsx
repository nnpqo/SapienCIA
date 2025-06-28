import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/mock-data"
import { Award, Medal, Trophy } from "lucide-react"

export function Leaderboard() {
  const students: Student[] = mockStudents;

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="text-yellow-500 w-6 h-6" />;
    if (rank === 1) return <Medal className="text-gray-400 w-6 h-6" />;
    if (rank === 2) return <Award className="text-yellow-700 w-6 h-6" />;
    return <span className="text-muted-foreground font-bold text-lg">{rank + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {students.map((student, index) => (
            <li key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-colors hover:bg-secondary">
              <div className="flex items-center gap-4">
                <div className="w-8 text-center flex justify-center">{getRankIcon(index)}</div>
                <Avatar>
                  <AvatarImage src={student.avatarUrl} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold font-body text-base">{student.name}</span>
              </div>
              <span className="font-bold text-primary text-lg">{student.points.toLocaleString()} pts</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
