import { h, input as inp, stack, grid, field } from '../ui.js';
import { percentage } from '../core.js';

export default function mount(root) {
    const card = (title, mode, labelA, labelB, fmt, formula) => {
        const a = inp({ type: 'number', step: 'any', placeholder: '0' }), b = inp({ type: 'number', step: 'any', placeholder: '0' });
        const out = h('div', { class: 'min-h-8 text-2xl font-bold', 'aria-live': 'polite' }, '');
        const sub = h('p', { class: 'hint' }, formula);
        const update = () => {
            if (a.value === '' || b.value === '') { out.textContent = ''; out.className = 'min-h-8 text-2xl font-bold'; return; }
            try { out.textContent = fmt(percentage(mode, Number(a.value), Number(b.value))); out.className = 'min-h-8 text-2xl font-bold'; }
            catch (e) { out.textContent = e.message; out.className = 'min-h-8 text-sm font-medium text-red-600 dark:text-red-400'; }
        };
        a.addEventListener('input', update); b.addEventListener('input', update);
        return h('div', { class: 'card space-y-3' }, h('h2', { class: 'font-semibold' }, title), field(labelA, a), field(labelB, b), out, sub);
    };
    root.append(grid('lg:grid-cols-3',
        card('What is X% of Y?', 'of', 'Percent (X)', 'Number (Y)', (r) => String(r), 'X / 100 × Y'),
        card('X is what % of Y?', 'is', 'Value (X)', 'Total (Y)', (r) => r + '%', 'X / Y × 100'),
        card('Percent change from X to Y', 'change', 'From (X)', 'To (Y)', (r) => (r > 0 ? '+' : '') + r + '%', '(Y − X) / |X| × 100'),
    ));
}
