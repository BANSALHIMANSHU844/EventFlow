import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(60, 'Title cannot exceed 60 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  dateTime: z.date({
    required_error: 'A date and time is required.',
  }),
  venue: z.string().min(3, 'Venue must be at least 3 characters').max(100, 'Venue cannot exceed 100 characters'),
  hostLogo: z.string().optional(), // base64 data URI
  themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format'),
  rsvpUrl: z.string().url('Please enter a valid URL for RSVP').min(1, 'RSVP URL is required'),
  createdBy: z.string().optional(),
  eventCode: z.string().optional(),
});

export type EventData = z.infer<typeof eventSchema>;
