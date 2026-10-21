import { h, btn, input as inp, alertBox, stack, row, field, copyText } from '../ui.js';
import { tsToDate, dateToTs } from '../core.js';

export default function mount(root) {
    const now = h('div', { class: 'font-mono text-2xl font-bold' }, '');
    const tick = () => { now.textContent = String(Math.floor(Date.now() / 1000)); };
    tick(); const timer = setInterval(() => (document.body.contains(now) ? tick() : clearInterval(timer)), 1000);

    const ts = inp({ placeholder: 'e.g. 1767225600', inputmode: 'decimal' });
    const tsOut = h('dl', { class: 'grid gap-1 text-sm' });
    const tsNote = alertBox();
    const convertTs = () => {
        tsOut.replaceChildren(); tsNote.hide();
        if (!ts.value.trim()) return;
        try {
            const r = tsToDate(ts.value);
            tsNote.show(`Detected unit: ${r.unit}`, 'ok');
            for (const [k, v] of [['UTC', r.utc], ['ISO 8601', r.iso], ['Local', r.local]]) tsOut.append(h('div', { class: 'flex gap-2' }, h('dt', { class: 'w-20 font-medium' }, k), h('dd', { class: 'break-all font-mono' }, v)));
        } catch (e) { tsNote.show(e.message, 'error'); }
    };
    ts.addEventListener('input', convertTs);

    const date = inp({ placeholder: '2026-01-31T12:00:00Z' });
    const dOut = h('div', { class: 'font-mono text-sm' });
    const dNote = alertBox();
    const convertDate = () => {
        dOut.replaceChildren(); dNote.hide();
        if (!date.value.trim()) return;
        try { const r = dateToTs(date.value); dOut.append(h('div', {}, `Seconds: ${r.seconds}`), h('div', {}, `Milliseconds: ${r.milliseconds}`)); }
        catch (e) { dNote.show(e.message, 'error'); }
    };
    date.addEventListener('input', convertDate);

    root.append(stack(
        h('div', { class: 'card' }, h('p', { class: 'text-sm text-slate-500' }, 'Current Unix time (seconds)'), now, h('div', { class: 'mt-2' }, btn('Copy', () => copyText(now.textContent)))),
        h('div', { class: 'grid gap-4 lg:grid-cols-2' },
            h('div', { class: 'card space-y-3' }, h('h2', { class: 'font-semibold' }, 'Timestamp → date'), field('Unix timestamp', ts), tsNote.el, tsOut),
            h('div', { class: 'card space-y-3' }, h('h2', { class: 'font-semibold' }, 'Date → timestamp'), field('Date and time', date, 'Dates without a time zone use your local time zone.'), row(btn('Use current time', () => { date.value = new Date().toISOString(); convertDate(); })), dNote.el, dOut)),
    ));
}
