import { store } from './state/store.js';
import { initSupabase, fetchAllData, addUserToDb } from './services/supabase.js';
import { showPage, renderUserBtns, renderUserList } from './ui/pages.js';

const SETTINGS_KEY = 'gov_car_sb_settings';
const OLD_SETTINGS_KEY = 'car_log_settings';

window.showPage = showPage;

function bindNavigation() {
  const navMap = ['record', 'return', 'history', 'stats', 'users', 'settings'];
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item, index) => {
    const pageId = navMap[index];
    if (!pageId) return;

    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      showPage(pageId);
    });
  });
}

window.selectUser = (userId) => {
  const user = store.users.find((u) => String(u.id) === String(userId));
  if (!user) return;

  store.selectedUser = user;
  localStorage.setItem('gov_car_last_user_id', user.id);
  renderUserBtns();
};

window.toggleCheck = (label) => {
  setTimeout(() => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    label.classList.toggle('checked', !!checkbox?.checked);
  }, 0);
};

window.submitDepart = async () => {
  if (!store.sb) {
    alert('請先設定 Supabase 連線');
    showPage('settings');
    return;
  }

  if (!store.selectedUser) {
    alert('請先選擇使用者');
    return;
  }

  const depTimeInput = document.getElementById('dep-time');
  const depKmInput = document.getElementById('dep-km');
  const depLocInput = document.getElementById('dep-loc');
  const purposeInput = document.getElementById('dep-purpose');

  const depTime = depTimeInput ? depTimeInput.value : '';
  const depKm = depKmInput ? parseFloat(depKmInput.value) || 0 : 0;
  const depLoc = depLocInput ? depLocInput.value.trim() : '';
  const purpose = purposeInput ? purposeInput.value.trim() : '';

  if (!depTime) {
    alert('請填寫出發時間');
    return;
  }

  if (!depLoc) {
    alert('請填寫出發地點');
    return;
  }

  if (!purpose) {
    alert('請填寫用途 / 事由');
    return;
  }

  const checks = Array.from(
    document.querySelectorAll('#check-grid input[type="checkbox"]:checked')
  ).map((input) => input.value);

  const { error } = await store.sb.from('records').insert({
    user_name: store.selectedUser.name,
    status: 'pending',
    dep_time: new Date(depTime).toISOString(),
    dep_km: depKm,
    dep_loc: depLoc,
    purpose,
    checks
  });

  if (error) {
    console.error('出車登記失敗：', error);
    alert('出車登記失敗：' + (error.message || '未知錯誤'));
    return;
  }

  alert('出車登記成功');

  if (depLocInput) depLocInput.value = '';
  if (purposeInput) purposeInput.value = '';

  document.querySelectorAll('#check-grid input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });

  document.querySelectorAll('#check-grid .check-item').forEach((item) => {
    item.classList.remove('checked');
  });

  await fetchAllData();
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

  try {
    initSupabase(url, key);
    await fetchAllData();

    setDbStatus(true);
    renderUserBtns();
    renderUserList();
    showPage('record');
  } catch (error) {
    console.error('Supabase 連線失敗：', error);
    setDbStatus(false);
    alert('連線失敗，請確認 Supabase URL 和 Key');
  }
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
  bindNavigation();
  
  const settings = loadSettings();
  fillSettingsInputs(settings);

  if (settings && settings.url && settings.key) {
    try {
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
    } catch (error) {
      console.error('初始化 Supabase 失敗：', error);
      setDbStatus(false);
      showPage('settings');
    }
  } else {
    setDbStatus(false);
    showPage('settings');
  }

  hideLoading();
}

window.addEventListener('DOMContentLoaded', bootstrap);
