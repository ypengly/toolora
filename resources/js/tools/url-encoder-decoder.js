import { h, ta, select, alertBox, outputBar, stack, row, field } from '../ui.js';
import { urlEncode, urlDecode } from '../core.js';

export default function mount(root) {
    const mode = select([['component', 'Encode value (encodeURIComponent)'], ['full', 'Encode full URL (encodeURI)'], ['decode', 'Decode']], 'component');
    const input = ta({ rows: 8, placeholder: 'Enter text or URL…', label: 'Input' });
    const output = ta({ rows: 8, readonly: true, placeholder: 'Result', label: 'Output' });
    const note = alertBox();
    const run = () => {
        note.hide(); output.value = '';
        if (!input.value) return;
        try { output.value = mode.value === 'decode' ? urlDecode(input.value) : urlEncode(input.value, mode.value); }
        catch (e) { note.show(e.message, 'error'); }
    };
    input.addEventListener('input', run); mode.addEventListener('change', run);
    root.append(stack(row(field('Mode', mode)), note.el, h('div', { class: 'grid gap-4 lg:grid-cols-2' }, input, output), outputBar(() => output.value, 'url.txt')));
}
