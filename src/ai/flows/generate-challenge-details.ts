'use server';
/**
 * @fileOverview Generador de detalles de desafíos gamificados.
 *
 * - generateChallengeDetails - Una función que crea un título, descripción y puntos para un desafío.
 * - GenerateChallengeDetailsInput - El tipo de entrada para la función.
 * - GenerateChallengeDetailsOutput - El tipo de retorno para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChallengeDetailsInputSchema = z.object({
  topic: z.string().describe('El tema para el desafío.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('El nivel de dificultad del desafío.'),
});
export type GenerateChallengeDetailsInput = z.infer<typeof GenerateChallengeDetailsInputSchema>;

const GenerateChallengeDetailsOutputSchema = z.object({
  title: z.string().describe('Un título creativo y corto para el desafío.'),
  description: z.string().describe('Una descripción breve y motivadora del desafío.'),
  points: z.number().describe('La cantidad de puntos que otorga el desafío (fácil: 50-100, medio: 101-200, difícil: 201-300).'),
});
export type GenerateChallengeDetailsOutput = z.infer<typeof GenerateChallengeDetailsOutputSchema>;

export async function generateChallengeDetails(input: GenerateChallengeDetailsInput): Promise<GenerateChallengeDetailsOutput> {
  return generateChallengeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChallengeDetailsPrompt',
  input: {schema: GenerateChallengeDetailsInputSchema},
  output: {schema: GenerateChallengeDetailsOutputSchema},
  prompt: `Eres un experto en gamificación y diseño de contenido educativo para estudiantes en Bolivia. Tu tarea es crear los detalles para un desafío divertido.

  Tema: {{{topic}}}
  Dificultad: {{{difficulty}}}

  Por favor, genera los siguientes detalles para el desafío:
  1.  Un título creativo, enérgico y corto (máximo 5 palabras).
  2.  Una descripción breve (1-2 frases) que motive al estudiante a participar.
  3.  Asigna una cantidad de puntos basada en la dificultad:
      - fácil: un valor entre 50 y 100.
      - medio: un valor entre 101 y 200.
      - difícil: un valor entre 201 y 300.
  4.  El tono debe ser alentador y emocionante.
  5.  Responde siempre en español.
  `,
});

const generateChallengeDetailsFlow = ai.defineFlow(
  {
    name: 'generateChallengeDetailsFlow',
    inputSchema: GenerateChallengeDetailsInputSchema,
    outputSchema: GenerateChallengeDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
