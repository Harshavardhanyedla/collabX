/**
 * Profanity Filter Utility
 * Blocks inappropriate words from being posted on the site
 */

// Comprehensive list of banned words (profanity, slurs, vulgar terms)
// This list includes common variations and misspellings
const BANNED_WORDS: string[] = [
    // F-words
    'fuck', 'fucker', 'fucking', 'fucked', 'fck', 'fuk', 'fuking', 'fuckin', 'fuckoff', 'motherfucker', 'motherfucking',
    // S-words
    'shit', 'shitting', 'shitty', 'bullshit', 'sh1t', 'shiit',
    // A-words
    'ass', 'asshole', 'asses', 'arsehole', 'arse',
    // B-words
    'bitch', 'bitches', 'bitchy', 'b1tch',
    // C-words
    'cunt', 'cunts',
    // D-words
    'dick', 'dicks', 'dickhead',
    // P-words
    'piss', 'pissed', 'pissing', 'pussy', 'pussies',
    // W-words
    'whore', 'wh0re',
    // Slurs and hate speech (abbreviated/partial for safety)
    'nigger', 'nigga', 'n1gger', 'n1gga',
    'faggot', 'fag', 'faggots',
    'retard', 'retarded',
    // Other vulgar terms
    'cock', 'cocks', 'cocksucker',
    'bastard', 'bastards',
    'damn', 'damned', 'dammit',
    'crap', 'crappy',
    'slut', 'sluts', 'slutty',
    'wanker', 'wankers',
    'twat', 'twats',
    'bollocks',
    'bloody',
    'prick', 'pricks',
    'jackass',
    'dumbass',
    'douche', 'douchebag',
    // Common leetspeak variations
    'a$$', 'a$$hole', 'b!tch', 'sh!t', 'f*ck', 'p*ssy',
];

/**
 * Escapes special regex characters in a string
 */
const escapeRegex = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Checks if the given text contains any profane words
 * Uses word boundary matching to avoid false positives
 * @param text - The text to check for profanity
 * @returns Object with hasProfanity boolean and array of found words
 */
export const containsProfanity = (text: string): { hasProfanity: boolean; foundWords: string[] } => {
    if (!text || typeof text !== 'string') {
        return { hasProfanity: false, foundWords: [] };
    }

    const normalizedText = text.toLowerCase();
    const foundWords: string[] = [];

    for (const word of BANNED_WORDS) {
        // Create regex pattern with word boundaries
        // This prevents matching "class" when looking for "ass"
        const escapedWord = escapeRegex(word);
        const pattern = new RegExp(`\\b${escapedWord}\\b`, 'gi');

        if (pattern.test(normalizedText)) {
            foundWords.push(word);
        }
    }

    return {
        hasProfanity: foundWords.length > 0,
        foundWords: [...new Set(foundWords)] // Remove duplicates
    };
};

/**
 * Filters profanity from text by replacing banned words with asterisks
 * @param text - The text to filter
 * @returns The filtered text with profane words replaced by asterisks
 */
export const filterProfanity = (text: string): string => {
    if (!text || typeof text !== 'string') {
        return text;
    }

    let filteredText = text;

    for (const word of BANNED_WORDS) {
        const escapedWord = escapeRegex(word);
        const pattern = new RegExp(`\\b${escapedWord}\\b`, 'gi');
        filteredText = filteredText.replace(pattern, '*'.repeat(word.length));
    }

    return filteredText;
};

/**
 * Validates multiple text fields for profanity
 * @param fields - Object with field names as keys and text values
 * @returns Object with isValid boolean and object of field names to found words
 */
export const validateFieldsForProfanity = (fields: Record<string, string>): {
    isValid: boolean;
    invalidFields: Record<string, string[]>;
} => {
    const invalidFields: Record<string, string[]> = {};

    for (const [fieldName, text] of Object.entries(fields)) {
        if (text) {
            const result = containsProfanity(text);
            if (result.hasProfanity) {
                invalidFields[fieldName] = result.foundWords;
            }
        }
    }

    return {
        isValid: Object.keys(invalidFields).length === 0,
        invalidFields
    };
};

/**
 * Gets a user-friendly error message for profanity detection
 * @param foundWords - Array of found profane words
 * @returns User-friendly error message
 */
export const getProfanityErrorMessage = (_foundWords?: string[]): string => {
    return 'Your content contains inappropriate language. Please remove offensive words and try again.';
};
