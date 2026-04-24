import { store } from './state/store.js';
import { initSupabase, fetchAllData, loadSettingsFromLocal, saveSettingsToLocal } from './services/supabase.js';
import { renderLocationButtons, bindLocationEvents } from './features/locations.js';
import { showPage, loadLastKm } from './ui/pages.js';

const bindEvents = () => {
  // 導覽切換
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 
                   item.textContent.trim() === '出車' ? 'record' : 
                   item.textContent.trim() === '回車' ? 'return' : 'history';
      // 簡化：直接根據順序或內容綁定
      if(item.innerHTML.includes('car-check')) showPage('record');
      if(item.innerHTML.includes('history')) showPage('history');
      if(item.innerHTML.includes('settings')) showPage('settings');
    });
  });

  // 設定儲存
  document.getElementById('sb-url')?.addEventListener('change', (e) => store.tempUrl = e.target.value);
  document.querySelector('#page-settings .btn-primary')?.addEventListener('click', async () => {
    const url = document.getElementById('sb-url').value;
    const key = document.getElementById('sb-key').value;
    saveSettingsToLocal({ url, key });
    location.reload();
  });
};

const bootstrap = async () => {
  const settings = loadSettingsFromLocal();
  bindEvents();
  if (settings.url && settings.key) {
    if (initSupabase(settings.url, settings.key)) {
      await fetchAllData();
      renderLocationButtons();
      bindLocationEvents();
      loadLastKm();
      showPage('record');
    }
  } else {
    showPage('settings');
  }
};

window.addEventListener('DOMContentLoaded', bootstrap);
