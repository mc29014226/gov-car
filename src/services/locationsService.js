import { store } from '../state/store.js';
export const getLocations = async () => {
  const { data, error } = await store.sb.from('locations').select('*').order('name');
  if (!error) store.locations = data;
  return { data, error };
};
