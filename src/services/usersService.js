import { store } from '../state/store.js';
export const getUsers = async () => {
  const { data, error } = await store.sb.from('users').select('*').order('name');
  if (!error) store.users = data;
  return { data, error };
};
