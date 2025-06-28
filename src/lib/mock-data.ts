export interface Course {
  id: string;
  title: string;
  description: string;
  teacher: string;
  code: string;
  imageUrl: string;
  aiHint: string;
}

export interface Student {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
}

export const mockCourses: Course[] = [
  { id: '1', title: 'Introduction to AI', description: 'Learn the fundamentals of Artificial Intelligence and its applications in the modern world.', teacher: 'Dr. Alan Turing', code: 'AI101-WINTER', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'artificial intelligence' },
  { id: '2', title: 'Modern Web Development', description: 'Master React, Next.js, and Tailwind CSS to build beautiful, fast, and modern web applications.', teacher: 'Dr. Ada Lovelace', code: 'WEB202-FALL', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'web development' },
  { id: '3', title: 'Data Structures & Algorithms', description: 'A deep dive into fundamental computer science concepts, preparing you for technical interviews.', teacher: 'Dr. Grace Hopper', code: 'CS303-SPRING', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'data structures' },
];

export const mockStudents: Student[] = [
    { id: '4', name: 'Diana', points: 1300, avatarUrl: 'https://placehold.co/40x40.png?text=D' },
    { id: '1', name: 'Alice', points: 1250, avatarUrl: 'https://placehold.co/40x40.png?text=A' },
    { id: '2', name: 'Bob', points: 1100, avatarUrl: 'https://placehold.co/40x40.png?text=B' },
    { id: '3', name: 'Charlie', points: 950, avatarUrl: 'https://placehold.co/40x40.png?text=C' },
    { id: '5', name: 'Eve', points: 800, avatarUrl: 'https://placehold.co/40x40.png?text=E' },
].sort((a, b) => b.points - a.points);
