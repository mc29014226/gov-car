import { store } from '../state/store.js';

export const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    if (pageId === 'record') renderUserBtns();
    if (pageId === 'settings') renderUserList();
};

export const renderUserBtns = () => {
    const container = document.getElementById('user-btns');
    if (!container) return;
    container.innerHTML = store.users.map(user => `
        <button class="user-btn" onclick="selectUser(this, '${user.id}')" 
                style="border-color: ${user.color}; color: ${user.color}">
            ${user.name}
        </button>
    `).join('');
};

export const renderUserList = () => {
    const container = document.getElementById('user-list');
    if (!container) return;
    container.innerHTML = store.users.map(user => `
        <div class="list-item">
            <span style="color: ${user.color}">● ${user.name}</span>
            <button class="btn-danger" onclick="removeUser('${user.id}')">刪除</button>
        </div>
    `).join('');
};