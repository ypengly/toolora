import { h, ta, btn, select, alertBox, outputBar, stack, row, toast } from '../ui.js';
import { formatJson, minifyJson, parseJsonError } from '../core.js';

const SAMPLE = '{"name":"Toolora","tags":["json","tools"],"active":true,"stats":{"tools":15,"price":0}}';

export default function mount(root) {
    const input = ta({ rows: 14, placeholder: 'Paste JSON here…', label: 'JSON input' });
    const output = ta({ rows: 14, readonly: true, placeholder: 'Result appears here', label: 'JSON output' });
    const note = alertBox();
    const indent = select([['2', '2 spaces'], ['4', '4 spaces'], ['\t', 'Tab']], '2');
    const ind = () => (indent.value === '\t' ? '\t' : Number(indent.value));

    const run = (fn, okMsg) => {
        if (!input.value.trim()) { note.show('Enter some JSON first.', 'warn'); output.value = ''; return; }
        try {
            const res = fn(input.value);
            output.value = res ?? '';
            note.show(okMsg, 'ok');
        } catch (e) {
            const p = parseJsonError(input.value, e);
            output.value = '';
            note.show(`Invalid JSON: ${p.message}` + (p.line ? ` (line ${p.line}, column ${p.column})` : ''), 'error');
        }
    };
    const format = () => run((t) => formatJson(t, ind()), 'Valid JSON, formatted.');
    const validate = () => run((t) => { JSON.parse(t); return ''; }, 'Valid JSON.');
    const minify = () => run(minifyJson, 'Valid JSON, minified.');

    input.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); format(); } });

    root.append(stack(
        row(
            btn('Format', format, 'primary'), btn('Validate', validate), btn('Minify', minify),
            btn('Example', () => { input.value = SAMPLE; format(); }),
            btn('Paste', async () => { try { input.value = await navigator.clipboard.readText(); } catch { toast('Clipboard access was blocked. Paste manually.'); } }),
            btn('Clear', () => { input.value = ''; output.value = ''; note.hide(); }),
            h('label', { class: 'ml-auto flex items-center gap-2 text-sm' }, 'Indent', indent),
        ),
        note.el,
        h('div', { class: 'grid gap-4 lg:grid-cols-2' }, input, output),
        outputBar(() => output.value, 'output.json', 'application/json'),
        h('p', { class: 'hint' }, 'Tip: press Ctrl/Cmd + Enter to format.'),
    ));
}
