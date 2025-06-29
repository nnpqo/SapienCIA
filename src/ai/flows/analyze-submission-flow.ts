'use server';
/**
 * @fileOverview Analizador de entregas de imágenes de estudiantes con IA.
 *
 * - analyzeSubmission - Una función que evalúa una imagen enviada para un desafío.
 * - AnalyzeSubmissionInput - El tipo de entrada para la función.
 * - AnalyzeSubmissionOutput - El tipo de retorno para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeSubmissionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Una foto de la entrega del estudiante, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<datos_codificados>'."
    ),
  topic: z.string().describe('El tema del desafío.'),
  description: z.string().describe('La descripción de la tarea del desafío.'),
});
export type AnalyzeSubmissionInput = z.infer<typeof AnalyzeSubmissionInputSchema>;

export const AnalyzeSubmissionOutputSchema = z.object({
  isApproved: z.boolean().describe('Si la imagen es una entrega válida y relevante para el desafío.'),
  feedback: z.string().describe('Retroalimentación constructiva para el estudiante sobre su entrega.'),
});
export type AnalyzeSubmissionOutput = z.infer<typeof AnalyzeSubmissionOutputSchema>;


export async function analyzeSubmission(input: AnalyzeSubmissionInput): Promise<AnalyzeSubmissionOutput> {
  return analyzeSubmissionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSubmissionPrompt',
  input: {schema: AnalyzeSubmissionInputSchema},
  output: {schema: AnalyzeSubmissionOutputSchema},
  prompt: `Eres un asistente de profesor de IA en Bolivia, eres amable y alentador. Tu tarea es evaluar una imagen que un estudiante ha enviado para un desafío.

  Tema del Desafío: {{{topic}}}
  Descripción del Desafío: {{{description}}}

  Analiza la siguiente imagen: {{media url=photoDataUri}}

  Tu objetivo es determinar si la imagen es un intento válido y de buena fe para completar el desafío. No tiene que ser perfecto, pero debe ser relevante para el tema y la descripción.

  - Si la imagen es relevante y parece un esfuerzo genuino (por ejemplo, un mapa conceptual, un dibujo, un resumen escrito a mano relacionado con el tema), establece 'isApproved' en true. La retroalimentación debe ser positiva y breve. Ejemplo: "¡Excelente mapa conceptual! Se nota tu esfuerzo y dedicación. ¡Sigue así!"
  - Si la imagen es irrelevante (por ejemplo, una foto de un paisaje, una imagen en blanco, un meme, una foto aleatoria) o de muy baja calidad para ser evaluada, establece 'isApproved' en false. La retroalimentación debe ser constructiva y explicar por qué no fue aprobada, animando al estudiante a intentarlo de nuevo. Ejemplo: "Parece que esta imagen no está relacionada con el tema del desafío. ¡Asegúrate de subir una foto de tu mapa conceptual para ganar los puntos! ¡Tú puedes!"
  - Si la imagen está completamente en blanco o es negra, establece 'isApproved' en false e indica que la imagen parece estar vacía.
  - Sé justo y asume buenas intenciones, pero no apruebes envíos claramente irrelevantes.
  - Responde siempre en español.
  `,
});

const analyzeSubmissionFlow = ai.defineFlow(
  {
    name: 'analyzeSubmissionFlow',
    inputSchema: AnalyzeSubmissionInputSchema,
    outputSchema: AnalyzeSubmissionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
