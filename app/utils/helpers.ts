export async function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const shuffle = (words: Record<string, boolean>) => {
    const wordsArray = Array.from(Object.keys(words));

    for (let i = wordsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsArray[i], wordsArray[j]] = [wordsArray[j], wordsArray[i]];
    }

    const wordsObject = {}

    for (let i = 0; i < wordsArray.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (wordsObject as any)[wordsArray[i]] = words[wordsArray[i]]
    }

    return wordsObject;
}

export const deselectAll = (words: Record<string, boolean>) => {
    for (const [key] of Object.entries(words)) {
        words[key] = false
    }
    return words
}

export const moveSelectionToTopRow = (words: Record<string, boolean>, currentlySelected: string[]) => {
    const newWords = {};

    for (const word of currentlySelected) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newWords as any)[word] = words[word]
    }

    for (const word of Object.keys(words)) {
        if (word in currentlySelected) continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newWords as any)[word] = words[word]
    }

    return newWords;
}

export const removeTopRow = (words: Record<string, boolean>, currentlySelected: string[]) => {
    const newWords = structuredClone(words);

    for (const selection of currentlySelected) {
        delete newWords[selection]
    }

    return newWords;
}