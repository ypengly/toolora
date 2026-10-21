import { h, ta, btn, stack, grid } from '../ui.js';
import { countText, formatMinutes } from '../core.js';

export default function mount(root) {
    const input = ta({ rows: 12, placeholder: 'Type or paste your text…', label: 'Text to count' });
    const stats = [
        ['Words', 'words'], ['Characters', 'characters'], ['Characters (no spaces)', 'charactersNoSpaces'],
        ['Sentences', 'sentences'], ['Lines', 'lines'], ['Paragraphs', 'paragraphs'],
    ];
    const cells = {};
    const card = (label, key) => {
        const v = h('div', { class: 'text-2xl font-bold' }, '0');
        cells[key] = v;
        return h('div', { class: 'stat' }, v, h('div', { class: 'text-xs text-slate-500' }, label));
    };
    const read = h('div', { class: 'stat' }, (cells.read = h('div', { class: 'text-2xl font-bold' }, '0 sec')), h('div', { class: 'text-xs text-slate-500' }, 'Reading time (~238 wpm)'));
    const speak = h('div', { class: 'stat' }, (cells.speak = h('div', { class: 'text-2xl font-bold' }, '0 sec')), h('div', { class: 'text-xs text-slate-500' }, 'Speaking time (~130 wpm)'));
    const update = () => {
        const c = countText(input.value);
        for (const [, k] of stats) cells[k].textContent = c[k].toLocaleString();
        cells.read.textContent = formatMinutes(c.readingMinutes);
        cells.speak.textContent = formatMinutes(c.speakingMinutes);
    };
    input.addEventListener('input', update);
    root.append(stack(
        input,
        grid('grid-cols-2 sm:grid-cols-4 lg:grid-cols-4', stats.map(([l, k]) => card(l, k)), read, speak),
        btn('Clear', () => { input.value = ''; update(); }),
    ));
}
