import { store } from './state/store.js';
import { initSupabase, fetchAllData } from './services/supabase.js';
import { showPage, renderUserBtns, renderUserList } from './ui/pages.js';

window.showPage = showPage;

window.selectUser = (userId) => {
  const user = store.users.find(u => String(u.id) === String(userId));
  if (!user) return;

  store.selectedUser = user;
  localStorage.setItem('gov_car_last_user_id', userId);
  renderUserBtns();
};

window.addUser = async () => {
  const input = document.getElementById('new-user-name');
  const name = input.value?.trim();
  if (!name) return;
  if (store.users.some(u => u.name === name)) { alert('使用者已存在'); return; }
  
  const { error } = await store.sb.from('users').insert({ 
    name, 
    color: '#4ade80', 
    text_color: '#052e16' 
  });
  
  if (error) {
    alert('新增失敗');
  } else {
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

    const lastUserId = localStorage.getItem('gov_car_last_user_id');
    if (lastUserId) {
      const lastUser = store.users.find(u => String(u.id) === String(lastUserId));
      if (lastUser) store.selectedUser = lastUser;
    }

    renderUserBtns();
    renderUserList();
    window.showPage('record');
  } else {
    window.showPage('settings');
  }
};

window.addEventListener('DOMContentLoaded', bootstrap);
