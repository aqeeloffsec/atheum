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
			// Exponential backoff with jitter
			const delay = Math.min(1000 * 2 ** attempt + Math.random() * 1000, 10000);
			await new Promise(r => setTimeout(r, delay));
		}
	}
	throw new Error('All retry attempts exhausted');
}

// Generate a single chapter with its full prompt context
async function generateChapter(
	chapter: { chapterNumber: number; title: string; description: string; targetWords: number },
	totalChapters: number,
	topic: string,
	docFormat: FormatType,
	style: string,
	qualityTier: string,
	formatInstructions: string
): Promise<{ chapterNumber: number; title: string; content: string }> {
	const chapterPrompt = `
${formatInstructions}

You are writing a ${docFormat.replace(/_/g, ' ')} about "${topic}".
Overall style: ${style}
Quality Standard: ${qualityTier}

YOUR CURRENT TASK: Write Chapter/Section ${chapter.chapterNumber} of ${totalChapters}: "${chapter.title}"

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

	return { chapterNumber: chapter.chapterNumber, title: chapter.title, content: chapterContent.trim() };
}

export const POST: RequestHandler = async ({ request, locals: { supabase, session, user } }) => {
	if (!session || !user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { topic, audience, style, pages, title, format, planTier } = await request.json();

	if (!topic) {
		return json({ error: 'Topic is required' }, { status: 400 });
	}

	if (!env.GOOGLE_GENERATIVE_AI_API_KEY && !env.GOOGLE_API_KEY && !env.OPENROUTER_API_KEY) {
		return json({ error: 'AI API key is not configured.' }, { status: 500 });
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
	const effectiveStyle = style || 'Professional and authoritative';

	const stream = new ReadableStream({
		async start(controller) {
			const emit = (data: any) => {
				try {
					controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
				} catch { /* stream may be closed */ }
			};

			// Send keepalive pings to prevent proxy/client timeouts
			const keepaliveInterval = setInterval(() => {
				emit({ status: 'keepalive' });
			}, 15000);

			try {
				// Calculate chapter structure based on page count
				const contentPages = Math.max(1, targetedPages - 2);
				const wordsPerPage = 350;

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
Tone/Style: ${effectiveStyle}
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

				let chapters: any[] = [];
				try {
					chapters = JSON.parse(rawOutline);
				} catch {
					console.error('[generate-ebook] Failed to parse outline:', rawOutline.substring(0, 200));
					throw new Error('AI returned an invalid outline format. Please try again.');
				}

				if (!Array.isArray(chapters) || chapters.length === 0) {
					throw new Error('AI returned an empty outline.');
				}

				let fullMarkdown = '';

				// Inject title as H1
				fullMarkdown += `# ${title || topic}\n\n`;

				// Step 2: Generate chapters in batches of 2 for parallel speedup
				const BATCH_SIZE = 2;
				const chapterResults: { chapterNumber: number; title: string; content: string }[] = [];

				for (let i = 0; i < chapters.length; i += BATCH_SIZE) {
					const batch = chapters.slice(i, i + BATCH_SIZE);

					// Emit progress for each chapter in the batch
					for (const ch of batch) {
						emit({
							status: 'writing',
							chapter: ch.chapterNumber,
							title: ch.title,
							totalChapters: chapters.length
						});
					}

					// Generate batch in parallel
					const batchResults = await Promise.all(
						batch.map(ch =>
							generateChapter(
								ch,
								chapters.length,
								topic,
								docFormat,
								effectiveStyle,
								planConfig.qualityTier,
								formatInstructions
							)
						)
					);

					// Store results in order
					chapterResults.push(...batchResults);

					// Emit progress update after batch completes
					const lastCh = batch[batch.length - 1];
					emit({
						status: 'writing',
						chapter: lastCh.chapterNumber,
						title: lastCh.title,
						totalChapters: chapters.length,
						completedChapters: chapterResults.length
					});
				}

				// Sort by chapterNumber and assemble full markdown
				chapterResults.sort((a, b) => a.chapterNumber - b.chapterNumber);
				for (const result of chapterResults) {
					fullMarkdown += result.content + '\n\n';
				}

				// Step 3: Finalizing
				emit({ status: 'finalizing' });

				// Generate a deterministic cover image URL (no external API dependency)
				const encodedTopic = encodeURIComponent(title || topic);
				const coverImageUrl = `https://placehold.co/800x1200/1a1a1a/d4a853?text=${encodedTopic.substring(0, 60)}`;

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

				clearInterval(keepaliveInterval);

				emit({
					status: 'completed',
					content: fullMarkdown.trim(),
					coverImageUrl,
					format: docFormat,
					pages: targetedPages,
				});

				controller.close();
			} catch (error: any) {
				clearInterval(keepaliveInterval);
				console.error('[generate-ebook] Error:', error);
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
