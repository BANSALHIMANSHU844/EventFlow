'use server';

/**
 * @fileOverview A flow for generating event descriptions using AI.
 *
 * - generateEventDescription - A function that generates event descriptions.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  dateTime: z.string().describe('The date and time of the event.'),
  venue: z.string().describe('The venue of the event.'),
  hostLogo: z
    .string()
    .describe(
      'The logo of the event host, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    )
    .optional(),
  themeColor: z.string().describe('The theme color of the event.'),
});
export type GenerateEventDescriptionInput = z.infer<
  typeof GenerateEventDescriptionInputSchema
>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated event description.'),
});
export type GenerateEventDescriptionOutput = z.infer<
  typeof GenerateEventDescriptionOutputSchema
>;

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging event descriptions.

  Create a compelling and concise event description based on the following details:

  Title: {{{title}}}
  Date and Time: {{{dateTime}}}
  Venue: {{{venue}}}
  Theme Color: {{{themeColor}}}
  {{#if hostLogo}}Logo: {{media url=hostLogo}}{{/if}}

  Description:`, // The Handlebars template should end with the field being populated
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
