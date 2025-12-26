import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from Vite environment variable (injected at build time)
const API_KEY = import.meta.env.VITE_API_KEY || '';

if (!API_KEY) {
  console.warn('API_KEY not found. Please set VITE_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTIONS = `You are an expert pedagogue specializing in transforming handwritten or typed notes into structured, educational lesson content. Your task is to analyze uploaded note images and extract key information, then format it into a comprehensive lesson following this exact structure:

## Title
[Clear, descriptive title for the lesson]

## Objectives
- [Learning objective 1]
- [Learning objective 2]
- [Learning objective 3]

## Key Concepts
[Detailed explanation of the main concepts covered in the notes]

## Insight
[Your pedagogical insight that connects the concepts, provides context, or offers a deeper understanding]

## Quiz
1. [Question 1]
   a) [Option A]
   b) [Option B]
   c) [Option C]
   d) [Option D]

2. [Question 2]
   [Similar format]

3. [Question 3]
   [Similar format]

IMPORTANT: 
- Output ONLY valid Markdown following the structure above
- Be thorough and accurate in extracting information from the notes
- Create meaningful quiz questions that test understanding of the key concepts
- Use clear, academic language appropriate for educational content
- If the image quality is poor or content is unclear, note this in the Key Concepts section`;

export interface LessonContent {
  title: string;
  objectives: string[];
  keyConcepts: string;
  insight: string;
  quiz: Array<{
    question: string;
    options: string[];
  }>;
}

/**
 * Converts an image file to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Parses markdown content into structured LessonContent
 */
function parseMarkdownToLesson(markdown: string): LessonContent {
  const lines = markdown.split('\n');
  let currentSection = '';
  let title = '';
  const objectives: string[] = [];
  let keyConcepts = '';
  let insight = '';
  const quiz: Array<{ question: string; options: string[] }> = [];

  let buffer: string[] = [];
  let currentQuizQuestion: { question: string; options: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection === 'Key Concepts' && buffer.length > 0) {
        keyConcepts = buffer.join('\n').trim();
      } else if (currentSection === 'Insight' && buffer.length > 0) {
        insight = buffer.join('\n').trim();
      }

      // Start new section
      currentSection = line.replace('## ', '').trim();
      buffer = [];
      continue;
    }

    if (currentSection === 'Title') {
      if (line && !line.startsWith('#')) {
        title = line;
      }
    } else if (currentSection === 'Objectives') {
      if (line.startsWith('- ')) {
        objectives.push(line.replace('- ', '').trim());
      }
    } else if (currentSection === 'Key Concepts') {
      if (line) {
        buffer.push(line);
      }
    } else if (currentSection === 'Insight') {
      if (line) {
        buffer.push(line);
      }
    } else if (currentSection === 'Quiz') {
      // Check if it's a question number
      const questionMatch = line.match(/^\d+\.\s*(.+)/);
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuizQuestion) {
          quiz.push(currentQuizQuestion);
        }
        currentQuizQuestion = {
          question: questionMatch[1],
          options: [],
        };
      } else if (currentQuizQuestion) {
        // Check if it's an option
        const optionMatch = line.match(/^[a-d]\)\s*(.+)/);
        if (optionMatch) {
          currentQuizQuestion.options.push(optionMatch[1]);
        }
      }
    }
  }

  // Save last sections
  if (currentSection === 'Key Concepts' && buffer.length > 0) {
    keyConcepts = buffer.join('\n').trim();
  } else if (currentSection === 'Insight' && buffer.length > 0) {
    insight = buffer.join('\n').trim();
  }

  if (currentQuizQuestion) {
    quiz.push(currentQuizQuestion);
  }

  return {
    title: title || 'Untitled Lesson',
    objectives: objectives.length > 0 ? objectives : ['Understand the key concepts presented'],
    keyConcepts: keyConcepts || 'No key concepts extracted.',
    insight: insight || 'No additional insights provided.',
    quiz: quiz.length > 0 ? quiz : [],
  };
}

/**
 * Analyzes an image using Gemini OCR and returns structured lesson content
 */
export async function analyzeImageWithGemini(imageFile: File): Promise<LessonContent> {
  if (!API_KEY) {
    throw new Error('API key not configured. Please set VITE_API_KEY in your environment variables.');
  }

  try {
    // Convert image to base64
    const base64Data = await fileToBase64(imageFile);
    
    // Get image MIME type
    const mimeType = imageFile.type || 'image/png';

    // Initialize the model - using gemini-1.5-flash (multimodal support)
    // Note: Update to 'gemini-2.0-flash-exp' or newer models when available
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTIONS,
    });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    // Generate content
    const result = await model.generateContent([imagePart]);
    const response = await result.response;
    const markdown = response.text();

    // Parse markdown into structured format
    return parseMarkdownToLesson(markdown);
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to analyze image: ${error.message}`
        : 'Failed to analyze image. Please check your API key and try again.'
    );
  }
}

