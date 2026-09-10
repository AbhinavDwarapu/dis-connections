import { generateText, Output } from 'ai';

import { z } from 'zod'

interface CategoryRequest {
    words: string
    categories: string
}

const categorySchema = z.object({
    category: z.string(),
})

const systemPrompt = `You name the connection between four words in a Connections-style word game. The player can pick any four words on the board, so you always return a category — refusing is not an option. The connection must be literally true of all four words, and a true plain category beats a false clever one.

Take the first rule below that holds for all four. Do not weigh the rest.
1. SAME KIND OF THING — all four are birds / landforms / tools / brands / body parts.
2. SAME MEANING — all four can mean one thing, including as verbs or slang.
3. SHARED WORD — all four go before or after one word: ___ SIGN, FIRE ___.
4. PART OF A NAME — all four appear in one film / band / brand / character / place.
5. HIDDEN WORD — CRAVEN hides RAVEN, BOUQUET hides QUE — or another wordplay you can spell out.
6. SHARED FORM — all four contain a double letter, all four end in -ER.

Return the title and nothing else: UPPERCASE, two to five words, no period, no hedge, no refusal.
Name the thing, not the machinery: HIDDEN BIRDS, not "BIRD NAMES HIDDEN OR VISIBLE". VERBS MEANING LEAD, not "GUIDE".
Use ___ for the blank in before/after titles.
Write it the way the NYT does: THINGS WITH TEETH · SLANG FOR ZERO · MOVE QUICKLY · HIDDEN BIRDS · ___ BOARD · KINDS OF PAPER · PARTS OF A RIVER.`

const hedge = /^(low|medium|high)[\s:—-]+confidence[\s:—-]*|^(cannot|could not|no)\b.*$/i

const asTitle = (category: string) => {
    const cleaned = category.replace(hedge, '').replace(/[.\s]+$/, '').trim().toUpperCase()
    return cleaned || 'UNCATEGORISED'
}

export async function POST(req: Request) {
    const { words, categories }: CategoryRequest = await req.json();

    const { output } = await generateText({
        model: "openai/gpt-5.6-luna-fast",
        reasoning: 'low',
        output: Output.object({ schema: categorySchema }),
        system: systemPrompt,
        prompt: `Find a category for these words, categories already found (do not reuse these or anything close): ${categories || 'none yet'}
Words: ${words}`,
    });

    return Response.json({ category: asTitle(output.category) })
}
