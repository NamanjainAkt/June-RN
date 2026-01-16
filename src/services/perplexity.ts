const PERPLEXITY_API_KEY = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export async function generateEnhancedImagePrompt(userPrompt: string): Promise<string> {
    if (!PERPLEXITY_API_KEY) {
        console.warn('Perplexity API key missing, falling back to original prompt');
        return userPrompt;
    }

    try {
        const response = await fetch(PERPLEXITY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-pro', // Using their high-performance reasoning model
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert stable diffusion and midjourney prompt engineer. Your goal is to take a simple user request and turn it into a highly detailed, professional artistic prompt for an image generator. Include details about lighting, camera lens, style, and composition. Only return the final prompt text.'
                    },
                    {
                        role: 'user',
                        content: `Enhance this image prompt: "${userPrompt}"`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || userPrompt;
    } catch (error) {
        console.error('Perplexity API Error:', error);
        return userPrompt;
    }
}
