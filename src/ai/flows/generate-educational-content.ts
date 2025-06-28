// src/ai/flows/generate-educational-content.ts
'use server';

/**
 * @fileOverview AI-powered educational content generator for teachers.
 *
 * - generateEducationalContent - A function that takes course details and content type to generate educational materials.
 * - GenerateEducationalContentInput - The input type for the generateEducationalContent function.
 * - GenerateEducationalContentOutput - The return type for the generateEducationalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEducationalContentInputSchema = z.object({
  courseName: z.string().describe('The name of the course.'),
  topic: z.string().describe('The specific topic for the educational content.'),
  contentType: z.enum(['quiz', 'survey', 'assignment']).describe('The type of educational content to generate.'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional().describe('The difficulty level of the content.'),
  length: z.string().optional().describe('Desired length or number of questions/tasks.'),
  additionalInstructions: z.string().optional().describe('Any additional instructions for content generation.'),
});

export type GenerateEducationalContentInput = z.infer<typeof GenerateEducationalContentInputSchema>;

const GenerateEducationalContentOutputSchema = z.object({
  title: z.string().describe('The title of the generated educational content.'),
  content: z.string().describe('The generated educational content in a suitable format (e.g., questions, instructions).'),
});

export type GenerateEducationalContentOutput = z.infer<typeof GenerateEducationalContentOutputSchema>;

export async function generateEducationalContent(input: GenerateEducationalContentInput): Promise<GenerateEducationalContentOutput> {
  return generateEducationalContentFlow(input);
}

const generateEducationalContentPrompt = ai.definePrompt({
  name: 'generateEducationalContentPrompt',
  input: {schema: GenerateEducationalContentInputSchema},
  output: {schema: GenerateEducationalContentOutputSchema},
  prompt: `You are an AI assistant designed to help teachers generate educational content.

  Based on the course name, topic, content type, and difficulty level, create engaging and effective learning materials.

  Course Name: {{{courseName}}}
  Topic: {{{topic}}}
  Content Type: {{{contentType}}}
  Difficulty Level: {{{difficultyLevel}}}
  Length: {{{length}}}
  Additional Instructions: {{{additionalInstructions}}}

  Generate the educational content and return it in a format suitable for immediate use.
  Ensure that the content is educationally sound and aligns with the specified difficulty level and any additional instructions provided.
  Return title of the content and the content itself.
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
