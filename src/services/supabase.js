import { store } from '../state/store.js';
export const initSupabase = (url, key) => {
  if (typeof supabase !== 'undefined') {
    store.sb = supabase.createClient(url, key);
    return true;
  }
  return false;
};
