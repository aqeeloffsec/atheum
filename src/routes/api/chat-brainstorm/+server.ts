import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { env } from '$env/dynamic/private';
import type { FormatType } from '$lib/config/plan-config';

const googleAI = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY || env.GOOGLE_API_KEY || env.OPENROUTER_API_KEY || ''
});

// Define the structure for extracted data from AI's natural reply
interface BrainstormResult {
    topic: string;
    format: FormatType | '';
    title: string;
    nextSteps: string;
}

// Known format keywords for extraction
const FORMAT_KEYWORDS: Record<string, FormatType> = {
    'playbook': 'playbook',
    'cheatsheet': 'cheatsheet',
    'cheat sheet': 'cheatsheet',
    'ebook': 'ebook',
    'e-book': 'ebook',
    'research paper': 'research_paper',
    'thesis': 'thesis',
    'dissertation': 'dissertation',
    'lecture notes': 'lecture_notes',
    'syllabus': 'syllabus',
    'whitepaper': 'whitepaper',
    'white paper': 'whitepaper',
    'technical manual': 'technical_manual',
    'certification guide': 'certification_guide',
};

/**
 * Extract structured data (topic, format, title) from the AI's natural conversational reply.
 * This avoids forcing the AI to output JSON, which leads to robotic and unreliable chat.
 */
function extractStructuredData(reply: string, userMessages: string[]): BrainstormResult {
    const replyLower = reply.toLowerCase();
    const allUserText = userMessages.join(' ').toLowerCase();

    // Extract format from the conversation
    let detectedFormat: FormatType | '' = '';
    for (const [keyword, formatId] of Object.entries(FORMAT_KEYWORDS)) {
        if (replyLower.includes(keyword) || allUserText.includes(keyword)) {
            detectedFormat = formatId;
            break;
        }
    }

    // Extract topic: look for quoted phrases or key subject phrases in user messages
    let detectedTopic = '';
    const lastUserMsg = userMessages[userMessages.length - 1] || '';
    // If user message is a clear topic statement (not a question), use it
    if (lastUserMsg.length > 5 && lastUserMsg.length < 200 && !lastUserMsg.endsWith('?')) {
        // Clean up common prefixes
        detectedTopic = lastUserMsg
            .replace(/^(i want to write about|write about|my topic is|the topic is|i'd like to|let's do|how about)\s+/i, '')
            .replace(/^(a book on|an ebook on|a guide on|a playbook on)\s+/i, '')
            .trim();
    }

    // Try to extract a title if the AI suggests one with quotes or "titled"
    let detectedTitle = '';
    const titleMatch = reply.match(/(?:titled?|called?|name it)\s*["""]([^"""]+)["""]/i)
        || reply.match(/["""]([^"""]{5,80})["""]/);
    if (titleMatch) {
        detectedTitle = titleMatch[1].trim();
    }

    return {
        topic: detectedTopic,
        format: detectedFormat,
        title: detectedTitle,
        nextSteps: reply
    };
}

export const POST: RequestHandler = async ({ request, locals: { session, user } }) => {
    if (!session || !user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!env.GOOGLE_GENERATIVE_AI_API_KEY && !env.GOOGLE_API_KEY && !env.OPENROUTER_API_KEY) {
        return json({ error: 'Google AI API key is not configured.' }, { status: 500 });
    }

    try {
        const { messages } = await request.json();

        // Natural conversational system prompt — no JSON requirement
        const SYSTEM_PROMPT = `You are the Atheum Publishing Assistant, an elite editor and creative partner. You help users brainstorm and refine their next book, paper, or guide.

Your personality: Warm, professional, enthusiastic about writing. Think of yourself as a seasoned editor at a prestigious publishing house who genuinely cares about every author's vision.

Your goals in the conversation:
1. Help the user clarify their TARGET TOPIC — what they want to write about
2. Help them choose the best DOCUMENT FORMAT (ebook, playbook, cheatsheet, research paper, thesis, dissertation, lecture notes, syllabus, whitepaper, technical manual, or certification guide)
3. Optionally suggest a compelling TITLE for the document

Guidelines:
- Ask focused, engaging questions (1-2 at a time, not overwhelming lists)
- Offer creative suggestions and build on the user's ideas
- When the topic and format are clearly established, enthusiastically tell them to click the "Render Final Document" button on the Canvas Settings panel
- Keep responses concise (2-4 sentences typically)
- Do NOT write any actual book content — this is brainstorming only
- Do NOT output JSON or structured data — write naturally like an editor would`;

        const response = await generateText({
            model: googleAI('gemini-2.5-flash'),
            system: SYSTEM_PROMPT,
            maxOutputTokens: 400,
            temperature: 0.7,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        });

        const replyText = response.text.trim();

        if (!replyText) {
            throw new Error('Empty response from editor assistant');
        }

        // Extract structured data from natural reply via post-processing
        const userMessages = messages
            .filter((m: any) => m.role === 'user')
            .map((m: any) => m.content);

        const structured = extractStructuredData(replyText, userMessages);

        return json({
            reply: replyText,
            structured
        });
    } catch (error: any) {
        console.error('[chat-brainstorm] Error:', error.message);
        console.error('[chat-brainstorm] Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        // Detect Google AI auth/account issues
        const msg = error.message || '';
        if (msg.includes('User not found') || msg.includes('401') || msg.includes('403') || msg.includes('Invalid API key') || msg.includes('API_KEY_INVALID')) {
            return json({ error: 'AI service authentication failed. Please check that the Google AI API key is valid.' }, { status: 500 });
        }

        return json({ error: msg || 'Failed to communicate with AI helper' }, { status: 500 });
    }
};
