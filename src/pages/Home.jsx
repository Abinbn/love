import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Shield, Sparkles, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Floating hearts background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-primary-500/20 text-4xl"
                        initial={{ y: '100vh', x: Math.random() * window.innerWidth }}
                        animate={{
                            y: '-100vh',
                            x: Math.random() * window.innerWidth,
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

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-display font-bold gradient-text mb-6">
                            Wish Upon a Valentine's Star
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">
                            Send anonymous love letters to your college crush 💝
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
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
                                Find Your Letter
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
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
                            <h3 className="font-semibold text-lg mb-2">Unique Codes</h3>
                            <p className="text-sm text-gray-400">
                                Each confession gets a special code to find it later
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
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 text-center text-gray-400 text-sm">
                <p>Made with ❤️ for Valentine's Day 2026</p>
            </footer>
        </div>
    );
};

export default Home;
