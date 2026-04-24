
import { store } from './state/store.js';
import { initSupabase, fetchAllData } from './services/supabase.js';
import { showPage } from './ui/pages.js';

// 既有功能恢復 (Legacy Bridge)
window.showPage = showPage;
window.closeModal = () => { document.getElementById('modal-bg').style.display = 'none'; };
window.toggleCheck = (el) => { el.classList.toggle('checked'); };
window.toggleFuel = (el) => { document.getElementById('fuel-fields').style.display = el.checked ? 'block' : 'none'; };

window.saveSettings = async () => {
    const url = document.getElementById('sb-url').value;
    const key = document.getElementById('sb-key').value;
    localStorage.setItem('car_log_settings', JSON.stringify({ url, key }));
    location.reload();
};

window.addUser = () => { console.log('Legacy: addUser'); };
window.removeUser = (id) => { console.log('Legacy: removeUser', id); };
window.submitDepart = () => { console.log('Legacy: submitDepart'); };
window.submitReturn = () => { console.log('Legacy: submitReturn'); };
window.cancelReturn = () => { window.showPage('record'); };
window.handleKmImage = (e) => { console.log('Legacy: handleKmImage'); };
window.renderHistory = () => { console.log('Legacy: renderHistory'); };
window.renderStats = () => { console.log('Legacy: renderStats'); };
window.deleteRecord = (id) => { console.log('Legacy: deleteRecord', id); };

const bootstrap = async () => {
    console.log('GOLEM_SYSTEM: Bridge Established');
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
