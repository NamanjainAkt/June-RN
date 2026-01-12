import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  imageBase64?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const contents: any[] = [];

    if (systemPrompt) {
      contents.push({
        role: 'user',
        parts: [
          { text: `System: ${systemPrompt}\n\nUser: ${prompt}` },
        ],
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });
    }

    if (imageBase64) {
      contents.push({
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      });
    }

    const result = await model.generateContent({
      contents,
      generationConfig,
    });

    const response = result.response;
    
    if (!response.text()) {
      throw new Error('Empty response from API');
    }

    return response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    if (error.message?.includes('Empty response')) {
      throw new Error('The model did not generate a response. Please try again.');
    }
    
    if (error.message?.includes('SAFETY')) {
      throw new Error('This request was blocked due to safety guidelines.');
    }
    
    if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    
    throw new Error(`API Error: ${error.message || 'Unknown error occurred'}`);
  }
}

export async function* generateStreamingResponse(
  prompt: string,
  systemPrompt: string,
  imageBase64?: string
): AsyncGenerator<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const contents: any[] = [];

    if (systemPrompt) {
      contents.push({
        role: 'user',
        parts: [
          { text: `System: ${systemPrompt}\n\nUser: ${prompt}` },
        ],
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });
    }

    if (imageBase64) {
      contents.push({
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      });
    }

    const result = await model.generateContentStream({
      contents,
      generationConfig,
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error: any) {
    console.error('Gemini Streaming Error:', error);
    throw error;
  }
}

export function formatAIResponse(text: string): string {
  let formatted = text.trim();
  
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '\n$1\n');
  formatted = formatted.replace(/\*(.*?)\*/g, '$1');
  formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '\n$2\n');
  formatted = formatted.replace(/`([^`]+)`/g, '$1');
  formatted = formatted.replace(/^[-*]\s/gm, '• ');
  formatted = formatted.replace(/^\d+\.\s/gm, '#. ');
  
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  formatted = formatted.replace(/^\s+|\s+$/g, '');
  
  return formatted;
}
