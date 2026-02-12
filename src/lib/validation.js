import { z } from 'zod';

// Step 1: Message validation
export const messageSchema = z.object({
    message: z.string()
        .min(10, 'Your message should be at least 10 characters')
        .max(1000, 'Message is too long (max 1000 characters)'),
    mood: z.enum(['sweet', 'nervous', 'bold', 'shy']).optional(),
    songLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Step 2: College details validation
export const collegeSchema = z.object({
    collegeName: z.string()
        .min(2, 'Please enter your college name'),
    department: z.string()
        .min(2, 'Please enter your department'),
    yearOrBatch: z.string()
        .min(1, 'Please select your year/batch'),
    section: z.string().optional(),
    recipientHint: z.string()
        .max(200, 'Hint is too long (max 200 characters)')
        .optional(),
});

// Step 3: Personal details validation
export const personalSchema = z.object({
    isAnonymous: z.boolean(),
    senderName: z.string().optional(),
    senderEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    senderPhone: z.string()
        .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
        .optional()
        .or(z.literal('')),
    senderSection: z.string().optional(),
    additionalMessage: z.string().max(200).optional(),
}).refine(
    (data) => {
        if (!data.isAnonymous) {
            return data.senderName && data.senderName.length > 0;
        }
        return true;
    },
    {
        message: 'Please enter your name or choose to remain anonymous',
        path: ['senderName'],
    }
);

// Full confession validation (combines all steps)
export const fullConfessionSchema = messageSchema
    .merge(collegeSchema)
    .merge(personalSchema);
