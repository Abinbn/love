import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Helper functions for database operations
export const confessionAPI = {
    // Create a new confession
    async createConfession(data) {
        const { data: confession, error } = await supabase
            .from('confessions')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return confession;
    },

    // Get confession by unique code
    async getByCode(code) {
        const { data, error } = await supabase
            .from('confessions')
            .select('*')
            .eq('unique_code', code)
            .single();

        if (error) throw error;
        return data;
    },

    // Get all confessions (admin only)
    async getAllConfessions(filters = {}) {
        let query = supabase
            .from('confessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.college) {
            query = query.eq('college_name', filters.college);
        }
        if (filters.department) {
            query = query.eq('department', filters.department);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Update confession (admin only)
    async updateConfession(id, updates) {
        const { data, error } = await supabase
            .from('confessions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Increment views
    async incrementViews(id) {
        const { error } = await supabase.rpc('increment_confession_views', {
            confession_id: id
        });
        if (error) throw error;
    },

    // Add reaction
    async addReaction(confessionId, reactionType, sessionId) {
        const { data, error } = await supabase
            .from('confession_reactions')
            .insert([{
                confession_id: confessionId,
                reaction_type: reactionType,
                session_identifier: sessionId
            }]);

        if (error) throw error;
        return data;
    },

    // Get statistics (admin only)
    async getStatistics() {
        const { data, error } = await supabase
            .rpc('get_confession_statistics');

        if (error) throw error;
        return data;
    }
};
