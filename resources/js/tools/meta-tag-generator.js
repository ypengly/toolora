import { h, ta, input as inp, select, checkbox, alertBox, outputBar, stack, row, field } from '../ui.js';
import { metaTags } from '../core.js';

export default function mount(root) {
    const title = inp({ placeholder: 'Page title', maxlength: 200 });
    const desc = ta({ rows: 3, placeholder: 'Short description of the page', label: 'Description' });
    desc.className = 'inp';
    const canonical = inp({ placeholder: 'https://example.com/page', type: 'url' });
    const image = inp({ placeholder: 'https://example.com/share.jpg', type: 'url' });
    const site = inp({ placeholder: 'Site name' });
    const robots = select([['', 'Default (index, follow)'], ['noindex, follow', 'noindex, follow'], ['index, nofollow', 'index, nofollow'], ['noindex, nofollow', 'noindex, nofollow']], '');
    const og = checkbox('Open Graph tags', true), tw = checkbox('Twitter Card tags', true), basics = checkbox('Include charset and viewport', true);
    const out = ta({ rows: 12, readonly: true, placeholder: 'Generated tags appear here', label: 'Generated HTML' });
    const tCount = h('p', { class: 'hint' }), dCount = h('p', { class: 'hint' });
    const serpT = h('div', { class: 'truncate text-lg text-blue-700 dark:text-blue-400' });
    const serpU = h('div', { class: 'truncate text-xs text-emerald-700 dark:text-emerald-400' });
    const serpD = h('div', { class: 'line-clamp-2 text-sm text-slate-600 dark:text-slate-400' });
    const note = alertBox();

    const run = () => {
        out.value = metaTags({ title: title.value.trim(), description: desc.value.trim(), canonical: canonical.value.trim(), image: image.value.trim(), siteName: site.value.trim(), robots: robots.value, openGraph: og.input.checked, twitter: tw.input.checked, basics: basics.input.checked });
        tCount.textContent = `${title.value.length} characters. Around 60 or fewer usually avoids truncation.`;
        dCount.textContent = `${desc.value.length} characters. Around 155 or fewer usually avoids truncation.`;
        serpT.textContent = title.value || 'Page title';
        serpU.textContent = canonical.value || 'https://example.com/page';
        serpD.textContent = desc.value || 'Your description will appear here.';
        const bad = [canonical, image].filter((i) => i.value && !/^https?:\/\//i.test(i.value));
        bad.length ? note.show('Canonical and image URLs should be absolute (start with http:// or https://).', 'warn') : note.hide();
    };
    [title, desc, canonical, image, site].forEach((e) => e.addEventListener('input', run));
    [robots, og.input, tw.input, basics.input].forEach((e) => e.addEventListener('change', run));

    root.append(stack(
        h('div', { class: 'grid gap-4 lg:grid-cols-2' },
            stack(field('Title', title), tCount, field('Description', desc), dCount, field('Canonical URL', canonical), field('Social image URL', image), field('Site name', site), field('Robots', robots), row(og.el, tw.el, basics.el)),
            stack(h('div', {}, h('p', { class: 'label' }, 'Search result preview (approximate)'), h('div', { class: 'card space-y-1' }, serpU, serpT, serpD), h('p', { class: 'hint' }, 'Search engines may show different text. This is a local preview only; nothing is fetched or checked.')), note.el, out, outputBar(() => out.value, 'meta-tags.html', 'text/html'))),
    ));
    run();
}
