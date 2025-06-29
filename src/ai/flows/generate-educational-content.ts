// src/ai/flows/generate-educational-content.ts
'use server';

/**
 * @fileOverview Generador de contenido educativo para profesores, impulsado por IA.
 *
 * - generateEducationalContent - Una función que toma detalles del curso y tipo de contenido para generar materiales educativos.
 * - GenerateEducationalContentInput - El tipo de entrada para la función generateEducationalContent.
 * - GenerateEducationalContentOutput - El tipo de retorno para la función generateEducationalContent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEducationalContentInputSchema = z.object({
  courseName: z.string().describe('El nombre del curso.'),
  topic: z.string().describe('El tema específico para el contenido educativo.'),
  contentType: z.enum(['quiz', 'survey', 'assignment']).describe('El tipo de contenido educativo a generar (cuestionario, encuesta, tarea).'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional().describe('El nivel de dificultad del contenido (fácil, medio, difícil).'),
  length: z.string().optional().describe('Longitud deseada o número de preguntas/tareas.'),
  additionalInstructions: z.string().optional().describe('Cualquier instrucción adicional para la generación de contenido.'),
});

export type GenerateEducationalContentInput = z.infer<typeof GenerateEducationalContentInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe('La pregunta del cuestionario.'),
    options: z.array(z.string()).describe('Una lista de posibles respuestas.'),
    correctAnswerIndex: z.number().describe('El índice de la respuesta correcta en el array de opciones.'),
    explanation: z.string().describe('Una breve explicación de por qué la respuesta es correcta.')
});

const GenerateEducationalContentOutputSchema = z.object({
  title: z.string().describe('El título del contenido educativo generado.'),
  contentType: z.enum(['quiz', 'survey', 'assignment']).describe('El tipo de contenido generado.'),
  content: z.string().describe('El contenido para una tarea o encuesta, o una descripción general si es un cuestionario.'),
  questions: z.array(QuestionSchema).optional().describe('Una lista de preguntas si el tipo de contenido es "quiz".'),
});

export type GenerateEducationalContentOutput = z.infer<typeof GenerateEducationalContentOutputSchema>;

export async function generateEducationalContent(input: GenerateEducationalContentInput): Promise<GenerateEducationalContentOutput> {
  return generateEducationalContentFlow(input);
}

const generateEducationalContentPrompt = ai.definePrompt({
  name: 'generateEducationalContentPrompt',
  input: {schema: GenerateEducationalContentInputSchema},
  output: {schema: GenerateEducationalContentOutputSchema},
  prompt: `Eres un asistente de IA diseñado para ayudar a profesores de Bolivia a generar contenido educativo.

  Basándote en el nombre del curso, el tema, el tipo de contenido y el nivel de dificultad, crea materiales de aprendizaje atractivos y efectivos. Utiliza un lenguaje y ejemplos que resuenen con estudiantes en Bolivia.

  Nombre del Curso: {{{courseName}}}
  Tema: {{{topic}}}
  Tipo de Contenido: {{{contentType}}}
  Nivel de Dificultad: {{{difficultyLevel}}}
  Longitud: {{{length}}}
  Instrucciones Adicionales: {{{additionalInstructions}}}

  Genera el contenido educativo.
  - Si el tipo de contenido es 'quiz', genera una lista de preguntas. Cada pregunta debe tener opciones de respuesta, el índice de la respuesta correcta y una explicación. El campo 'content' debe ser una breve descripción del cuestionario.
  - Si es 'assignment' o 'survey', genera un texto detallado para el campo 'content'.
  - Responde siempre en español.
  - Asegúrate de que el contenido sea pedagógicamente sólido y se alinee con el nivel de dificultad especificado.
  - Devuelve el título, el tipo de contenido y el contenido mismo en el formato de salida requerido.
  `,
});

const generateEducationalContentFlow = ai.defineFlow(
  {
    name: 'generateEducationalContentFlow',
    inputSchema: GenerateEducationalContentInputSchema,
    outputSchema: GenerateEducationalContentOutputSchema,
  },
  async input => {
    const {output} = await generateEducationalContentPrompt(input);
    return output!;
  }
);
