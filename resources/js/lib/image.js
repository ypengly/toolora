import { h, btn, select, input as inp, alertBox, stack, row, field, fmtBytes, downloadFile } from '../ui.js';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 25 * 1024 * 1024, MAX_FILES = 20;

const toBlob = (canvas, type, q) => new Promise((res) => canvas.toBlob(res, type, q));

async function convert(file, { type, quality, maxWidth }) {
    const bmp = await createImageBitmap(file);
    try {
        let { width, height } = bmp;
        if (maxWidth && width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (type === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height); } // JPEG has no alpha
        ctx.drawImage(bmp, 0, 0, width, height);
        const blob = await toBlob(canvas, type, quality);
        if (!blob) throw new Error('Your browser could not encode this image.');
        return blob;
    } finally { bmp.close?.(); }
}

/** Shared UI for the Image Compressor ('compress') and Image Format Converter ('convert'). */
export function mountImageProcessor(root, { mode }) {
    const compress = mode === 'compress';
    const fmt = compress
        ? select([['image/webp', 'WebP (smallest)'], ['image/jpeg', 'JPEG'], ['original', 'Keep original format']], 'image/webp')
        : select([['image/png', 'PNG'], ['image/jpeg', 'JPEG'], ['image/webp', 'WebP']], 'image/webp');
    const quality = inp({ type: 'range', min: 10, max: 100, value: compress ? 80 : 92 });
    const qLabel = h('span', {}, quality.value + '%');
    const maxW = inp({ type: 'number', min: 16, max: 16000, placeholder: 'No resize' });
    const fileIn = inp({ type: 'file', accept: ACCEPT.join(','), multiple: true, class: 'sr-only' });
    const zone = h('label', { class: 'dropzone' }, h('strong', {}, 'Drop images here or click to choose'), h('span', {}, `JPEG, PNG or WebP · up to ${MAX_FILES} files · ${fmtBytes(MAX_BYTES)} each · processed on your device`), fileIn);
    const note = alertBox();
    const results = h('div', { class: 'space-y-3' });
    let files = [], run = 0;

    const process = async () => {
        const my = ++run;
        results.replaceChildren(); note.hide();
        if (!files.length) return;
        if (files.length > MAX_FILES) { note.show(`Please choose at most ${MAX_FILES} files; the first ${MAX_FILES} will be processed.`, 'warn'); files = files.slice(0, MAX_FILES); }
        for (const file of files) {
            const li = h('div', { class: 'card flex flex-wrap items-center gap-3' });
            results.append(li);
            if (!ACCEPT.includes(file.type)) { li.append(h('span', { class: 'alert alert-error' }, `${file.name}: unsupported file type (${file.type || 'unknown'}). Use JPEG, PNG or WebP.`)); continue; }
            if (file.size > MAX_BYTES) { li.append(h('span', { class: 'alert alert-error' }, `${file.name}: larger than ${fmtBytes(MAX_BYTES)}.`)); continue; }
            li.append(h('span', { class: 'text-sm' }, `${file.name}: processing…`));
            try {
                const want = fmt.value === 'original' ? file.type : fmt.value;
                const blob = await convert(file, { type: want, quality: Number(quality.value) / 100, maxWidth: Number(maxW.value) || 0 });
                if (my !== run) return;
                const ext = EXT[blob.type] || 'img';
                const base = file.name.replace(/\.[^.]+$/, '');
                const name = `${base}${compress ? '-compressed' : ''}.${ext}`;
                const delta = ((file.size - blob.size) / file.size) * 100;
                const grew = blob.size > file.size;
                const url = URL.createObjectURL(blob);
                li.replaceChildren(
                    h('img', { src: url, alt: '', class: 'h-14 w-14 rounded-lg object-cover' }),
                    h('div', { class: 'min-w-0 flex-1' },
                        h('div', { class: 'truncate font-medium' }, name),
                        h('div', { class: 'text-sm text-slate-600 dark:text-slate-400' }, `${fmtBytes(file.size)} → ${fmtBytes(blob.size)} · `, h('b', { class: grew ? 'text-amber-600' : 'text-emerald-600' }, grew ? `${Math.abs(delta).toFixed(1)}% larger` : `${delta.toFixed(1)}% smaller`)),
                        blob.type !== want ? h('div', { class: 'text-xs text-amber-600' }, `Your browser produced ${blob.type} instead of the requested ${want}.`) : null),
                    btn('Download', () => downloadFile(blob, name)));
            } catch (e) {
                li.replaceChildren(h('span', { class: 'alert alert-error' }, `${file.name}: could not be processed (${e.message || 'unsupported or corrupted image'}).`));
            }
        }
    };

    fileIn.addEventListener('change', () => { files = [...fileIn.files]; process(); });
    ['dragover', 'dragenter'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('over'); }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('over'); }));
    zone.addEventListener('drop', (e) => { files = [...e.dataTransfer.files]; process(); });
    quality.addEventListener('input', () => { qLabel.textContent = quality.value + '%'; });
    quality.addEventListener('change', process);
    fmt.addEventListener('change', process);
    maxW.addEventListener('change', process);

    const qWrap = h('div', {}, h('label', { class: 'label' }, 'Quality: ', qLabel), quality, h('p', { class: 'hint' }, 'Applies to JPEG and WebP. PNG is lossless.'));
    root.append(stack(zone, row(field(compress ? 'Output format' : 'Convert to', fmt), qWrap, compress ? field('Max width (px)', maxW) : null), note.el, results));
}
