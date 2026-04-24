import { store } from './state/store.js';
import { initSupabase, fetchAllData, addUserToDb } from './services/supabase.js';
import { showPage, renderUserBtns, renderUserList } from './ui/pages.js';

window.showPage = showPage;

window.selectUser = (el, id) => {
    document.querySelectorAll('.user-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    store.selectedUser = store.users.find(u => u.id === id);
};

window.addUser = async () => {
    const input = document.getElementById('new-user-name');
    const name = input.value.trim();
    
    if (!name) return;

    if (store.users.some(u => u.name === name)) {
        alert('使用者已存在');
        return;
    }

    const newUser = {
        name,
        color: '#3b82f6',
        text_color: '#ffffff'
    };

    const { error } = await addUserToDb(newUser);
    if (error) {
        alert('新增失敗: ' + error.message);
    } else {
        input.value = '';
        await fetchAllData();
        renderUserList();
        renderUserBtns();
    }
};

const bootstrap = async () => {
    const settings = JSON.parse(localStorage.getItem('car_log_settings') || '{}');
    if (settings.url && settings.key) {
        initSupabase(settings.url, settings.key);
        await fetchAllData();
        window.showPage('record');
    } else {
        window.showPage('settings');
    }
};

window.addEventListener('DOMContentLoaded', bootstrap);