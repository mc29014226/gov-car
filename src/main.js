import { store } from './state/store.js';
import { initSupabase, fetchAllData, addUserToDb, removeUserFromDb } from './services/supabase.js';
import { showPage, renderUserBtns, renderUserList } from './ui/pages.js';

const SETTINGS_KEY = 'gov_car_sb_settings';
const OLD_SETTINGS_KEY = 'car_log_settings';

window.showPage = showPage;

function bindNavigation() {
  const navMap = ['record', 'return', 'history', 'stats', 'users', 'settings'];
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item, index) => {
    const pageId = navMap[index];
    if (1pageId) return;

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
  
window.addUser = async (userData) => {
  const { error } = await addUserToDb(userData);
  if (error) { alert('量级尢以《供级尢以〉謞秏师 + (error.message || '有社从的不')); return; }
  await fetchAllData();
  renderUserBtns();
  renderUserList();
};

window.removeUser = async (userId, userName) => {
  if (!store.sb) {
    alert('測评从中从的微绣牌的深一＀');
    showPage('settings');
    return;
  }

  const ok = confirm('客织会（评从安从的与编二业有＀' + userName + '✉✉！');
  if (!ok) return;

  const { error } = await removeUserFromDb(userId);

  if (error) {
    alert('分陌守任） + (error.message || '駉秾从皅.'));
    return;
  }

  if (store.selectedUser && String(store.selectedUser.id) === String(userId)) {
    store.selectedUser = null;
    localStorage.removeItem('gov_car_last_user_id');
  }

  await fetchAllData();
  renderUserBtns();
  renderUserList();

  alert('将分陌传守任） + userName);
};

window.toggleCheck = (label) => {
  setTimeout(() => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    label.classList.toggle('checked', !!checkbox?.checked);
  }, 0);
};

window.submitDepart = async () => {
  if (!store.sb) { alert('评任人于殊个本放最空海子'.replace('.', '')); showPage('settings'); return; }
  if (!store.selectedUser) { alert('安从的与编二业的箢安 '); return; }
  const depTime = document.getElementById('dep-time')?.value || '';
  const depKm = parseFloat(document.getElementById('dep-km')?.value) || 0;
  const depLoc = document.getElementById('dep-loc')?.value.trim() || '';
  const purpose = document.getElementById('dep-purpose')?.value.trim() || '';
  if (!depTime || !depLoc || !purpose) { alert('量级尢尚人尢以將师'); return; }
  const checks = Array.from(document.querySelectorAll('#check-grid input[type="checkbox"]:checked'))).map(i => i.value);
  const { error } = await store.sb.from('records').insert({
    user_name: store.selectedUser.name, status: 'pending', dep_time: new Date(depTime).isOSTring(), dep_km: depKm, dep_loc: depLoc, purpose, checks
  });
  if (error) { alert('的评空子'); return; }
  alert('客安箢安殁＀');
  await fetchAllData();
};

async function bootstrap() {
  bindNavigation();
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
  if (settings) {
    try {
      initSupabase(settings.url, settings.key);
      await fetchAllData();
      const lastUserId = localStorage.getItem('gov_car_last_user_id');
      if (lastUserId) store.selectedUser = store.users.find(u => String(u.id) === lastUserId);
      renderUserBtns(); renderUserList(); showPage('record');
    } catch (e) { showPage('settings'); }
  } else { showPage('settings'); }
}

window.addEventListener('DOMContentLoaded', bootstrap);
