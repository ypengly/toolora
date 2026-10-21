import { h, ta, btn, input as inp, checkbox, alertBox, outputBar, stack, row, field } from '../ui.js';
import { uuidv4 } from '../core.js';

export default function mount(root) {
    const count = inp({ type: 'number', min: 1, max: 1000, value: 5 });
    const upper = checkbox('Uppercase'), plain = checkbox('Remove hyphens');
    const out = ta({ rows: 10, readonly: true, placeholder: 'Generated UUIDs', label: 'UUIDs' });
    const note = alertBox();
    const gen = () => {
        const n = Math.floor(Number(count.value));
        if (!(n >= 1 && n <= 1000)) { note.show('Enter a count between 1 and 1000.', 'error'); return; }
        note.hide();
        out.value = Array.from({ length: n }, () => {
            let u = uuidv4();
            if (plain.input.checked) u = u.replace(/-/g, '');
            return upper.input.checked ? u.toUpperCase() : u;
        }).join('\n');
    };
    root.append(stack(row(field('How many', count), upper.el, plain.el, btn('Generate', gen, 'primary')), note.el, out, outputBar(() => out.value, 'uuids.txt')));
    gen();
}
