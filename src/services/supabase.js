import { store } from '../state/store.js';
export const loadSettingsFromLocal = () => JSON.parse(localStorage.getItem('car_log_settings') || '{}');
export const saveSettingsToLocal = (url, key) => localStorage.setItem('car_log_settings', JSON.stringify({ url, key }));
export const initSupabase = (url, key) => {
    if (typeof supabase !== 'undefined') {
        store.sb = supabase.createClient(url, key);
        return true;
    }
    return false;
};
export const fetchAllData = async () => {
    const [u, r, l] = await Promise.all([
        store.sb.from('users').select('*').order('name'),
        store.sb.from('records').select('*').order('created_at', { ascending: false }),
        store.sb.from('locations').select('*').order('name')
    ]);
    store.users = u.data || [];
    store.records = r.data || [];
    store.locations = l.data || [];
};
export const setDbStatus = (online) => {
    const el = document.getElementById('db-label');
    if(el) el.innerText = online ? '已連線' : '未連線';
};