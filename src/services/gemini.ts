import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
console.log('🔑 Gemini API Key:', GEMINI_KEY.substring(0, 8) + '...');
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

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

const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
const TEXT_MODEL_NAME = 'gemini-2.0-flash-lite';

export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  imageBase64?: string,
  isImageGeneration?: boolean
): Promise<{ text: string; imageUrl?: string }> {
  try {
    const modelName = isImageGeneration ? IMAGE_MODEL_NAME : TEXT_MODEL_NAME;
    const model = genAI.getGenerativeModel({
      model: modelName,
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

    if (isImageGeneration) {
      try {
        console.log('🖼️ Attempting Gemini image generation...');
        const result = await model.generateContent({
          contents,
          generationConfig,
        });

        const response = result.response;
        const text = response.text();

        console.log('🖼️ Gemini response received, checking for image data...');

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: any) => part.inlineData?.mimeType?.startsWith('image/')
        );

        if (imagePart?.inlineData) {
          const imageBase64 = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType || 'image/png';
          return {
            text: `I've generated this image using Gemini. \n\n**Prompt:** "${text}"`,
            imageUrl: `data:${mimeType};base64,${imageBase64}`
          };
        }

        throw new Error('No image data in Gemini response');
      } catch (err: any) {
        console.warn('⚠️ Gemini Image failed, falling back to Pollinations:', err.message);

        // Fallback to Pollinations.ai
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

        return {
          text: `Gemini is currently at its limit, so I've used our high-speed backup engine to create this for you. \n\n**Prompt:** "${prompt}"`,
          imageUrl
        };
      }
    }

    const result = await model.generateContent({
      contents,
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    return { text };
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
  imageBase64?: string,
  isImageGeneration?: boolean
): AsyncGenerator<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: isImageGeneration ? IMAGE_MODEL_NAME : TEXT_MODEL_NAME,
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
