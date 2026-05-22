import { store } from '../state/store.js';

export const showPage = (pageId) => {
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.remove('active');
  });

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach((item) => {
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

  container.innerHTML = '';

  if (!store.users || store.users.length === 0) {
    const empty = document.createElement('span');
    empty.style.fontSize = '13px';
    empty.style.color = 'var(--text3)';
    empty.textContent = '尚未建立使用者，請先至「使用者管理」新增';
    container.appendChild(empty);
    return;
  }

  store.users.forEach((user) => {
    const btn = document.createElement('button');
    btn.className = 'user-btn';

    if (store.selectedUser && String(store.selectedUser.id) === String(user.id)) {
      btn.classList.add('selected');
    }

    btn.style.background = user.color || '#4ade80';
    btn.style.color = user.text_color || '#052e16';
    btn.textContent = user.name || '';

    btn.addEventListener('click', () => {
      window.selectUser(user.id);
    });

    container.appendChild(btn);
  });
};

export const renderUserList = () => {
  const container = document.getElementById('user-list');
  if (!container) return;

  container.innerHTML = '';

  if (!store.users || store.users.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '尚未建立使用者';
    container.appendChild(empty);
    return;
  }

  store.users.forEach((user) => {
    const row = document.createElement('div');
    row.className = 'user-list-item';

    const circle = document.createElement('div');
    circle.className = 'user-circle';
    circle.style.background = user.color || '#4ade80';
    circle.style.color = user.text_color || '#052e16';
    circle.textContent = user.name ? user.name.charAt(0) : '?';

    const name = document.createElement('span');
    name.style.flex = '1';
    name.style.fontSize = '15px';
    name.style.fontWeight = '500';
    name.textContent = user.name || '';

    row.appendChild(circle);
    row.appendChild(name);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-sm btn-danger';
    delBtn.textContent = '刪除';
    delBtn.style.marginLeft = '10px';
    delBtn.addEventListener('click', () => {
      if (window.removeUser) window.removeUser(user.id, user.name);
    });
    row.appendChild(delBtn);

    container.appendChild(row);
  });
};
