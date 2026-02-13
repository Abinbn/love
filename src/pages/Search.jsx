import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useHaptic } from '@/hooks/useHaptic';
import { useConfessions } from '@/hooks/useConfessions';
import { getMoodEmoji, formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Search = () => {
    const navigate = useNavigate();
    const haptic = useHaptic();
    const [searchMode, setSearchMode] = useState('code'); // 'code' or 'filters'
    const [code, setCode] = useState('');
    const [filters, setFilters] = useState({
        college: '',
        department: '',
        year: '',
        name: '',
    });

    const { confessions, loading } = useConfessions();
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleCodeSearch = (e) => {
        e.preventDefault();
        if (!code || code.length !== 8) {
            toast.error('Please enter a valid 8-character code');
            haptic.error();
            return;
        }

        haptic.light();
        navigate(`/confession/${code.toUpperCase()}`);
    };

    const handleFilterSearch = (e) => {
        e.preventDefault();

        if (!filters.college && !filters.department && !filters.year && !filters.name) {
            toast.error('Please enter at least one search criteria');
            haptic.error();
            return;
        }

        haptic.light();

        // Filter confessions
        const results = confessions.filter((confession) => {
            if (filters.college && !confession.college_name?.toLowerCase().includes(filters.college.toLowerCase())) {
                return false;
            }
            if (filters.department && !confession.department?.toLowerCase().includes(filters.department.toLowerCase())) {
                return false;
            }
            if (filters.year && !confession.year_or_batch?.toLowerCase().includes(filters.year.toLowerCase())) {
                return false;
            }
            if (filters.name) {
                const nameLower = filters.name.toLowerCase();
                const matchesName = confession.sender_name?.toLowerCase().includes(nameLower);
                const matchesHint = confession.recipient_hint?.toLowerCase().includes(nameLower);
                if (!matchesName && !matchesHint) {
                    return false;
                }
            }
            return true;
        });

        setSearchResults(results);
        setShowResults(true);

        if (results.length === 0) {
            toast.error('No confessions found matching your criteria');
        } else {
            toast.success(`Found ${results.length} confession${results.length !== 1 ? 's' : ''}!`);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>

                    <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4 text-center">
                        Find a Confession
                    </h1>
                    <p className="text-gray-400 text-center">
                        Search by unique code or filter by details
                    </p>
                </div>

                {/* Search Mode Toggle */}
                <div className="flex gap-2 mb-8 p-1 glass rounded-full max-w-md mx-auto">
                    <button
                        onClick={() => {
                            setSearchMode('code');
                            setShowResults(false);
                        }}
                        className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${searchMode === 'code'
                                ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <SearchIcon className="w-4 h-4 inline mr-2" />
                        By Code
                    </button>
                    <button
                        onClick={() => {
                            setSearchMode('filters');
                            setShowResults(false);
                        }}
                        className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${searchMode === 'filters'
                                ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Filter className="w-4 h-4 inline mr-2" />
                        By Details
                    </button>
                </div>

                {/* Search Forms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {searchMode === 'code' ? (
                        <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold mb-6 text-center">Search by Unique Code</h2>
                            <form onSubmit={handleCodeSearch} className="space-y-6">
                                <div>
                                    <Input
                                        label="8-Character Code"
                                        placeholder="ABC12345"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        maxLength={8}
                                        className="text-center text-2xl tracking-wider font-mono"
                                    />
                                    <p className="text-sm text-gray-400 mt-2 text-center">
                                        Enter the unique code from the confession
                                    </p>
                                </div>
                                <Button type="submit" className="w-full">
                                    <SearchIcon className="w-5 h-5 mr-2" />
                                    Find Confession
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="glass rounded-3xl p-8">
                            <h2 className="text-2xl font-semibold mb-6 text-center">Search by Details</h2>
                            <form onSubmit={handleFilterSearch} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="College Name"
                                        placeholder="e.g., MIT, Harvard..."
                                        value={filters.college}
                                        onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                                    />
                                    <Input
                                        label="Department"
                                        placeholder="e.g., Computer Science..."
                                        value={filters.department}
                                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    />
                                    <Input
                                        label="Year/Batch"
                                        placeholder="e.g., 3rd Year, 2024..."
                                        value={filters.year}
                                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                    />
                                    <Input
                                        label="Name or Hints"
                                        placeholder="Search in hints or sender name..."
                                        value={filters.name}
                                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <SearchIcon className="w-5 h-5 mr-2" />
                                    Search Confessions
                                </Button>
                            </form>

                            {/* Search Results */}
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 pt-8 border-t border-white/10"
                                >
                                    <h3 className="text-xl font-semibold mb-4">
                                        {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                                    </h3>
                                    {searchResults.length === 0 ? (
                                        <p className="text-gray-400 text-center py-8">
                                            No confessions match your search criteria. Try different filters!
                                        </p>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {searchResults.map((confession) => (
                                                <Link
                                                    key={confession.id}
                                                    to={`/confession/${confession.unique_code}`}
                                                    className="glass rounded-xl p-4 hover:bg-white/10 transition-all"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        {confession.mood && (
                                                            <span className="text-sm px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full">
                                                                {getMoodEmoji(confession.mood)} {confession.mood}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(confession.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                                        {confession.message}
                                                    </p>
                                                    <div className="text-xs text-gray-400 space-y-1">
                                                        <div>🎓 {confession.college_name}</div>
                                                        {confession.department && (
                                                            <div>📚 {confession.department} • {confession.year_or_batch}</div>
                                                        )}
                                                        <div>From: {confession.is_anonymous ? 'Anonymous 🎭' : confession.sender_name}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Quick Tip */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>💡 Tip: You can also browse all confessions on the <Link to="/" className="text-primary-400 hover:text-primary-300 underline">home page</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Search;
