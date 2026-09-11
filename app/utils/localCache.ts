export const toCacheKey = (words: string[]) => [...words].sort().join(' ')

export const localCache = new Map([
    [toCacheKey(['CANYON', 'ECHO', 'FALCON', 'SUMMIT']), 'CAR MODELS'],
    [toCacheKey(['BREEZE', 'ECHO', 'FALCON', 'SUMMIT']), 'CAR MODELS'],
    [toCacheKey(['BREEZE', 'CANYON', 'FALCON', 'SUMMIT']), 'CAR MODELS'],
    [toCacheKey(['BREEZE', 'CANYON', 'ECHO', 'SUMMIT']), 'CAR MODELS'],
    [toCacheKey(['BREEZE', 'CANYON', 'ECHO', 'FALCON']), 'CAR MODELS'],

    [toCacheKey(['BREEZE', 'PEBBLE', 'PUZZLE', 'QUARRY']), 'DOUBLE LETTERS'],
    [toCacheKey(['PEBBLE', 'PUZZLE', 'QUARRY', 'SUMMIT']), 'DOUBLE LETTERS'],
    [toCacheKey(['BREEZE', 'PUZZLE', 'QUARRY', 'SUMMIT']), 'DOUBLE LETTERS'],
    [toCacheKey(['BREEZE', 'PEBBLE', 'QUARRY', 'SUMMIT']), 'DOUBLE LETTERS'],
    [toCacheKey(['BREEZE', 'PEBBLE', 'PUZZLE', 'SUMMIT']), 'DOUBLE LETTERS'],

    [toCacheKey(['CANYON', 'GLACIER', 'HARBOR', 'MEADOW']), 'GEOGRAPHICAL FEATURES'],
    [toCacheKey(['CANYON', 'GLACIER', 'MEADOW', 'SUMMIT']), 'GEOGRAPHICAL FEATURES'],
    [toCacheKey(['CANYON', 'GLACIER', 'HARBOR', 'SUMMIT']), 'GEOGRAPHICAL FEATURES'],
    [toCacheKey(['CANYON', 'HARBOR', 'MEADOW', 'SUMMIT']), 'GEOGRAPHICAL FEATURES'],
    [toCacheKey(['GLACIER', 'HARBOR', 'MEADOW', 'SUMMIT']), 'GEOGRAPHICAL FEATURES'],

    [toCacheKey(['CANYON', 'FALCON', 'LANTERN', 'WHISPER']), 'SPELLED WITH ELEMENT SYMBOLS'],
    [toCacheKey(['CANYON', 'LANTERN', 'MEADOW', 'ORBIT']), 'STARTING WITH STATE ABBREVIATIONS'],
    [toCacheKey(['CANYON', 'LANTERN', 'MEADOW', 'VELVET']), 'STARTING WITH ROMAN NUMERALS'],

    [toCacheKey(['ORBIT', 'GLACIER', 'TIMBER', 'CANYON']), 'REMOVING A LETTER STILL MAKES A WORD'],
    [toCacheKey(['ECHO', 'GLACIER', 'FALCON', 'CANYON']), 'CONTAINS THE ROMAN NUMERAL FOR 100'],
    [toCacheKey(['GLACIER', 'HARBOR', 'SUMMIT', 'VELVET']), 'HIDDEN BACKWARDS NAMES'],
    [toCacheKey(['HARBOR', 'LANTERN', 'MEADOW', 'TIMBER']), 'WORDS BEFORE ANIMALS'],
])
