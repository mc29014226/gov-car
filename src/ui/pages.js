import { store } from '../state/store.js';

export const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active');
    
    if (pageId === 'record') renderUserBtns();
    if (pageId === 'settings') renderUserList();
};

export const renderUserBtns = () => {
    const container = document.getElementById('user-btns-record');
    if (!container) return;
    container.innerHTML = store.users.map(user => `
        <button 
            class="user-btn ${store.selectedUser?.id === user.id ? 'selected' : ''}" 
            style="background:${user.color};color:${user.text_color}" 
            onclick="window.selectUser(this, '${user.id}')"
        >
            ${user.name}
        </button>
    `).join('');
}; color: ${user.color}">
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
        </div>
    `).join('');
};