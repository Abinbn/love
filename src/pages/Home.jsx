import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Shield, Star, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useConfessions } from '@/hooks/useConfessions';
import { getMoodEmoji, formatDate } from '@/lib/utils';

const Home = () => {
    const [searchFilters, setSearchFilters] = useState({
        college: '',
        department: '',
        year: '',
        mood: '',
        search: '', // For name/hints search
    });
    const [showFilters, setShowFilters] = useState(false);

    const { confessions, loading } = useConfessions();

    // Filter confessions based on search criteria
    const filteredConfessions = confessions.filter((confession) => {
        if (searchFilters.college && !confession.college_name?.toLowerCase().includes(searchFilters.college.toLowerCase())) {
            return false;
        }
        if (searchFilters.department && !confession.department?.toLowerCase().includes(searchFilters.department.toLowerCase())) {
            return false;
        }
        if (searchFilters.year && !confession.year_or_batch?.toLowerCase().includes(searchFilters.year.toLowerCase())) {
            return false;
        }
        if (searchFilters.mood && confession.mood !== searchFilters.mood) {
            return false;
        }
        if (searchFilters.search) {
            const searchLower = searchFilters.search.toLowerCase();
            const matchesName = confession.sender_name?.toLowerCase().includes(searchLower);
            const matchesHint = confession.recipient_hint?.toLowerCase().includes(searchLower);
            const matchesMessage = confession.message?.toLowerCase().includes(searchLower);
            if (!matchesName && !matchesHint && !matchesMessage) {
                return false;
            }
        }
        return true;
    });

    const clearFilters = () => {
        setSearchFilters({
            college: '',
            department: '',
            year: '',
            mood: '',
            search: '',
        });
    };

    return (
        <div className="min-h-screen py-12 px-4">
            {/* Header with Logo */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-center">
                    <img
                        src="/esb-logo.png"
                        alt="eSchoolbooks"
                        className="h-12 md:h-16 object-contain opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </div>

            {/* Floating hearts background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-primary-500/20 text-4xl"
                        initial={{ y: '100vh', x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000) }}
                        animate={{
                            y: '-100vh',
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    >
                        ❤️
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                            Wish Upon a Valentine's Star
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">
                            Browse anonymous love letters or send your own 💝
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <Link to="/confess">
                            <Button className="w-full sm:w-auto">
                                <Heart className="w-5 h-5 mr-2 inline" />
                                Send a Confession
                            </Button>
                        </Link>
                        <Link to="/search">
                            <Button variant="secondary" className="w-full sm:w-auto">
                                <Search className="w-5 h-5 mr-2 inline" />
                                Search by Code
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Main Search Bar */}
                        <div className="relative mb-4">
                            <Input
                                placeholder="Search by name, hints, or message..."
                                value={searchFilters.search}
                                onChange={(e) => setSearchFilters({ ...searchFilters, search: e.target.value })}
                                className="pr-24"
                            />
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="glass rounded-2xl p-6 mb-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Advanced Filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear All
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="College"
                                        placeholder="Filter by college..."
                                        value={searchFilters.college}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, college: e.target.value })}
                                    />
                                    <Input
                                        label="Department"
                                        placeholder="Filter by department..."
                                        value={searchFilters.department}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, department: e.target.value })}
                                    />
                                    <Input
                                        label="Year/Batch"
                                        placeholder="Filter by year..."
                                        value={searchFilters.year}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, year: e.target.value })}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                                        <select
                                            value={searchFilters.mood}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, mood: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">All Moods</option>
                                            <option value="sweet">😊 Sweet</option>
                                            <option value="nervous">😳 Nervous</option>
                                            <option value="bold">😎 Bold</option>
                                            <option value="shy">🙈 Shy</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </section>

                {/* Confessions Grid */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {filteredConfessions.length} Confession{filteredConfessions.length !== 1 ? 's' : ''}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading confessions...</p>
                        </div>
                    ) : filteredConfessions.length === 0 ? (
                        <div className="text-center py-20 glass rounded-3xl">
                            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No confessions found</h3>
                            <p className="text-gray-400 mb-6">
                                {confessions.length === 0 ? 'Be the first to send a confession!' : 'Try adjusting your filters'}
                            </p>
                            {confessions.length === 0 && (
                                <Link to="/confess">
                                    <Button>Send First Confession</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredConfessions.map((confession) => (
                                <ConfessionCard key={confession.id} confession={confession} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="grid md:grid-cols-3 gap-6 mt-16"
                >
                    <div className="glass rounded-2xl p-6">
                        <Shield className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                        <h3 className="font-semibold text-lg mb-2">100% Anonymous</h3>
                        <p className="text-sm text-gray-400">
                            Your identity stays hidden unless you choose to reveal it
                        </p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <Star className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                        <h3 className="font-semibold text-lg mb-2">Browse & Search</h3>
                        <p className="text-sm text-gray-400">
                            Find confessions by college, department, or personal details
                        </p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <Heart className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                        <h3 className="font-semibold text-lg mb-2">Express Yourself</h3>
                        <p className="text-sm text-gray-400">
                            Write heartfelt messages and share your feelings
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="mt-16 py-8 px-4 text-center">
                <div className="mb-4 flex justify-center">
                    <img
                        src="/esb-logo.png"
                        alt="eSchoolbooks"
                        className="h-8 md:h-10 object-contain opacity-70 hover:opacity-100 transition-opacity"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
                <p className="text-gray-400 text-sm">Made with ❤️ for Valentine's Day 2026</p>
                <p className="text-gray-500 text-xs mt-2">Powered by eSchoolbooks</p>
            </footer>
        </div>
    );
};

// Confession Card Component
const ConfessionCard = ({ confession }) => {
    return (
        <Link to={`/confession/${confession.unique_code}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-6 h-full cursor-pointer hover:bg-white/10 transition-all"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        {confession.mood && (
                            <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs mb-2">
                                {getMoodEmoji(confession.mood)} {confession.mood}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Heart className="w-3 h-3" />
                        <span>{(confession.reactions?.hearts || 0) + (confession.reactions?.smiles || 0) + (confession.reactions?.tears || 0)}</span>
                    </div>
                </div>

                {/* Message Preview */}
                <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {confession.message}
                </p>

                {/* Info */}
                <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                        <span>🎓 {confession.college_name}</span>
                    </div>
                    {confession.department && (
                        <div>📚 {confession.department} • {confession.year_or_batch}</div>
                    )}
                    {confession.recipient_hint && (
                        <div className="text-primary-400">💡 {confession.recipient_hint.substring(0, 50)}...</div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                    <span>From: {confession.is_anonymous ? 'Anonymous 🎭' : confession.sender_name}</span>
                    <span>{formatDate(confession.created_at)}</span>
                </div>
            </motion.div>
        </Link>
    );
};

export default Home;
