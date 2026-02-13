import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'your_gemini_api_key') {
    genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Enhance a confession message using Gemini AI
 * Takes user input and creates a beautiful, romantic confession
 */
export async function enhanceConfession(formData) {
    if (!genAI) {
        console.warn('Gemini API not configured. Using original message.');
        return formData.message;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `You are a romantic Valentine's Day confession writer. Transform the following confession into a beautiful, heartfelt message while keeping the original sentiment and tone.

Original Message: "${formData.message}"
Mood: ${formData.mood || 'sweet'}
College: ${formData.collegeName}
Department: ${formData.department || 'N/A'}
Year: ${formData.yearOrBatch}
${formData.recipientHint ? `Hints about recipient: ${formData.recipientHint}` : ''}

Guidelines:
- Keep it genuine and heartfelt
- Maintain the ${formData.mood || 'sweet'} mood
- Make it romantic but not overly dramatic
- Keep it under 800 characters
- Don't use overly complex vocabulary
- Make it feel personal and sincere
- DO NOT add quotes around the message
- Return ONLY the enhanced message, nothing else

Enhanced confession:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedMessage = response.text().trim();

        // Remove quotes if AI added them
        const cleanedMessage = enhancedMessage.replace(/^["']|["']$/g, '');

        return cleanedMessage;
    } catch (error) {
        console.error('Failed to enhance confession with Gemini:', error);
        // Fallback to original message
        return formData.message;
    }
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url) {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Extract Spotify track ID from URL
 */
function extractSpotifyId(url) {
    if (!url) return null;

    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

/**
 * Get embeddable music URL
 */
export function getMusicEmbed(songLink) {
    if (!songLink) return null;

    // YouTube
    const youtubeId = extractYouTubeId(songLink);
    if (youtubeId) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`,
            link: songLink
        };
    }

    // Spotify
    const spotifyId = extractSpotifyId(songLink);
    if (spotifyId) {
        return {
            type: 'spotify',
            embedUrl: `https://open.spotify.com/embed/track/${spotifyId}`,
            link: songLink
        };
    }

    // Generic link
    return {
        type: 'link',
        embedUrl: null,
        link: songLink
    };
}
