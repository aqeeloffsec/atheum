import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ebookAgent, getFormatInstructions } from '$lib/mastra/agent';
import { env } from '$env/dynamic/private';
import { isFormatAllowed, PLAN_CONFIGS, type FormatType, type PlanTier } from '$lib/config/plan-config';

// Retry wrapper for AI generation calls (handles transient network/stream errors)
async function generateWithRetry(prompt: string, maxRetries = 3) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await ebookAgent.generate(prompt);
		} catch (err: any) {
			console.error(`[generate-ebook] Attempt ${attempt}/${maxRetries} failed:`, err.message);
			if (attempt === maxRetries) throw err;
			await new Promise(r => setTimeout(r, 2000 * attempt));
		}
	}
	throw new Error('All retry attempts exhausted');
}

export const POST: RequestHandler = async ({ request, locals: { supabase, session, user } }) => {
	if (!session || !user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { topic, audience, style, pages, title, format, planTier } = await request.json();

	if (!topic) {
		return json({ error: 'Topic is required' }, { status: 400 });
	}

	if (!env.GOOGLE_GENERATIVE_AI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY === '') {
		return json({ error: 'Google AI API key is not configured.' }, { status: 500 });
	}

	// Validate format is allowed for the plan
	const tier = (planTier || 'free') as PlanTier;
	const docFormat = (format || 'ebook') as FormatType;

	if (!isFormatAllowed(tier, docFormat)) {
		return json({ error: `Format "${docFormat}" is not available on your plan.` }, { status: 403 });
	}

	// Validate page count is within plan range
	const planConfig = PLAN_CONFIGS[tier];
	const targetedPages = Math.min(Math.max(pages || planConfig.pageRange.min, planConfig.pageRange.min), planConfig.pageRange.max);

	// Check monthly quota
	try {
		const now = new Date();
		const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

		const { count, error: countError } = await supabase
			.from('ebook_generations')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('created_at', firstOfMonth);

		if (!countError && count !== null && count >= planConfig.monthlyLimit) {
			return json({
				error: `Monthly generation limit reached (${planConfig.monthlyLimit} ebooks). Upgrade your plan for more.`
			}, { status: 429 });
		}
	} catch (err) {
		console.error('Quota check error:', err);
	}

	const formatInstructions = getFormatInstructions(docFormat);
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			const emit = (data: any) => {
				try {
					controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
				} catch { /* stream may be closed */ }
			};

			try {
				// Calculate chapter structure based on page count
				const contentPages = Math.max(1, targetedPages - 2); // subtract cover and TOC
				const wordsPerPage = 350;

				// For large books, group into reasonable chapter sizes
				// Each chapter targets ~3-8 pages to keep AI responses manageable
				const pagesPerChapter = contentPages <= 30 ? 1 : Math.min(8, Math.max(3, Math.ceil(contentPages / 40)));
				const chapterCount = Math.ceil(contentPages / pagesPerChapter);
				const wordsPerChapter = wordsPerPage * pagesPerChapter;

				emit({
					status: 'outlining',
					totalChapters: chapterCount,
					targetPages: targetedPages,
					format: docFormat
				});

				// Step 1: Generate Outline
				const outlinePrompt = `
${formatInstructions}

You are a master document architect. Create a detailed outline for a ${docFormat.replace(/_/g, ' ')} about "${topic}".
Target Audience: ${audience || 'General public'}
Tone/Style: ${style || 'Professional and authoritative'}
Quality Standard: ${planConfig.qualityTier}

CRITICAL STRUCTURE REQUIREMENTS:
- The final document must be EXACTLY ${targetedPages} pages long (approximately ${targetedPages * wordsPerPage} words total).
- Cover page and table of contents consume 2 pages, leaving ${contentPages} pages for content.
- You MUST create EXACTLY ${chapterCount} chapters/sections.
- Each chapter/section MUST have a "targetWords" value of EXACTLY ${wordsPerChapter}.

RETURN ONLY A VALID JSON ARRAY OF EXACTLY ${chapterCount} OBJECTS.
No markdown formatting, no backticks, just the raw JSON array starting with '[' and ending with ']'.
Each object must have:
- "chapterNumber": integer
- "title": string (compelling, specific title)
- "description": string (very detailed notes: key subtopics, examples to include, frameworks to cover, data points to cite)
- "targetWords": integer (must be exactly ${wordsPerChapter})
				`;

				const outlineResponse = await generateWithRetry(outlinePrompt);
				let rawOutline = outlineResponse.text.trim();

				// Clean up markdown formatting
				if (rawOutline.startsWith('```json')) rawOutline = rawOutline.substring(7);
				if (rawOutline.startsWith('```')) rawOutline = rawOutline.substring(3);
				if (rawOutline.endsWith('```')) rawOutline = rawOutline.substring(0, rawOutline.length - 3);
				rawOutline = rawOutline.trim();

				let chapters = [];
				try {
					chapters = JSON.parse(rawOutline);
				} catch (err) {
					console.error("Failed to parse outline:", rawOutline);
					throw new Error('AI returned an invalid outline format. Please try again.');
				}

				if (!Array.isArray(chapters) || chapters.length === 0) {
					throw new Error('AI returned an empty outline.');
				}

				let fullMarkdown = '';

				// Inject title as H1
				if (title) {
					fullMarkdown += `# ${title}\n\n`;
				} else {
					fullMarkdown += `# ${topic}\n\n`;
				}

				// Step 2: Generate each chapter with format-specific instructions
				for (const chapter of chapters) {
					emit({
						status: 'writing',
						chapter: chapter.chapterNumber,
						title: chapter.title,
						totalChapters: chapters.length
					});

					const chapterPrompt = `
${formatInstructions}

You are writing a ${docFormat.replace(/_/g, ' ')} about "${topic}".
Overall style: ${style || 'Professional and authoritative'}
Quality Standard: ${planConfig.qualityTier}

YOUR CURRENT TASK: Write Chapter/Section ${chapter.chapterNumber} of ${chapters.length}: "${chapter.title}"

Detailed requirements for this chapter:
${chapter.description}

CRITICAL WORD COUNT: You MUST write EXACTLY ${chapter.targetWords} words for this chapter.
- Go into extreme depth with elaborate examples, case studies, and professional analysis.
- Do NOT summarize or end prematurely. Write continuously until you hit the precise word count.
- Do NOT wrap your response in markdown code blocks. Output raw Markdown text.
- Start your response with '## ${chapter.title}'.
- Use ### for subsections within this chapter.
- Include relevant blockquotes, lists, and formatting as appropriate for the document type.
					`;

					const chapterResponse = await generateWithRetry(chapterPrompt);
					let chapterContent = chapterResponse.text.trim();

					// Clean up code fences
					if (chapterContent.startsWith('```markdown')) chapterContent = chapterContent.substring(11);
					if (chapterContent.startsWith('```')) chapterContent = chapterContent.substring(3);
					if (chapterContent.endsWith('```')) chapterContent = chapterContent.substring(0, chapterContent.length - 3);

					fullMarkdown += chapterContent.trim() + '\n\n';
				}

				// Step 3: Generate cover image prompt
				emit({ status: 'finalizing' });
				const coverPromptRequest = `Based on the following ${docFormat.replace(/_/g, ' ')} topic: "${topic}", give me EXACTLY one detailed, artistic description for an AI image generator that captures the essence of the theme in a cinematic, professional style. Limit to 30 words. Output ONLY the description text, no intro, no quotes.`;
				const coverResponse = await generateWithRetry(coverPromptRequest);
				const imagePrompt = coverResponse.text.trim();
				const keywords = imagePrompt.split(' ').slice(0, 5).join(',').toLowerCase().replace(/[^a-z,]/g, '');
				const coverImageUrl = `https://loremflickr.com/800/1200/${keywords.replace(/,/g, '-')}`;

				// Step 4: Record generation in database
				try {
					await supabase.from('ebook_generations').insert({
						user_id: user.id,
						format: docFormat,
						pages: targetedPages,
						topic: topic.trim(),
						title: title || topic.trim(),
						plan_tier: tier,
					});
				} catch (err) {
					console.error('Failed to record generation:', err);
				}

				emit({
					status: 'completed',
					content: fullMarkdown.trim(),
					coverImageUrl,
					format: docFormat,
					pages: targetedPages,
				});

				controller.close();
			} catch (error: any) {
				console.error('Error generating ebook:', error);
				emit({ error: error.message || 'Failed to generate ebook' });
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'application/x-ndjson',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
};
