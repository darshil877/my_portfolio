export function initWhatsAppFabVisibility() {
    const fab = document.getElementById('whatsapp-fab');
    if (!fab) return;

    fab.style.display = 'flex';
    fab.style.position = 'fixed';
    fab.style.bottom = '1.5rem';
    fab.style.right = '1.5rem';
    fab.style.zIndex = '99999';

    // ensure FAB href stays functional
    if (!fab.getAttribute('href')) {
        fab.setAttribute('href', 'https://wa.me/917257896988');
    }
}




