import { useEffect, useState } from 'react';

export const useHaptic = () => {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported('vibrate' in navigator);
    }, []);

    const vibrate = (pattern) => {
        if (isSupported && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    return {
        isSupported,
        light: () => vibrate(10),
        medium: () => vibrate(20),
        heavy: () => vibrate(30),
        success: () => vibrate([10, 50, 10]),
        error: () => vibrate([50, 100, 50]),
        double: () => vibrate([10, 100, 10]),
    };
};
