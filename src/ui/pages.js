import { store } from '../state/store.js';

export const showPage = (pageId) => {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const pages = ['record', 'return', 'history', 'stats', 'users', 'settings'];
  const index = pages.indexOf(pageId);
  const navItems = document.querySelectorAll('.nav-item');
  if (index >= 0 && navItems[index]) {
    navItems[index].classList.add('active');
  }

  if (pageId === 'record') renderUserBtns();
  if (pageId === 'users') renderUserList();
};

export const renderUserBtns = () => {
  const container = document.getElementById('user-btns-record');
  if (!container) return;

  if (!store.users || store.users.length === 0) {
    container.innerHTML = '<span style="font-size:13px;color:var(--text3)">尚未建立使用者，請先至「使用者管理」新增</span>';
    return;
  }

  container.innerHTML = store.users.map(user => `
    <button
      class="user-btn ${store.selectedUser?.id === user.id ? 'selected' : ''}"
      style="background:${user.color};color:${user.text_color}"
      onclick="window.selectUser('${user.id}')"
    >
      ${user.name}
    </button>
  `).join('');
};

export const renderUserList = () => {
  const container = document.getElementById('user-list');
  if (!container) return;

  if (!store.users || store.users.length === 0) {
    container.innerHTML = '<div class="empty">尚未建立使用者</div>';
    return;
  }

  container.innerHTML = store.users.map(user => `
    <div class="user-list-item">
      <div class="user-circle" style="background:${user.color};color:${user.text_color}">
        ${user.name.charAt(0)}
      </div>
      <span style="flex:1;font-size:15px;font-weight:500">${user.name}</span>
    </div>
  `).join('');
};
