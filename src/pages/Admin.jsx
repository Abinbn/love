import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Users, Eye, Heart, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { confessionAPI } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const Admin = () => {
    const [confessions, setConfessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Get confessions
            const filterObj = filter === 'all' ? {} : { status: filter };
            const confessionsData = await confessionAPI.getAllConfessions(filterObj);
            setConfessions(confessionsData);

            // Get stats
            const statsData = await confessionAPI.getStatistics();
            setStats(statsData[0]);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await confessionAPI.updateConfession(id, { status: 'approved' });
            toast.success('Confession approved!');
            fetchData();
        } catch (error) {
            toast.error('Failed to approve confession');
        }
    };

    const handleReject = async (id) => {
        try {
            await confessionAPI.updateConfession(id, { status: 'rejected' });
            toast.error('Confession rejected');
            fetchData();
        } catch (error) {
            toast.error('Failed to reject confession');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-10 h-10 text-primary-500" />
                        <h1 className="text-4xl font-display font-bold gradient-text">
                            Admin Panel
                        </h1>
                    </div>
                    <p className="text-gray-400">Manage confessions and view statistics</p>
                </div>

                {/* Statistics */}
                {stats && (
                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        <StatCard
                            icon={<Users className="w-6 h-6" />}
                            label="Total Confessions"
                            value={stats.total_confessions || 0}
                            color="from-blue-500 to-cyan-500"
                        />
                        <StatCard
                            icon={<CheckCircle className="w-6 h-6" />}
                            label="Approved"
                            value={stats.approved_confessions || 0}
                            color="from-green-500 to-emerald-500"
                        />
                        <StatCard
                            icon={<Eye className="w-6 h-6" />}
                            label="Total Views"
                            value={stats.total_views || 0}
                            color="from-purple-500 to-pink-500"
                        />
                        <StatCard
                            icon={<Heart className="w-6 h-6" />}
                            label="Total Reactions"
                            value={stats.total_reactions || 0}
                            color="from-primary-500 to-pink-500"
                        />
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-4 mb-8">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'primary' : 'secondary'}
                            onClick={() => setFilter(f)}
                            className="capitalize"
                        >
                            {f}
                        </Button>
                    ))}
                </div>

                {/* Confessions Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Message</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">College</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {confessions.map((confession) => (
                                    <tr
                                        key={confession.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 font-mono text-sm text-primary-400">
                                            {confession.unique_code}
                                        </td>
                                        <td className="p-4 max-w-md">
                                            <p className="truncate text-sm">{confession.message}</p>
                                        </td>
                                        <td className="p-4 text-sm">{confession.college_name}</td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(confession.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${confession.status === 'approved'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : confession.status === 'rejected'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}
                                            >
                                                {confession.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {confession.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleApprove(confession.id)}
                                                        className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {confession.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleReject(confession.id)}
                                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {confessions.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No confessions found
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
        >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 text-white`}>
                {icon}
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </motion.div>
    );
};

export default Admin;
