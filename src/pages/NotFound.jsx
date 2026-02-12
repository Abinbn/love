import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartCrack } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <HeartCrack className="w-24 h-24 text-primary-500 mx-auto mb-6 animate-pulse" />
                <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                <p className="text-xl text-gray-300 mb-8">
                    Oops! This page got lost in the love letters...
                </p>
                <Link to="/">
                    <Button>Return Home</Button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
