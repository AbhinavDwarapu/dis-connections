import { generateText, Output } from 'ai';
import { getCache } from '@vercel/functions'
import { after } from 'next/server'

import { z } from 'zod'

import { localCache, toCacheKey } from '../utils/localCache'
import { initialWords } from '../utils/initialsWords';

interface CategoryRequest {
    words: string
    categories: string
}

const model = "openai/gpt-5.6-luna-fast"

const categorySchema = z.object({
    category: z.string(),
})

const verificationSchema = z.object({
    fits: z.boolean(),
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

const verificationSystemPrompt = `You check the title for four words in a Connections-style word game. The player can pick any four words on the board, so the title must find a real link: true of all four, and narrow enough that almost any other word would fail it.

A title passes only if it is:
1. TRUE — each word fits on a reading a solver would accept, including verb, slang or name senses. Do not reject on a technicality.
2. SPECIFIC — of five random words (TABLE, RUN, HAPPY, CLOUD, PENCIL), at most one would fit.
NOUNS, COMMON WORDS, THINGS, FIVE-LETTER WORDS, NATURE and the like never pass. If that is all you can find, keep looking.

If the draft passes, set fits to true and return it unchanged. Otherwise set fits to false and fix it: narrow or repair the draft first, and if that fails, take the first link below that holds for all four.
1. SHARED WORD — all four go before or after one word: ___ SIGN, FIRE ___.
2. HIDDEN WORD — LANTERN hides TERN, CHARM hides ARM — or another wordplay you can spell out.
3. SAME MEANING — all four can mean one thing, including as verbs or slang.
4. PART OF A NAME — all four appear in one film / band / brand / character / place.
5. NARROW KIND OF THING — PARTS OF A SHOE, MOUNTAIN FEATURES, not LANDSCAPES.
6. SAME SCENE — all four belong somewhere specific: SEEN AT A HARBOR, ON A SKI SLOPE.
7. SHARED FORM — all four contain a double letter, all four end in -ER.

Return the title and nothing else: UPPERCASE, two to five words, no period, no hedge, no refusal.
Name the thing, not the machinery: HIDDEN BIRDS, not "BIRD NAMES HIDDEN OR VISIBLE". VERBS MEANING LEAD, not "GUIDE".
Use ___ for the blank in before/after titles.
Write it the way the NYT does: THINGS WITH TEETH · SLANG FOR ZERO · MOVE QUICKLY · HIDDEN BIRDS · ___ BOARD · KINDS OF PAPER · PARTS OF A RIVER.`

const hedge = /^(low|medium|high)[\s:—-]+confidence[\s:—-]*|^(cannot|could not|no)\b.*$/i

const asTitle = (category: string) => {
    const cleaned = category.replace(hedge, '').replace(/[.\s]+$/, '').trim().toUpperCase()
    return cleaned || 'UNCATEGORISED'
}

const remoteCache = getCache({ namespace: 'category' })

const readCachedCategory = async (cacheKey: string) => {
    const localCategory = localCache.get(cacheKey)
    if (localCategory) return localCategory

    const remoteCategory: unknown | null = await remoteCache.get(cacheKey)
    return typeof remoteCategory === 'string' ? remoteCategory : undefined
}

const verifyAndCache = async (cacheKey: string, words: string, category: string) => {
    const startedAt = performance.now()
    const { output } = await generateText({
        model,
        reasoning: 'medium',
        output: Output.object({ schema: verificationSchema }),
        system: verificationSystemPrompt,
        prompt: `Words: ${words}
Draft title: ${category}`,
    })

    const verifiedCategory = output.fits ? category : asTitle(output.category)
    await remoteCache.set(cacheKey, verifiedCategory)

    const elapsedMs = Math.round(performance.now() - startedAt)
    console.log(`verifyAndCache: ${elapsedMs}ms`)
}

export async function POST(req: Request) {
    const { words, categories }: CategoryRequest = await req.json();

    const selectedWords = words.split(' ')
    const isOnBoard = (word: string) => Object.hasOwn(initialWords, word)
    const isFourDistinctBoardWords = new Set(selectedWords).size === 4 && selectedWords.every(isOnBoard)

    if (!isFourDistinctBoardWords) return Response.json({ error: 'Selection must be four distinct words from the board' }, { status: 400 })


    const cacheKey = toCacheKey(selectedWords)
    const cachedCategory = await readCachedCategory(cacheKey)
    const isAlreadyFound = cachedCategory !== undefined && categories.split(',').includes(cachedCategory)

    if (cachedCategory && !isAlreadyFound) return Response.json({ category: cachedCategory })

    const { output } = await generateText({
        model,
        reasoning: 'low',
        output: Output.object({ schema: categorySchema }),
        system: systemPrompt,
        prompt: `Find a category for these words, categories already found (do not reuse these or anything close): ${categories || 'none yet'}
Words: ${words}`,
    });

    const category = asTitle(output.category)
    after(() => verifyAndCache(cacheKey, words, category))

    return Response.json({ category })
}
