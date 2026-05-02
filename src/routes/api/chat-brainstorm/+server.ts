import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { env } from '$env/dynamic/private';

const openrouter = createOpenRouter({
    apiKey: env.OPENROUTER_API_KEY || ''
});

export const POST: RequestHandler = async ({ request, locals: { session, user } }) => {
    if (!session || !user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY === '') {
        return json({ error: 'OpenRouter API key is not configured.' }, { status: 500 });
    }

    try {
        const { messages } = await request.json();
        console.log(`[chat-brainstorm] Processing request with ${messages.length} messages.`);

        // System prompt for the brainstorm assistant
        const SYSTEM_PROMPT = `
You are the Atheum Publishing Assistant, an elite editor designed to help users brainstorm their next ebook, academic paper, playbook, or cheatsheet.
Your goal is to be helpful, concise, and professional. 
Ask the user engaging questions to figure out their target topic, document format, and custom title.
Once they have clearly defined their topic and format, enthusiastically tell them to click the "Render Final Document" button on the right Canvas Settings panel.
Do NOT output any markdown code blocks of full chapters here. You are just brainstorming text.
`;

        const response = await generateText({
            model: openrouter('nvidia/nemotron-3-super-120b-a12b:free'),
            system: SYSTEM_PROMPT,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        });

        console.log(`[chat-brainstorm] AI reply received: "${response.text.substring(0, 50)}..."`);
        return json({ reply: response.text });
    } catch (error: any) {
        console.error('[chat-brainstorm] Detailed error:', error);
        return json({ error: error.message || 'Failed to communicate with AI helper' }, { status: 500 });
    }
};
