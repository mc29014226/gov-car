import { store } from '../state/store.js';

let supabaseClient = null;

export const initSupabase = (url, key) => {
  supabaseClient = supabase.createClient(url, key);
  store.sb = supabaseClient;
  return supabaseClient;
};

export const fetchAllData = async () => {
  if (!supabaseClient) return store;

  const { data: users, error: usersError } = await supabaseClient
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: records, error: recordsError } = await supabaseClient
    .from('records')
    .select('*')
    .order('dep_time', { ascending: false })
    .limit(50);

  let locations = [];
  try {
    const { data } = await supabaseClient
      .from('locations')
      .select('*')
      .order('name', { ascending: true });
    locations = data || [];
  } catch {
    locations = [];
  }

  if (usersError) console.error('讀取 users 失敗：', usersError);
  if (recordsError) console.error('讀取 records 失敗：', recordsError);

  if (!usersError) store.users = users || [];
  if (!recordsError) store.records = records || [];
  store.locations = locations || [];

  return store;
};

export const addUserToDb = async (userData) => {
  if (!supabaseClient) {
    return { error: { message: 'Supabase not initialized' } };
  }

  return await supabaseClient
    .from('users')
    .insert([userData]);
};