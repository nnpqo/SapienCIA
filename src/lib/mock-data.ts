export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'survey' | 'assignment';
  content: string; // Description for quiz, content for others
  questions?: Question[];
}

export interface Challenge {
  id: string;
  title: string;
  type: 'quiz';
  description: string;
  points: number;
  topic: string; // The topic for the AI to generate questions
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacher: string;
  code: string;
  imageUrl: string;
  aiHint: string;
  assignments: Assignment[];
}

export interface Student {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
}

export const mockCourses: Course[] = [
  { id: '1', title: 'Introducción a la IA', description: 'Aprende los fundamentos de la Inteligencia Artificial y sus aplicaciones en el mundo moderno.', teacher: 'Prof. Ana Torres', code: 'AI101-INV24', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'inteligencia artificial', assignments: [] },
  { id: '2', title: 'Desarrollo Web Moderno', description: 'Domina React, Next.js y Tailwind CSS para construir aplicaciones web hermosas, rápidas y modernas.', teacher: 'Prof. Carlos Vega', code: 'WEB202-OTO24', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'desarrollo web', assignments: [] },
  { id: '3', title: 'Estructuras de Datos y Algoritmos', description: 'Un profundo análisis de los conceptos fundamentales de la informática, preparándote para entrevistas técnicas.', teacher: 'Prof. Isabel Rojas', code: 'CS303-PRI24', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'estructuras datos', assignments: [] },
];

export const mockStudents: Student[] = [
    { id: '4', name: 'Diana', points: 1300, avatarUrl: 'https://placehold.co/40x40.png?text=D' },
    { id: '1', name: 'Andrés', points: 1250, avatarUrl: 'https://placehold.co/40x40.png?text=A' },
    { id: '2', name: 'Beatriz', points: 1100, avatarUrl: 'https://placehold.co/40x40.png?text=B' },
    { id: '3', name: 'Carlos', points: 950, avatarUrl: 'https://placehold.co/40x40.png?text=C' },
    { id: '5', name: 'Elena', points: 800, avatarUrl: 'https://placehold.co/40x40.png?text=E' },
].sort((a, b) => b.points - a.points);
