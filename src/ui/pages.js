import { store } from '../state/store.js';
export const showPage = (name) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + name);
    if(el) el.classList.add('active');
};
export const setDefaultTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.querySelectorAll('input[type="datetime-local"]').forEach(i => i.value = now.toISOString().slice(0, 16));
};
export const loadLastKm = () => {
    const last = store.records.find(r => r.status === 'done');
    if (last && document.getElementById('dep-km')) document.getElementById('dep-km').value = last.arr_km;
};
export const hideLoading = () => {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'none';
};