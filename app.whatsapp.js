export function buildWhatsAppMessage({ name, email, subject, message }) {
    const safe = (v) => String(v ?? '').trim();

    const lines = [
        '🚀 New Secure Message Submission',
        '',
        `Name: ${safe(name)}`,
        `Email Address: ${safe(email)}`,
        `Inquiry Subject: ${safe(subject)}`,
        '',
        'Detail Scope / Timeline:',
        safe(message)
    ];

    return lines.filter(Boolean).join('\n');
}

export function openWhatsAppChat({ phoneNumber, messageText }) {
    const text = encodeURIComponent(messageText);
    const url = `https://wa.me/${String(phoneNumber).replace(/\D/g, '')}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

export function initWhatsAppContactHandler({
    formId = 'contact-form',
    phoneNumber = '917257896988'
} = {}) {
    const form = document.getElementById(formId);
    if (!form) return;

    const getInputValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = getInputValue('form-name');
        const email = getInputValue('form-email');
        const subject = getInputValue('form-subject');
        const message = getInputValue('form-message');

        const allFilled = [name, email, subject, message].every((v) => String(v ?? '').trim().length > 0);
        if (!allFilled) {
            alert('Please fill all the details.');
            return;
        }

        const messageText = buildWhatsAppMessage({
            name,
            email,
            subject,
            message
        });

        openWhatsAppChat({
            phoneNumber,
            messageText
        });
    });
}

