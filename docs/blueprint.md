# **App Name**: EventFlow

## Core Features:

- Event Creation: Create events with title, date/time, venue, host logo, and theme color, all through an intuitive interface.
- Poster Generation: Generate event posters using HTML5 Canvas, with auto-fitting text and image compositing based on pre-designed templates.
- RSVP Artifact Generation: Automatically generate Google Forms and link them to Google Sheets for attendee data collection, or manually input existing Forms and Sheets.
- Short Link Creation: Create shortened RSVP links, either stored in Firestore or encoded directly in the URL, with a QR code overlay for easy sharing.
- WhatsApp Share Composer: Compose pre-filled WhatsApp messages with event details and the RSVP link for one-tap sharing.
- AI-Powered Event Description Generator: Use an AI tool to automatically generate engaging event descriptions based on event details, providing organizers with compelling content for their posters and share messages.
- Attendee Dashboard: Display RSVP counts, attendee lists sourced directly from Google Sheets (via public CSV or client-side OAuth), and provide CSV export functionality.

## Style Guidelines:

- Primary color: Vibrant purple (#9F5BBA) to evoke creativity and energy.
- Background color: Light purple (#F2E7FA), for a gentle, professional tone.
- Accent color: Blue (#5B85BA) for interactive elements, providing a sense of trustworthiness.
- Headline font: 'Poppins', a geometric sans-serif for a precise and modern look. Body text: 'PT Sans' (sans-serif) when longer text is anticipated.
- Use clean and modern icons that match the style of the 'Poppins' typeface.
- Maintain a clean and organized layout to enhance user experience, ensuring responsiveness across different screen sizes.
- Implement subtle animations and transitions to provide a smooth user experience, especially during poster editing and link generation.