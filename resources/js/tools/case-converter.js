import { h, ta, btn, alertBox, outputBar, stack, row } from '../ui.js';
import { convertCase } from '../core.js';

const MODES = [
    ['upper', 'UPPERCASE'], ['lower', 'lowercase'], ['title', 'Title Case'], ['sentence', 'Sentence case'],
    ['camel', 'camelCase'], ['pascal', 'PascalCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case'], ['constant', 'CONSTANT_CASE'],
];

export default function mount(root) {
    const input = ta({ rows: 8, placeholder: 'Enter text…', label: 'Input text' });
    const output = ta({ rows: 8, readonly: true, placeholder: 'Converted text appears here', label: 'Converted text' });
    const note = alertBox();
    const go = (mode) => {
        if (!input.value) { note.show('Enter some text first.', 'warn'); output.value = ''; return; }
        note.hide();
        output.value = convertCase(input.value, mode);
    };
    root.append(stack(
        input,
        row(MODES.map(([m, l]) => btn(l, () => go(m)))),
        note.el, output,
        outputBar(() => output.value, 'converted.txt'),
    ));
}
