import { store } from './state/store.js';
import { initSupabase, fetchAllData, loadSettingsFromLocal, setDbStatus } from './services/supabase.js';
import { showPage, setDefaultTime, loadLastKm, hideLoading } from './ui/pages.js';
import { renderLocationButtons, renderLocationList, bindLocationEvents } from './features/locations.js';

const renderAll = () => {
    renderLocationButtons();
    renderLocationList();
};

const bootstrap = async () => {
    const settings = loadSettingsFromLocal();
    if (settings.url && settings.key) {
        if (initSupabase(settings.url, settings.key)) {
            await fetchAllData();
            setDbStatus(true);
            renderAll();
            bindLocationEvents();
            loadLastKm();
            setDefaultTime();
            showPage('record');
        }
    } else {
        showPage('settings');
    }
    hideLoading();
};
window.addEventListener('DOMContentLoaded', bootstrap);