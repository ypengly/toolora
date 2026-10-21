import QRCode from 'qrcode';
import { h, ta, btn, input as inp, select, checkbox, alertBox, stack, row, field, downloadFile } from '../ui.js';
import { qrPayload, contrastRatio } from '../core.js';

const TYPES = [['text', 'Plain text'], ['url', 'URL'], ['wifi', 'Wi-Fi'], ['contact', 'Contact (vCard)'], ['email', 'Email']];

export default function mount(root) {
    const type = select(TYPES, 'url');
    const fg = inp({ type: 'color', value: '#000000', 'aria-label': 'Foreground color' });
    const bg = inp({ type: 'color', value: '#ffffff', 'aria-label': 'Background color' });
    const size = select([['256', '256 px'], ['512', '512 px'], ['1024', '1024 px']], '512');
    const ec = select([['L', 'Low (7%)'], ['M', 'Medium (15%)'], ['Q', 'Quartile (25%)'], ['H', 'High (30%)']], 'M');
    const fieldsBox = h('div', { class: 'space-y-3' });
    const note = alertBox(), warn = alertBox();
    const preview = h('img', { alt: 'QR code preview', class: 'mx-auto hidden h-64 w-64 rounded-lg border border-slate-200 bg-white object-contain dark:border-slate-700' });
    const actions = h('div', { class: 'flex flex-wrap justify-center gap-2' });
    let els = {}, png = null, svg = null, timer;

    const build = () => {
        els = {};
        const mk = (key, label, el, hint) => { els[key] = el; return field(label, el, hint); };
        const t = type.value;
        const parts = {
            text: () => [mk('text', 'Text', ta({ rows: 4, placeholder: 'Any text', label: 'Text' }))],
            url: () => [mk('url', 'URL', inp({ placeholder: 'https://example.com', inputmode: 'url' }))],
            wifi: () => [mk('ssid', 'Network name (SSID)', inp()), mk('security', 'Security', select([['WPA', 'WPA/WPA2/WPA3'], ['WEP', 'WEP'], ['nopass', 'No password']], 'WPA')), mk('password', 'Password', inp({ type: 'text', autocomplete: 'off' })), mk('hidden', 'Hidden network', inp({ type: 'checkbox' }))],
            contact: () => [mk('name', 'Full name', inp()), mk('phone', 'Phone', inp({ type: 'tel' })), mk('email', 'Email', inp({ type: 'email' })), mk('org', 'Organization', inp()), mk('url', 'Website', inp({ type: 'url' }))],
            email: () => [mk('email', 'Email address', inp({ type: 'email' })), mk('subject', 'Subject', inp()), mk('body', 'Message', ta({ rows: 3, label: 'Message' }))],
        }[t]();
        fieldsBox.replaceChildren(...parts);
        Object.values(els).forEach((e) => { e.addEventListener('input', schedule); e.addEventListener('change', schedule); });
        clear();
    };
    const values = () => Object.fromEntries(Object.entries(els).map(([k, e]) => [k, e.type === 'checkbox' ? e.checked : e.value]));
    const clear = () => { png = svg = null; preview.classList.add('hidden'); actions.replaceChildren(); };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(generate, 250); };

    async function generate() {
        warn.hide();
        let payload;
        try { payload = qrPayload(type.value, values()); } catch (e) { clear(); if (Object.values(values()).some((v) => v && v !== 'WPA')) note.show(e.message, 'error'); else note.hide(); return; }
        note.hide();
        const opts = { errorCorrectionLevel: ec.value, margin: 2, width: Number(size.value), color: { dark: fg.value, light: bg.value } };
        try {
            png = await QRCode.toDataURL(payload, opts);
            svg = await QRCode.toString(payload, { ...opts, type: 'svg' });
        } catch (e) { clear(); note.show('Too much data for a QR code at this error-correction level. Shorten the content or lower the level.', 'error'); return; }
        preview.src = png; preview.classList.remove('hidden');
        actions.replaceChildren(
            btn('Download PNG', async () => downloadFile(await (await fetch(png)).blob(), 'qrcode.png')),
            btn('Download SVG', () => downloadFile(svg, 'qrcode.svg', 'image/svg+xml')));
        const ratio = contrastRatio(fg.value, bg.value);
        if (ratio < 4 || contrastRatio(fg.value, '#000000') < contrastRatio(bg.value, '#000000')) warn.show(`Scan warning: contrast is ${ratio.toFixed(1)}:1, or the code is lighter than its background. Use a dark foreground on a light background and test with a phone before printing.`, 'warn');
    }

    [type].forEach((e) => e.addEventListener('change', build));
    [fg, bg, size, ec].forEach((e) => e.addEventListener('input', schedule));
    root.append(h('div', { class: 'grid gap-6 lg:grid-cols-2' },
        stack(field('QR code type', type), fieldsBox, row(field('Foreground', fg), field('Background', bg), field('Size', size), field('Error correction', ec)), note.el),
        stack(preview, actions, warn.el, h('p', { class: 'hint text-center' }, 'Generated locally. Always test your QR code before sharing or printing.'))));
    build();
}
