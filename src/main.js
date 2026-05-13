import { store } from './state/store.js';
import { initSupabase, fetchAllData, addUserToDb } from './services/supabase.js';
import { showPage, renderUserBtns, renderUserList } from './ui/pages.js';

const SETTINGS_KEY = 'gov_car_sb_settings';
const OLD_SETTINGS_KEY = 'car_log_settings';

window.showPage = showPage;

window.selectUser = (userId) => {
  const user = store.users.find((u) => String(u.id) === String(userId));
  if (!user) return;

  store.selectedUser = user;
  localStorage.setItem('gov_car_last_user_id', user.id);
  renderUserBtns();
};

window.addUser = async () => {
  const input = document.getElementById('new-user-name');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  if (!store.sb) {
    alert('請先設定 Supabase 連線');
    showPage('settings');
    return;
  }

  if (store.users.some((u) => u.name === name)) {
    alert('使用者已存在');
    return;
  }

  const { error } = await addUserToDb({
    name,
    color: '#4ade80',
    text_color: '#052e16'
  });

  if (error) {
    alert('新增失敗：' + (error.message || '未知錯誤'));
    return;
  }

  input.value = '';
  await fetchAllData();
  renderUserBtns();
  renderUserList();
};

window.saveSettings = async () => {
  const urlInput = document.getElementById('sb-url');
  const keyInput = document.getElementById('sb-key');

  const url = urlInput ? urlInput.value.trim() : '';
  const key = keyInput ? keyInput.value.trim() : '';

  if (!url || !key) {
    alert('請填寫 Supabase URL 和 Key');
    return;
  }

  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ url, key }));

  initSupabase(url, key);
  await fetchAllData();

  setDbStatus(true);
  renderUserBtns();
  renderUserList();
  showPage('record');
};

function loadSettings() {
  const raw =
    localStorage.getItem(SETTINGS_KEY) ||
    localStorage.getItem(OLD_SETTINGS_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function fillSettingsInputs(settings) {
  if (!settings) return;

  const urlInput = document.getElementById('sb-url');
  const keyInput = document.getElementById('sb-key');

  if (urlInput && settings.url) urlInput.value = settings.url;
  if (keyInput && settings.key) keyInput.value = settings.key;
}

function setDbStatus(online) {
  const dot = document.getElementById('db-dot');
  const label = document.getElementById('db-label');

  if (dot) dot.className = 'status-dot ' + (online ? 'online' : 'offline');
  if (label) label.textContent = online ? '已連線' : '未連線';
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (!loading) return;

  loading.classList.add('hidden');
  setTimeout(() => {
    loading.style.display = 'none';
  }, 400);
}

async function bootstrap() {
  const settings = loadSettings();
  fillSettingsInputs(settings);

  if (settings && settings.url && settings.key) {
    initSupabase(settings.url, settings.key);
    await fetchAllData();

    const lastUserId = localStorage.getItem('gov_car_last_user_id');
    if (lastUserId) {
      const lastUser = store.users.find((u) => String(u.id) === String(lastUserId));
      if (lastUser) store.selectedUser = lastUser;
    }

    setDbStatus(true);
    renderUserBtns();
    renderUserList();
    showPage('record');
  } else {
    setDbStatus(false);
    showPage('settings');
  }

  hideLoading();
}

window.addEventListener('DOMContentLoaded', bootstrap);