'use server';
/**
 * @fileOverview Generador de desafíos de cuestionario para estudiantes.
 *
 * - generateQuizChallenge - Una función que genera un cuestionario sobre un tema específico.
 * - GenerateQuizChallengeInput - El tipo de entrada para la función generateQuizChallenge.
 * - GenerateQuizChallengeOutput - El tipo de retorno para la función generateQuizChallenge.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizChallengeInputSchema = z.object({
  topic: z.string().describe('El tema específico para el cuestionario.'),
});
export type GenerateQuizChallengeInput = z.infer<typeof GenerateQuizChallengeInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe('La pregunta del cuestionario.'),
    options: z.array(z.string()).describe('Una lista de 4 posibles respuestas.'),
    correctAnswerIndex: z.number().describe('El índice de la respuesta correcta en el array de opciones (0-3).'),
    explanation: z.string().describe('Una breve explicación de por qué la respuesta es correcta.')
});

const GenerateQuizChallengeOutputSchema = z.object({
  title: z.string().describe('Un título creativo y relevante para el cuestionario.'),
  questions: z.array(QuestionSchema).describe('Una lista de 5 preguntas para el cuestionario.'),
});
export type GenerateQuizChallengeOutput = z.infer<typeof GenerateQuizChallengeOutputSchema>;

export async function generateQuizChallenge(input: GenerateQuizChallengeInput): Promise<GenerateQuizChallengeOutput> {
  return generateQuizChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizChallengePrompt',
  input: {schema: GenerateQuizChallengeInputSchema},
  output: {schema: GenerateQuizChallengeOutputSchema},
  prompt: `Eres un asistente de IA experto en crear contenido educativo para estudiantes en Bolivia. Tu tarea es generar un desafío de cuestionario corto y divertido.

  Tema: {{{topic}}}

  Por favor, genera un cuestionario con las siguientes características:
  1.  Un título creativo para el cuestionario.
  2.  Exactamente 5 preguntas de opción múltiple relacionadas con el tema.
  3.  Cada pregunta debe tener exactamente 4 opciones de respuesta.
  4.  Indica el índice de la respuesta correcta (de 0 a 3).
  5.  Proporciona una breve explicación para la respuesta correcta.
  6.  El tono debe ser alentador y educativo, adecuado para estudiantes.
  7.  El idioma debe ser español de Bolivia.
  `,
});

const generateQuizChallengeFlow = ai.defineFlow(
  {
    name: 'generateQuizChallengeFlow',
    inputSchema: GenerateQuizChallengeInputSchema,
    outputSchema: GenerateQuizChallengeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
