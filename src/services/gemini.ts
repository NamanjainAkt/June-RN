// AI Service using OpenRouter for text and Pollinations.ai for images

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Using a fast, efficient model for chat
const TEXT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

console.log('🔑 OpenRouter API Key:', OPENROUTER_API_KEY.substring(0, 8) + '...');

export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  imageBase64?: string,
  isImageGeneration?: boolean
): Promise<{ text: string; imageUrl?: string }> {
  try {
    // Handle image generation with Pollinations.ai
    if (isImageGeneration) {
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

      return {
        text: `I've generated this image for you. \n\n**Prompt:** "${prompt}"`,
        imageUrl
      };
    }

    // Build messages array for OpenRouter
    const messages: any[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Handle image input if provided
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    // Make request to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://june-ai.expo.app',
        'X-Title': 'June AI'
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json() as any;
    const text = data.choices?.[0]?.message?.content || '';

    if (!text) {
      throw new Error('No response generated from the model');
    }

    return { text };
  } catch (error: any) {
    console.error('AI API Error:', error);

    if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your configuration.');
    }

    throw new Error(`AI Error: ${error.message || 'Unknown error occurred'}`);
  }
}

export async function* generateStreamingResponse(
  prompt: string,
  systemPrompt: string,
  imageBase64?: string,
  isImageGeneration?: boolean
): AsyncGenerator<string> {
  try {
    // Image generation doesn't support streaming
    if (isImageGeneration) {
      const result = await generateResponse(prompt, systemPrompt, imageBase64, true);
      yield result.text;
      return;
    }

    // Build messages array
    const messages: any[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    // Make streaming request to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://june-ai.expo.app',
        'X-Title': 'June AI'
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    // Read the stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content;

            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
            continue;
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Streaming Error:', error);
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
