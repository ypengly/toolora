// Tiny DOM helpers shared by tool modules. All text is set via textContent / DOM APIs (no innerHTML).

export function h(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
        else if (['value', 'checked', 'disabled', 'readOnly'].includes(k)) e[k] = v;
        else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c);
    return e;
}

let toastEl;
export function toast(msg) {
    if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        toast('Copied to clipboard');
    } catch {
        const s = h('textarea', { value: text });
        document.body.append(s); s.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch {}
        s.remove();
        toast(ok ? 'Copied to clipboard' : 'Copy failed. Select the text and copy manually.');
    }
}

export function downloadFile(content, filename, mime = 'text/plain') {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: filename });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export const btn = (label, onClick, variant = '') => h('button', { type: 'button', class: 'btn ' + (variant === 'primary' ? 'btn-primary' : ''), onClick }, label);

export const ta = ({ rows = 10, placeholder = '', readonly = false, label } = {}) =>
    h('textarea', { class: 'inp font-mono', rows, placeholder, readOnly: readonly, spellcheck: 'false', 'aria-label': label || placeholder || 'Text' });

export const input = (props = {}) => h('input', { class: 'inp', ...props });

export function select(options, value) {
    const s = h('select', { class: 'inp' }, options.map(([v, l]) => h('option', { value: v }, l)));
    if (value != null) s.value = value;
    return s;
}

let uid = 0;
export function field(label, control, hint) {
    const id = 'f' + ++uid;
    control.id = id;
    return h('div', {}, h('label', { class: 'label', for: id }, label), control, hint ? h('p', { class: 'hint' }, hint) : null);
}

export function checkbox(label, checked = false, onChange) {
    const c = h('input', { type: 'checkbox', class: 'inp', checked, onChange });
    return { el: h('label', { class: 'flex items-center gap-2 text-sm' }, c, label), input: c };
}

export function alertBox() {
    const el = h('div', { class: 'alert hidden', role: 'status' });
    return {
        el,
        show(msg, kind = 'ok') { el.className = `alert alert-${kind}`; el.textContent = msg; el.setAttribute('role', kind === 'error' ? 'alert' : 'status'); },
        hide() { el.className = 'alert hidden'; el.textContent = ''; },
    };
}

export function outputBar(getText, filename = 'output.txt', mime = 'text/plain') {
    return h('div', { class: 'flex flex-wrap gap-2' },
        btn('Copy output', () => { const t = getText(); t ? copyText(t) : toast('Nothing to copy yet'); }),
        btn('Download', () => { const t = getText(); t ? downloadFile(t, filename, mime) : toast('Nothing to download yet'); }));
}

export function fmtBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1048576).toFixed(2)} MB`;
}

export const row = (...kids) => h('div', { class: 'flex flex-wrap items-end gap-3' }, kids);
export const stack = (...kids) => h('div', { class: 'space-y-4' }, kids);
export const grid = (cols, ...kids) => h('div', { class: `grid gap-4 ${cols}` }, kids);
