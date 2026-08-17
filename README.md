# InterviewAI

InterviewAI is a low-pressure mock interview practice app for college students and early-career candidates. It provides personalized interview questions, timed practice, AI-generated feedback, and saved progress.

**Live demo:** https://interview-ai-sepia-six.vercel.app/

## Features

- Behavioral and technical mock interview modes
- Role and company-based question personalization
- Resume upload and skill extraction from PDF or DOCX files
- Timed responses with question progression
- Typed-answer feedback, including filler-word detection
- AI-generated interview feedback
- Supabase email/password authentication
- Saved interview sessions and progress history
- Session-detail view for reviewing past responses
- Responsive Vite + React interface

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth and Postgres
- Supabase Edge Functions
- OpenAI Responses API
- pdfjs-dist and Mammoth for resume parsing
- Vercel for deployment

## Run locally

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install