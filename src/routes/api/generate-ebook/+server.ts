import { json } from '@sveltejs/kit';
import { ebookAgent } from '$lib/mastra/agent';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
	try {
		const { topic, audience, style, pages } = await request.json();

		if (!topic) {
			return json({ error: 'Topic is required' }, { status: 400 });
		}
		
		const targetedPages = pages || 5;
		if (!env.GOOGLE_GENERATIVE_AI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY === '') {
			return json({ error: 'Google Generative AI API key is not configured.' }, { status: 500 });
		}

		console.log(`Generating ebook for topic: ${topic}...`);

		const prompt = `
			Topic: ${topic}
			Target Audience: ${audience || 'General public'}
			Tone/Style: ${style || 'Professional and informative'}
			Length target: Approximately ${targetedPages} printed pages long (yield roughly 350-400 words per page, meaning you should aim for ~${targetedPages * 350} words total).
			
			Please generate the complete, highly detailed ebook in Markdown format now. Take your time to expand on concepts to meet the length requirement.
		`;

		const aiResponse = await ebookAgent.generate(prompt);
		let markdown = aiResponse.text;

		// Extract Cover Image Prompt
		let coverImageUrl = '';
		const promptMatch = markdown.match(/COVER_IMAGE_PROMPT:\s*(.+)$/m);
		if (promptMatch) {
			const imagePrompt = promptMatch[1].trim();
			markdown = markdown.replace(/COVER_IMAGE_PROMPT:\s*.+$/m, '').trim();
			const keywords = imagePrompt.split(' ').slice(0, 5).join(',').toLowerCase().replace(/[^a-z,]/g, '');
			coverImageUrl = `https://loremflickr.com/800/1200/${keywords.replace(/,/g, '-')}`;
		}

		return json({
			content: markdown,
			coverImageUrl
		});
	} catch (error: any) {
		console.error('Error generating ebook:', error);
		return json({ error: error.message || 'Failed to generate ebook' }, { status: 500 });
	}
};
