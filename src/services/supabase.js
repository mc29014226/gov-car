import { store } from '../state/store.js';

let supabaseClient = null;

export const initSupabase = (url, key) => {
    supabaseClient = supabase.createClient(url, key);
};

export const fetchAllData = async () => {
    if (!supabaseClient) return;
    const { data: users } = await supabaseClient.from('users').select('*').order('name');
    const { data: records } = await supabaseClient.from('records').select('*').order('depart_at', { ascending: false }).limit(20);
    const { data: locations } = await supabaseClient.from('locations').select('*').order('name');
    
    store.users = users || [];
    store.records = records || [];
    store.locations = locations || [];
    return store;
};

export const addUserToDb = async (userData) => {
    if (!supabaseClient) return { error: 'Supabase not initialized' };
    return await supabaseClient.from('users').insert([userData]);
};