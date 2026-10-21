import { h, ta, input as inp, checkbox, alertBox, stack, row, field } from '../ui.js';
import { runRegex } from '../core.js';

const MAX_INPUT = 200000;

export default function mount(root) {
    const pattern = inp({ placeholder: String.raw`(\w+)@(\w+)\.com`, spellcheck: 'false', class: 'inp font-mono' });
    const flagDefs = [['i', 'ignore case'], ['m', 'multiline'], ['s', 'dotAll'], ['u', 'unicode']].map(([f, l]) => ({ f, c: checkbox(`${f} (${l})`) }));
    const text = ta({ rows: 8, placeholder: 'Test text…', label: 'Test text' });
    const note = alertBox();
    const hl = h('div', { class: 'whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-900' });
    const list = h('div', { class: 'space-y-2' });

    const run = () => {
        hl.replaceChildren(); list.replaceChildren(); note.hide();
        if (!pattern.value) return;
        if (text.value.length > MAX_INPUT) { note.show('Test text is too long (limit 200,000 characters).', 'error'); return; }
        try {
            const flags = flagDefs.filter((d) => d.c.input.checked).map((d) => d.f).join('');
            const ms = runRegex(pattern.value, flags, text.value);
            note.show(ms.length ? `${ms.length} match${ms.length === 1 ? '' : 'es'}${ms.length >= 1000 ? ' (showing first 1,000)' : ''}.` : 'No matches.', ms.length ? 'ok' : 'warn');
            let pos = 0;
            for (const m of ms) {
                if (m.index < pos) continue;
                hl.append(text.value.slice(pos, m.index));
                hl.append(h('mark', { class: 'rounded bg-yellow-200 px-0.5 text-slate-900' }, m.match || '∅'));
                pos = m.index + m.match.length;
            }
            hl.append(text.value.slice(pos));
            ms.slice(0, 100).forEach((m, i) => {
                const parts = [h('div', { class: 'font-mono text-sm' }, `#${i + 1} at index ${m.index}: `, h('b', {}, JSON.stringify(m.match)))];
                m.groups.forEach((g, gi) => parts.push(h('div', { class: 'pl-4 font-mono text-xs text-slate-500' }, `group ${gi + 1}: ${g === undefined ? 'undefined' : JSON.stringify(g)}`)));
                if (m.named) for (const [k, v] of Object.entries(m.named)) parts.push(h('div', { class: 'pl-4 font-mono text-xs text-slate-500' }, `<${k}>: ${JSON.stringify(v)}`));
                list.append(h('div', { class: 'card p-3' }, parts));
            });
            if (ms.length > 100) list.append(h('p', { class: 'hint' }, 'Showing details for the first 100 matches.'));
        } catch (e) { note.show(e.message, 'error'); }
    };
    [pattern, text].forEach((el) => el.addEventListener('input', run));
    flagDefs.forEach((d) => d.c.input.addEventListener('change', run));
    root.append(stack(
        field('Pattern (JavaScript, without slashes)', pattern),
        row(h('span', { class: 'text-sm' }, 'Flags (g is always on):'), flagDefs.map((d) => d.c.el)),
        text, note.el, hl, list,
        h('p', { class: 'hint' }, 'Complex patterns with nested quantifiers can freeze the tab (catastrophic backtracking). Simplify the pattern if that happens.'),
    ));
}
