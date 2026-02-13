import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Eye, ArrowLeft, Share2, Music } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHaptic } from '@/hooks/useHaptic';
import { confessionAPI, supabase } from '@/lib/supabase';
import { getMusicEmbed } from '@/lib/gemini';
import { formatDate, getMoodEmoji, getSessionId } from '@/lib/utils';
import { REACTION_TYPES } from '@/lib/constants';
import toast from 'react-hot-toast';

const ViewConfession = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const haptic = useHaptic();
    const [confession, setConfession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reactions, setReactions] = useState({ hearts: 0, smiles: 0, tears: 0 });
    const [userReactions, setUserReactions] = useState(new Set());
    const [musicEmbed, setMusicEmbed] = useState(null);

    useEffect(() => {
        if (!code) return;

        const fetchConfession = async () => {
            try {
                setLoading(true);
                const data = await confessionAPI.getByCode(code);
                setConfession(data);

                // Increment views
                if (data?.id) {
                    await confessionAPI.incrementViews(data.id);

                    // Fetch reactions count
                    await fetchReactions(data.id);
                }

                // Get music embed if song link exists
                if (data?.song_link) {
                    const embed = getMusicEmbed(data.song_link);
                    setMusicEmbed(embed);
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConfession();
    }, [code]);

    const fetchReactions = async (confessionId) => {
        try {
            // Get all reactions for this confession
            const { data: reactionData, error } = await supabase
                .from('confession_reactions')
                .select('reaction_type, session_identifier')
                .eq('confession_id', confessionId);

            if (error) throw error;

            // Count reactions by type
            const counts = { hearts: 0, smiles: 0, tears: 0 };
            const sessionId = getSessionId();
            const userReacted = new Set();

            reactionData?.forEach((reaction) => {
                if (counts[reaction.reaction_type] !== undefined) {
                    counts[reaction.reaction_type]++;
                }

                // Track if current user has reacted
                if (reaction.session_identifier === sessionId) {
                    userReacted.add(reaction.reaction_type);
                }
            });

            setReactions(counts);
            setUserReactions(userReacted);
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleReaction = async (type) => {
        if (!confession?.id) return;

        // Check if user already reacted with this type
        if (userReactions.has(type)) {
            toast.error('You already reacted with this!');
            haptic.error();
            return;
        }

        try {
            haptic.medium();
            const sessionId = getSessionId();

            await confessionAPI.addReaction(confession.id, type, sessionId);

            // Update local state
            setReactions((prev) => ({
                ...prev,
                [type]: prev[type] + 1,
            }));

            setUserReactions((prev) => new Set(prev).add(type));

            // Mini celebration
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#ff4d6d'],
            });

            toast.success('Reaction added! 💝');
        } catch (error) {
            console.error('Reaction error:', error);
            toast.error('Failed to add reaction');
            haptic.error();
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Valentine's Confession",
                    text: 'Check out this confession!',
                    url: url,
                });
                haptic.success();
            } catch (error) {
                // User cancelled share
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
            haptic.success();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading confession...</p>
                </div>
            </div>
        );
    }

    if (error || !confession) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="text-6xl mb-6">💔</div>
                    <h1 className="text-2xl font-bold mb-4">Confession Not Found</h1>
                    <p className="text-gray-400 mb-8">
                        This confession doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => navigate('/search')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Search Again
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Home
                    </Button>
                    <Button variant="ghost" onClick={handleShare}>
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                    </Button>
                </div>

                {/* Main Confession Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="mb-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm mb-2">
                                    {confession.mood && getMoodEmoji(confession.mood)} {confession.mood}
                                </span>
                                <p className="text-sm text-gray-400">
                                    {formatDate(confession.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">{confession.views || 0}</span>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                {confession.message}
                            </p>
                        </div>

                        {/* Song Link */}
                        {musicEmbed && (
                            <div className="mb-6">
                                {musicEmbed.type === 'youtube' && (
                                    <div className="aspect-video rounded-xl overflow-hidden border-2 border-primary-500/20">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={musicEmbed.embedUrl}
                                            title="Song"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {musicEmbed.type === 'spotify' && (
                                    <div className="rounded-xl overflow-hidden border-2 border-primary-500/20">
                                        <iframe
                                            src={musicEmbed.embedUrl}
                                            width="100%"
                                            height="152"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                )}
                                {musicEmbed.type === 'link' && (
                                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                                        <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                            <Music className="w-4 h-4" />
                                            Song Link 🎵
                                        </p>
                                        <a
                                            href={musicEmbed.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-400 hover:text-primary-300 break-all underline"
                                        >
                                            {musicEmbed.link}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* College Info */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-400">College</p>
                                <p className="font-medium">{confession.college_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Department</p>
                                <p className="font-medium">{confession.department}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Year</p>
                                <p className="font-medium">{confession.year_or_batch}</p>
                            </div>
                        </div>

                        {/* Hints */}
                        {confession.recipient_hint && (
                            <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                                <p className="text-sm text-gray-400 mb-1">Hints:</p>
                                <p className="text-primary-300">{confession.recipient_hint}</p>
                            </div>
                        )}

                        {/* Sender Info */}
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                From:{' '}
                                <span className="text-white font-medium">
                                    {confession.is_anonymous ? 'Anonymous 🎭' : confession.sender_name}
                                </span>
                            </p>
                            {confession.additional_message && !confession.is_anonymous && (
                                <p className="text-sm text-gray-300 mt-2 italic">
                                    "{confession.additional_message}"
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Reactions */}
                    <Card className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">React to this confession</h3>
                        <div className="flex justify-center gap-4 mb-8">
                            {Object.entries(REACTION_TYPES).map(([type, emoji]) => {
                                const hasReacted = userReactions.has(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        disabled={hasReacted}
                                        className={`glass rounded-full px-6 py-3 flex items-center gap-3 transition-all ${hasReacted
                                                ? 'bg-primary-500/30 cursor-not-allowed opacity-75'
                                                : 'hover:bg-white/10 hover:scale-110 active:scale-95'
                                            }`}
                                    >
                                        <span className="text-2xl">{emoji}</span>
                                        <span className="font-semibold">{reactions[type] || 0}</span>
                                        {hasReacted && <span className="text-xs text-primary-400">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Unique Code */}
                    <div className="text-center p-6 glass rounded-2xl">
                        <p className="text-sm text-gray-400 mb-2">Unique Code:</p>
                        <p className="text-2xl font-mono font-bold text-primary-400 tracking-wider">
                            {confession.unique_code}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ViewConfession;
