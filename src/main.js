import { store } from './state/store.js';
import { initSupabase, fetchAllData } from './services/supabase.js';
import { showPage } from './ui/pages.js';

window.showPage = showPage;

window.selectUser = (userId) => {
  const user = store.users.find(u => u.id === userId);
  if (!user) return;

  store.selectedUser = user;
  renderUserBtns();
};

const renderUserBtns = () => {
    const container = document.getElementById('user-btns-record');
    if (!container) return;
    container.innerHTML = store.users.map(user => `
        <button class="user-btn ${store.selectedUser === user.name ? 'selected' : ''}" 
                onclick="window.selectUser(this, '${user.id}')">
            ${user.name}
        </button>
    `).join('');
};

const renderUserList = () => {
    const container = document.getElementById('user-list');
    if (!container) return;
    container.innerHTML = store.users.map(user => `
        <div class="list-item">
            <span>${user.name}</span>
        </div>
    `).join('');
};

window.addUser = async () => {
    const input = document.getElementById('new-user-name');
    const name = input.value?.trim();
    if (!name) return;
    if (store.users.some(u => u.name === name)) { alert('使用者已存在'); return; }
    const { error } = await store.sb.from('users').insert({ name, color: '#4ade80', text_color: '#052e16' });
    if (error) { alert('新增失敗'); } else {
        input.value = '';
        await fetchAllData();
        renderUserBtns();
        renderUserList();
    }
};

const bootstrap = async () => {
    const settings = JSON.parse(localStorage.getItem('car_log_settings') || '{}');
    if (settings.url && settings.key) {
        initSupabase(settings.url, settings.key);
        await fetchAllData();
        renderUserBtns();
        renderUserList();
        window.showPage('record');
    } else {
        window.showPage('settings');
    }
};

window.addEventListener('DOMContentLoaded', bootstrap);
