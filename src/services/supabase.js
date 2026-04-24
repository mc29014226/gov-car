import { store } from '../state/store.js';

export const initSupabase = (url, key) => {
    if (typeof supabase !== 'undefined') {
        store.sb = supabase.createClient(url, key);
        return true;
    }
    return false;
};

export const fetchAllData = async () => {
    if (!store.sb) return;
    try {
        const [u, r, l] = await Promise.all([
            store.sb.from('users').select('*').order('name'),
            store.sb.from('records').select('*').order('created_at', { ascending: false }),
            store.sb.from('locations').select('*').order('name').maybeSingle()
        ]);
        store.users = u.data || [];
        store.records = r.data || [];
        // 容錯處理：若 locations 為空或表不存在，不阻斷執行
        store.locations = (l && l.data) ? (Array.isArray(l.data) ? l.data : [l.data]) : [];
    } catch (e) {
        console.warn('Data sync partially failed, check table existence.', e);
    }
};