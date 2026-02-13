import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHaptic } from '@/hooks/useHaptic';
import { confessionAPI } from '@/lib/supabase';
import { messageSchema, collegeSchema, personalSchema } from '@/lib/validation';
import { generateUniqueCode, getMoodEmoji } from '@/lib/utils';
import { MOODS, YEARS, MAX_MESSAGE_LENGTH } from '@/lib/constants';

const Confess = () => {
    const navigate = useNavigate();
    const haptic = useHaptic();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useLocalStorage('confession_draft', {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalSteps = 4;

    // Step 1: Message form
    const step1Form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: formData,
    });

    // Step 2: College details form
    const step2Form = useForm({
        resolver: zodResolver(collegeSchema),
        defaultValues: formData,
    });

    // Step 3: Personal details form
    const step3Form = useForm({
        resolver: zodResolver(personalSchema),
        defaultValues: { isAnonymous: true, ...formData },
    });

    const handleNext = async () => {
        haptic.light();
        let isValid = false;

        if (currentStep === 1) {
            isValid = await step1Form.trigger();
            if (isValid) {
                setFormData({ ...formData, ...step1Form.getValues() });
            }
        } else if (currentStep === 2) {
            isValid = await step2Form.trigger();
            if (isValid) {
                setFormData({ ...formData, ...step2Form.getValues() });
            }
        } else if (currentStep === 3) {
            isValid = await step3Form.trigger();
            if (isValid) {
                setFormData({ ...formData, ...step3Form.getValues() });
            }
        }

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        haptic.light();
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Map form data to database schema
            const finalData = {
                message: formData.message,
                mood: formData.mood || null,
                song_link: formData.songLink || null,
                college_name: formData.collegeName,
                department: formData.department || null,
                year_or_batch: formData.yearOrBatch,
                section: formData.section || null,
                recipient_hint: formData.recipientHint || null,
                is_anonymous: formData.isAnonymous !== false, // Default true
                sender_name: formData.isAnonymous ? null : (formData.senderName || null),
                sender_email: formData.isAnonymous ? null : (formData.senderEmail || null),
                sender_phone: formData.isAnonymous ? null : (formData.senderPhone || null),
                sender_section: formData.isAnonymous ? null : (formData.senderSection || null),
                additional_message: formData.isAnonymous ? null : (formData.additionalMessage || null),
                unique_code: generateUniqueCode(),
                status: 'approved', // Auto-approve
            };

            console.log('Submitting confession:', finalData);
            const confession = await confessionAPI.createConfession(finalData);
            console.log('Confession created:', confession);

            // Clear draft
            setFormData({});

            // Celebrate!
            haptic.success();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4d6d', '#ff758f', '#ffb3c1'],
            });

            toast.success('Confession sent! 💝');

            // Navigate to view page
            setTimeout(() => {
                navigate(`/confession/${confession.unique_code}`);
            }, 2000);
        } catch (error) {
            console.error('Submission error:', error);
            haptic.error();
            toast.error(`Failed to send confession: ${error.message || 'Please check your Supabase connection'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
                        Send Your Confession
                    </h1>
                    <p className="text-gray-400">
                        Step {currentStep} of {totalSteps}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${step <= currentStep
                                    ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white'
                                    : 'bg-white/10 text-gray-500'
                                    }`}
                            >
                                {step < currentStep ? <Check className="w-5 h-5" /> : step}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-pink-500"
                            initial={{ width: '25%' }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form Steps */}
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <Step1Message form={step1Form} key="step1" />
                    )}
                    {currentStep === 2 && (
                        <Step2College form={step2Form} key="step2" />
                    )}
                    {currentStep === 3 && (
                        <Step3Personal form={step3Form} key="step3" />
                    )}
                    {currentStep === 4 && (
                        <Step4Preview data={formData} key="step4" />
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-4 justify-between mt-8">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-primary-500 text-primary-400 font-semibold transition-all hover:bg-primary-500/10 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>
                    )}
                    <div className="flex-1" />
                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/50 active:scale-95"
                        >
                            <span>Next</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isSubmitting ? 'Sending...' : 'Send Confession'} 💝</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Step 1: Message
const Step1Message = ({ form }) => {
    const { register, formState: { errors }, watch } = form;
    const message = watch('message') || '';
    const selectedMood = watch('mood');

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Write Your Heart Out 💝</h2>

                <Textarea
                    label="Your Message"
                    placeholder="Dear someone special..."
                    rows={8}
                    maxLength={MAX_MESSAGE_LENGTH}
                    showCount
                    value={message}
                    error={errors.message?.message}
                    {...register('message')}
                />

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        How are you feeling?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {MOODS.map((mood) => (
                            <label
                                key={mood.value}
                                className={`glass rounded-xl p-4 cursor-pointer transition-all ${selectedMood === mood.value
                                    ? 'bg-primary-500/20 border-2 border-primary-500'
                                    : 'hover:bg-white/10 border-2 border-transparent'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={mood.value}
                                    {...register('mood')}
                                    className="sr-only"
                                />
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{mood.emoji}</span>
                                    <div>
                                        <div className="font-medium">{mood.label}</div>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <Input
                    label="Song Link (Optional)"
                    placeholder="https://spotify.com/..."
                    error={errors.songLink?.message}
                    {...register('songLink')}
                    className="mt-6"
                />
            </div>
        </motion.div>
    );
};

// Step 2: College Details
const Step2College = ({ form }) => {
    const { register, formState: { errors }, watch } = form;
    const recipientHint = watch('recipientHint') || '';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-semibold mb-6">College Details 🎓</h2>

                <div className="space-y-4">
                    <Input
                        label="College Name"
                        placeholder="Your college name"
                        error={errors.collegeName?.message}
                        {...register('collegeName')}
                    />

                    <Input
                        label="Department"
                        placeholder="e.g., Computer Science"
                        error={errors.department?.message}
                        {...register('department')}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Year / Batch <span className="text-primary-500">*</span>
                        </label>
                        <select
                            {...register('yearOrBatch')}
                            className="input-field"
                        >
                            <option value="">Select Year/Batch</option>
                            {YEARS.map((year) => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                        {errors.yearOrBatch && (
                            <p className="mt-1 text-sm text-red-400">{errors.yearOrBatch.message}</p>
                        )}
                    </div>

                    <Input
                        label="Section (Optional)"
                        placeholder="e.g., A, B, C"
                        {...register('section')}
                    />

                    <Textarea
                        label="Recipient Hints (Optional)"
                        placeholder="e.g., sits in third row, always wears blue..."
                        rows={3}
                        maxLength={200}
                        showCount
                        value={recipientHint}
                        error={errors.recipientHint?.message}
                        {...register('recipientHint')}
                    />
                </div>
            </div>
        </motion.div>
    );
};

// Step 3: Personal Details
const Step3Personal = ({ form }) => {
    const { register, formState: { errors }, watch } = form;
    const isAnonymous = watch('isAnonymous');
    const additionalMessage = watch('additionalMessage') || '';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Your Identity 🎭</h2>

                <label className="flex items-center gap-3 p-4 glass rounded-xl cursor-pointer mb-6">
                    <input
                        type="checkbox"
                        {...register('isAnonymous')}
                        className="w-5 h-5 rounded border-gray-600"
                    />
                    <span className="font-medium">Send Anonymously</span>
                </label>

                {!isAnonymous && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                    >
                        <Input
                            label="Your Name"
                            placeholder="Your name"
                            error={errors.senderName?.message}
                            {...register('senderName')}
                        />

                        <Input
                            label="Email (Optional)"
                            type="email"
                            placeholder="your.email@example.com"
                            error={errors.senderEmail?.message}
                            {...register('senderEmail')}
                        />

                        <Input
                            label="Phone (Optional)"
                            placeholder="1234567890"
                            error={errors.senderPhone?.message}
                            {...register('senderPhone')}
                        />

                        <Input
                            label="Your Section (Optional)"
                            placeholder="e.g., A, B, C"
                            {...register('senderSection')}
                        />

                        <Textarea
                            label="Additional Message (Optional)"
                            placeholder="Anything else you want to say..."
                            rows={3}
                            maxLength={200}
                            showCount
                            value={additionalMessage}
                            error={errors.additionalMessage?.message}
                            {...register('additionalMessage')}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// Step 4: Preview
const Step4Preview = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Preview Your Confession ✨</h2>

                <div className="space-y-4 text-gray-300">
                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-sm text-gray-400 mb-2">Message {data.mood && getMoodEmoji(data.mood)}</p>
                        <p className="whitespace-pre-wrap">{data.message}</p>
                    </div>

                    {data.songLink && (
                        <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">Song Link 🎵</p>
                            <a
                                href={data.songLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-300 break-all"
                            >
                                {data.songLink}
                            </a>
                        </div>
                    )}

                    {data.recipientHint && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">Hints for Recipient 💡</p>
                            <p className="text-purple-300">{data.recipientHint}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">College</p>
                            <p className="font-medium">{data.collegeName}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">Department</p>
                            <p className="font-medium">{data.department}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">Year</p>
                            <p className="font-medium">{data.yearOrBatch}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-gray-400 mb-1">From</p>
                            <p className="font-medium">{data.isAnonymous ? 'Anonymous 🎭' : data.senderName}</p>
                        </div>
                    </div>

                    {!data.isAnonymous && data.additionalMessage && (
                        <div className="p-4 bg-white/5 rounded-xl border border-primary-500/20">
                            <p className="text-sm text-gray-400 mb-1">Additional Message</p>
                            <p className="italic text-gray-300">"{data.additionalMessage}"</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Confess;
