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

const AnalyzeSubmissionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Una foto de la entrega del estudiante, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<datos_codificados>'."
    ),
  topic: z.string().describe('El tema del desafío.'),
  description: z.string().describe('La descripción de la tarea del desafío.'),
});
export type AnalyzeSubmissionInput = z.infer<typeof AnalyzeSubmissionInputSchema>;

const AnalyzeSubmissionOutputSchema = z.object({
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
  prompt: `Eres un asistente de profesor de IA en Bolivia. Eres amable, alentador y tu objetivo es ayudar a los estudiantes a mejorar. Tu tarea es proporcionar retroalimentación detallada y constructiva sobre una imagen que un estudiante ha enviado para un desafío.

  Tema del Desafío: {{{topic}}}
  Descripción del Desafío: {{{description}}}

  Analiza la siguiente imagen: {{media url=photoDataUri}}

  Tu objetivo es determinar si la imagen es un intento válido y relevante para completar el desafío.

  1.  **Analiza la relevancia y el esfuerzo:** ¿La imagen está relacionada con el tema y la descripción? ¿Parece un esfuerzo genuino?
  2.  **Genera la retroalimentación:**
      *   **Si la imagen es relevante y un buen intento (aprueba el trabajo, \`isApproved: true\`):**
          *   Comienza con un elogio sincero sobre lo que está bien hecho.
          *   Luego, ofrece **1 o 2 sugerencias específicas y prácticas para mejorar el trabajo**. No digas simplemente "podría ser mejor". Sé concreto.
          *   **Ejemplo:** "¡Excelente mapa conceptual, se nota tu dedicación! La estructura es muy clara. Para hacerlo aún más impactante, te sugiero dos cosas: 1. Usa colores diferentes para cada rama principal, así será más fácil de leer. 2. Añade un pequeño ícono o dibujo junto al concepto central para reforzar la idea. ¡Gran trabajo!"
      *   **Si la imagen es irrelevante, está en blanco o es de muy baja calidad (rechaza el trabajo, \`isApproved: false\`):**
          *   Explica amablemente por qué no se puede aprobar.
          *   Da una guía clara sobre lo que se espera para el próximo intento.
          *   **Ejemplo de irrelevante:** "Hola, gracias por tu entrega. Parece que la imagen que subiste no está relacionada con el tema 'El ciclo del agua'. Para este desafío, necesito que dibujes un diagrama que muestre las etapas como evaporación y condensación. ¡Estoy seguro de que puedes hacerlo genial!"
          *   **Ejemplo de en blanco:** "Parece que la imagen que subiste está vacía. Por favor, asegúrate de subir una foto de tu trabajo. ¡Espero verlo pronto!"

  3.  **Determina el estado de aprobación (\`isApproved\`):**
      *   Establece \`isApproved\` en \`true\` solo si la imagen es un esfuerzo relevante y de buena fe.
      *   Establece \`isApproved\` en \`false\` para todo lo demás.

  4.  **Idioma:** Responde siempre en español.
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
