import { h, btn, input as inp, checkbox, alertBox, stack, row, field } from '../ui.js';
import { generatePassword } from '../core.js';
import { copyText } from '../ui.js';

export default function mount(root) {
    const len = inp({ type: 'range', min: 4, max: 128, value: 16 });
    const lenLabel = h('span', { class: 'font-mono' }, '16');
    const lower = checkbox('a-z', true), upper = checkbox('A-Z', true), digits = checkbox('0-9', true), symbols = checkbox('Symbols', true), amb = checkbox('Avoid look-alikes (0 O 1 l I)', false);
    const out = h('output', { class: 'block break-all rounded-lg border border-slate-300 bg-white p-4 font-mono text-lg dark:border-slate-700 dark:bg-slate-900', 'aria-live': 'polite' }, '');
    const meta = h('p', { class: 'hint' });
    const note = alertBox();
    const gen = () => {
        try {
            const r = generatePassword({ length: Number(len.value), lower: lower.input.checked, upper: upper.input.checked, digits: digits.input.checked, symbols: symbols.input.checked, avoidAmbiguous: amb.input.checked });
            out.textContent = r.password;
            meta.textContent = `About ${r.bits} bits of entropy. Generated locally with your browser's secure random source; never stored or sent.`;
            note.hide();
        } catch (e) { out.textContent = ''; meta.textContent = ''; note.show(e.message, 'error'); }
    };
    len.addEventListener('input', () => { lenLabel.textContent = len.value; gen(); });
    [lower, upper, digits, symbols, amb].forEach((c) => c.input.addEventListener('change', gen));
    root.append(stack(
        out, meta, note.el,
        row(btn('Generate new', gen, 'primary'), btn('Copy', () => out.textContent && copyText(out.textContent))),
        h('div', {}, h('label', { class: 'label', for: 'pw-len' }, 'Length: ', lenLabel), (len.id = 'pw-len', len)),
        row(lower.el, upper.el, digits.el, symbols.el, amb.el),
    ));
    gen();
}
