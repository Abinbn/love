import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { confessionAPI } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useHaptic } from '@/hooks/useHaptic';

const Search = () => {
    const navigate = useNavigate();
    const haptic = useHaptic();
    const [code, setCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!code.trim() || code.length !== 8) {
            toast.error('Please enter a valid 8-character code');
            haptic.error();
            return;
        }

        try {
            setIsSearching(true);
            haptic.light();

            // Check if confession exists
            const confession = await confessionAPI.getByCode(code.trim().toUpperCase());

            if (confession) {
                haptic.success();
                toast.success('Confession found! 💝');
                navigate(`/confession/${confession.unique_code}`);
            } else {
                haptic.error();
                toast.error('Confession not found. Check your code and try again.');
            }
        } catch (error) {
            console.error(error);
            haptic.error();
            toast.error('Confession not found. Check your code and try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold gradient-text mb-3">
                            Find Your Letter
                        </h1>
                        <p className="text-gray-400">
                            Enter your unique 8-character code
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <Input
                                placeholder="ABC12345"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={8}
                                className="text-center text-2xl font-mono tracking-wider"
                            />
                            <p className="text-xs text-gray-400 text-center mt-2">
                                The code was provided when the confession was sent
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSearching || code.length !== 8}
                        >
                            <SearchIcon className="w-5 h-5 mr-2" />
                            {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-400 text-center">
                            Lost your code?
                            <br />
                            <span className="text-primary-500">
                                Unfortunately, there's no way to recover it. 💔
                            </span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Search;
