import { useState, useEffect } from 'react';
import { confessionAPI } from '@/lib/supabase';
import toast from 'react-hot-toast';

export const useConfessions = (filters = {}) => {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConfessions();
    }, [JSON.stringify(filters)]);

    const fetchConfessions = async () => {
        try {
            setLoading(true);
            const data = await confessionAPI.getAllConfessions(filters);
            setConfessions(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load confessions');
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchConfessions();
    };

    return { confessions, loading, error, refresh };
};

export const useConfession = (code) => {
    const [confession, setConfession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                }

                setError(null);
            } catch (err) {
                setError(err.message);
                toast.error('Confession not found');
            } finally {
                setLoading(false);
            }
        };

        fetchConfession();
    }, [code]);

    return { confession, loading, error };
};
