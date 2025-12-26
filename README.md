# AIstotle

Transform your handwritten or typed notes into structured, educational lesson content using AI-powered OCR and multimodal analysis.

## Features

- 🎓 **UPenn-Inspired Design**: Professional academic aesthetic with Penn Blue and Penn Red color scheme
- 📸 **Multimodal OCR**: Uses Google Gemini to analyze note images and extract content
- 📚 **Structured Output**: Automatically formats content into Title, Objectives, Key Concepts, Insights, and Quiz
- 🎨 **Glassmorphism UI**: Modern, elegant interface with smooth animations
- 🖨️ **Print-Friendly**: Optimized for printing to PDF as academic handouts

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **@google/generative-ai** for Gemini API integration
- **CSS-in-JS** for styling with design system constants

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Gemini API key: `VITE_API_KEY=your_api_key_here`

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable in Vercel dashboard:
   - Key: `VITE_API_KEY`
   - Value: Your Gemini API key
4. Deploy!

The app is configured to work seamlessly with Vercel's environment variable injection.

## Usage

1. Upload an image of your notes (drag & drop or click to browse)
2. Wait for AI analysis (typically 5-15 seconds)
3. Review the structured lesson content
4. Print to PDF if needed for distribution

## Design System

- **Primary Color (Penn Blue)**: `#011F5B`
- **Accent Color (Penn Red)**: `#990000`
- **Typography**: Montserrat (headings), Roboto (body)
- **UI Style**: Glassmorphism with subtle shadows and professional spacing

