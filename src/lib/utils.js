// Generate unique 8-character code
export const generateUniqueCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Format date
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

// Get session identifier (for anonymous reactions)
export const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
};

// Check if Valentine's Day has passed
export const isValentinesDayPassed = () => {
    const deliveryDate = new Date(import.meta.env.VITE_DELIVERY_DATE || '2026-02-14');
    return new Date() >= deliveryDate;
};

// Get countdown to Valentine's Day
export const getCountdown = () => {
    const deliveryDate = new Date(import.meta.env.VITE_DELIVERY_DATE || '2026-02-14');
    const now = new Date();
    const diff = deliveryDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get mood emoji
export const getMoodEmoji = (mood) => {
    const moods = {
        sweet: '🥰',
        nervous: '😳',
        bold: '😏',
        shy: '🙈'
    };
    return moods[mood] || '💝';
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
