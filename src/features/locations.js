import { store } from '../state/store.js';
export const renderLocationButtons = () => {
  const container = document.getElementById('quick-locations');
  if (!container) return;
  container.innerHTML = store.locations.map(loc => `<button class="loc-btn" data-name="${loc.name}">${loc.name}</button>`).join('');
  container.querySelectorAll('.loc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('dep-loc').value = btn.dataset.name;
    });
  });
};
