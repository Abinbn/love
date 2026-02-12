export const APP_NAME = import.meta.env.VITE_APP_NAME || "Valentine's Confessions";
export const DELIVERY_DATE = import.meta.env.VITE_DELIVERY_DATE || '2026-02-14T00:00:00';
export const ENABLE_ADMIN_PANEL = import.meta.env.VITE_ENABLE_ADMIN_PANEL === 'true';

export const MOODS = [
    { value: 'sweet', label: 'Sweet & Romantic', emoji: '🥰', color: 'from-pink-400 to-rose-500' },
    { value: 'nervous', label: 'Nervous but Hopeful', emoji: '😳', color: 'from-purple-400 to-pink-500' },
    { value: 'bold', label: 'Bold & Confident', emoji: '😏', color: 'from-red-500 to-pink-600' },
    { value: 'shy', label: 'Shy & Reserved', emoji: '🙈', color: 'from-indigo-400 to-purple-500' },
];

export const YEARS = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
    { value: 'Final Year', label: 'Final Year' },
    { value: 'Alumni', label: 'Alumni' },
];

export const REACTION_TYPES = [
    { type: 'hearts', emoji: '❤️', label: 'Love' },
    { type: 'smiles', emoji: '😊', label: 'Sweet' },
    { type: 'tears', emoji: '😭', label: 'Touched' },
];

export const CONFESSION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HINT_LENGTH = 200;
export const MAX_ADDITIONAL_MESSAGE_LENGTH = 200;
