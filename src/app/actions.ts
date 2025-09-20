'use server';

import {
  generateEventDescription,
  type GenerateEventDescriptionInput,
} from '@/ai/flows/generate-event-description';

export async function generateDescriptionAction(
  input: GenerateEventDescriptionInput
): Promise<{ success: boolean; description?: string; error?: string }> {
  try {
    const result = await generateEventDescription(input);
    if (result.description) {
      return { success: true, description: result.description };
    }
    return { success: false, error: 'Failed to generate description.' };
  } catch (error) {
    console.error('Error generating event description:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while generating the description.',
    };
  }
}
