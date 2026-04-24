export const showPage = (name) => {
    // 切換 .page.active
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById('page-' + name);
    if (targetPage) targetPage.classList.add('active');

    // 切換 .nav-item.active
    document.querySelectorAll('.nav-item').forEach(nav => {
        const label = nav.innerText || '';
        const isMatch = (name === 'record' && label.includes('出車')) || 
                        (name === 'return' && label.includes('回車')) || 
                        (name === 'history' && label.includes('歷史')) ||
                        (name === 'stats' && label.includes('統計')) ||
                        (name === 'users' && label.includes('管理')) ||
                        (name === 'settings' && label.includes('設定'));
        nav.classList.toggle('active', isMatch);
    });
};