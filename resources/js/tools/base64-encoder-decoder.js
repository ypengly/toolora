import { h, ta, select, checkbox, alertBox, outputBar, stack, row, field } from '../ui.js';
import { b64Encode, b64Decode } from '../core.js';

export default function mount(root) {
    const mode = select([['encode', 'Encode to Base64'], ['decode', 'Decode from Base64']], 'encode');
    const urlSafe = checkbox('URL-safe (- and _, no padding)', false);
    const input = ta({ rows: 9, placeholder: 'Enter text or Base64…', label: 'Input' });
    const output = ta({ rows: 9, readonly: true, placeholder: 'Result', label: 'Output' });
    const note = alertBox();
    const run = () => {
        note.hide(); output.value = '';
        if (!input.value.trim()) return;
        try { output.value = mode.value === 'encode' ? b64Encode(input.value, urlSafe.input.checked) : b64Decode(input.value); }
        catch (e) { note.show(e.message, 'error'); }
    };
    [input, mode, urlSafe.input].forEach((el) => el.addEventListener(el === input ? 'input' : 'change', run));
    root.append(stack(row(field('Mode', mode), urlSafe.el), note.el, h('div', { class: 'grid gap-4 lg:grid-cols-2' }, input, output), outputBar(() => output.value, 'base64.txt')));
}
