import { h, ta, btn, checkbox, alertBox, stack, row } from '../ui.js';
import { diffLines } from '../core.js';

export default function mount(root) {
    const a = ta({ rows: 12, placeholder: 'Original text', label: 'Original text' });
    const b = ta({ rows: 12, placeholder: 'Changed text', label: 'Changed text' });
    const ic = checkbox('Ignore case'), iw = checkbox('Ignore whitespace');
    const note = alertBox();
    const out = h('div', { class: 'overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800' });
    const compare = () => {
        out.replaceChildren(); note.hide();
        try {
            const ops = diffLines(a.value, b.value, { ignoreCase: ic.input.checked, ignoreWhitespace: iw.input.checked });
            const add = ops.filter((o) => o.type === 'add').length, del = ops.filter((o) => o.type === 'del').length;
            if (!ops.length) { note.show('Both inputs are empty.', 'warn'); return; }
            note.show(add || del ? `${add} line(s) added, ${del} line(s) removed.` : 'No differences found.', add || del ? 'warn' : 'ok');
            for (const o of ops) out.append(h('div', { class: `diff-line ${o.type === 'add' ? 'diff-add' : o.type === 'del' ? 'diff-del' : ''}` }, (o.type === 'add' ? '+ ' : o.type === 'del' ? '- ' : '  ') + o.text));
        } catch (e) { note.show(e.message, 'error'); }
    };
    root.append(stack(
        h('div', { class: 'grid gap-4 lg:grid-cols-2' }, a, b),
        row(btn('Compare', compare, 'primary'), btn('Swap', () => { [a.value, b.value] = [b.value, a.value]; }), btn('Clear', () => { a.value = ''; b.value = ''; out.replaceChildren(); note.hide(); }), ic.el, iw.el),
        note.el, out,
    ));
}
