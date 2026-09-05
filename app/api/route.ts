import {
    generateText,
    Output,
} from 'ai';

import { z } from 'zod'

interface CategoryRequest {
    words: string
    categories: string
}

export async function POST(req: Request) {
    const { words, categories }: CategoryRequest = await req.json();
    console.log(words, categories)

    const { text, content } = await generateText({
        model: "openai/gpt-5.6-luna-fast",
        output: Output.object({
            schema: z.object({
                category: z.string(),
                items: z.array(z.string()),
                mechanism: z.string(),
                confidence: z.string()
            }),
        }),
        providerOptions: {
            openai: {
                textVerbosity: 'low', // Produces terse, minimal responses
            },
        },
        // providerOptions: {
        //     google: {
        //         thinkingConfig: {
        //             thinkingLevel: 'low',
        //             includeThoughts: false,
        //         },
        //     },
        // },
        prompt: `You are a category writer for a New York Times Connections-style word game.

Given exactly four words or phrases, find the strongest connection shared by all four and write a concise category title.

Rules:
- You must always return a category. "NO CLEAN CONNECTION" is not an allowed response.
- Search broadly and creatively until you find a connection that includes all four items.
- If no obvious connection exists, consider:
  - synonyms or members of the same group
  - words that precede or follow the same word
  - words within titles, names, quotations, brands, or common phrases
  - adding, removing, changing, or rearranging letters
  - homophones, anagrams, hidden words, abbreviations, or silent letters
  - shared prefixes, suffixes, spellings, sounds, or pronunciations
  - associations with a specific person, place, work, event, or concept
  - puns, rebuses, slang, dialect, and alternate meanings
- Every item must fit the suggested category.
- Do not use four unrelated explanations merely to force a category.
- If the connection is indirect, make the intermediate step explicit.
- For compound-word categories, state the shared word and whether it comes before or after each item.
- For transformations, explain the exact operation consistently.
- Use the most specific defensible category title available.
- Category titles should be short, written in uppercase, and resemble Connections category titles.
- Never decline, ask for different words, or say that no connection exists.
- Never reuse a category that has already been found, or a mechanism close enough to be mistaken for it.

Return exactly this format:

CATEGORY: [short category title]
ITEMS:
- [item]: [concise explanation of how it fits]
- [item]: [concise explanation of how it fits]
- [item]: [concise explanation of how it fits]
- [item]: [concise explanation of how it fits]
MECHANISM: [direct category, shared word, wordplay, association, etc.]
CONFIDENCE: [high, medium, or low]

Already found categories:
${categories}

Words: ${words}`,
    });

    return Response.json(text)
}