// Pure, DOM-free logic shared by the tool modules (and unit-tested with node --test).

export const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- JSON ---------- */
/** Minimal JSON scanner returning the index of the first syntax error, or -1 if valid. */
export function findJsonErrorPosition(t) {
    let i = 0;
    const ws = () => { while (i < t.length && ' \t\n\r'.includes(t[i])) i++; };
    const fail = () => { throw i; };
    const str = () => {
        i++;
        while (i < t.length && t[i] !== '"') {
            const c = t.charCodeAt(i);
            if (c < 0x20) fail();
            if (t[i] === '\\') {
                i++;
                if (t[i] === 'u') { if (!/^[0-9a-fA-F]{4}$/.test(t.slice(i + 1, i + 5))) fail(); i += 4; }
                else if (!'"\\/bfnrt'.includes(t[i] ?? '#')) fail();
            }
            i++;
        }
        if (t[i] !== '"') fail();
        i++;
    };
    const value = () => {
        ws();
        const c = t[i];
        if (c === '{') {
            i++; ws();
            if (t[i] === '}') { i++; return; }
            for (;;) {
                ws(); if (t[i] !== '"') fail(); str(); ws();
                if (t[i] !== ':') fail(); i++; value(); ws();
                if (t[i] === ',') { i++; continue; }
                if (t[i] === '}') { i++; return; }
                fail();
            }
        } else if (c === '[') {
            i++; ws();
            if (t[i] === ']') { i++; return; }
            for (;;) {
                value(); ws();
                if (t[i] === ',') { i++; continue; }
                if (t[i] === ']') { i++; return; }
                fail();
            }
        } else if (c === '"') str();
        else {
            const m = /^(-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?|true|false|null)/.exec(t.slice(i));
            if (!m) fail();
            i += m[0].length;
        }
    };
    try { value(); ws(); if (i < t.length) fail(); return -1; } catch (e) { if (typeof e === 'number') return e; throw e; }
}
export function parseJsonError(text, err) {
    const message = String((err && err.message) || err);
    let line, column, m;
    if ((m = message.match(/line (\d+) column (\d+)/))) {
        line = +m[1]; column = +m[2];
    } else {
        let pos = (m = message.match(/position (\d+)/)) ? +m[1] : findJsonErrorPosition(text);
        if (pos >= 0) {
            const before = text.slice(0, pos).split('\n');
            line = before.length; column = before[before.length - 1].length + 1;
        }
    }
    return { message, line, column };
}
export const formatJson = (text, indent = 2) => JSON.stringify(JSON.parse(text), null, indent);
export const minifyJson = (text) => JSON.stringify(JSON.parse(text));

/* ---------- Text ---------- */
export function countText(text) {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = (text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?\s][^.!?]*$/g) || []).filter((s) => s.trim()).length;
    return {
        words,
        characters: [...text].length,
        charactersNoSpaces: [...text.replace(/\s/g, '')].length,
        sentences,
        lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
        paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
        readingMinutes: words / 238,
        speakingMinutes: words / 130,
    };
}
export function formatMinutes(m) {
    if (m === 0) return '0 sec';
    const sec = Math.round(m * 60);
    if (sec < 60) return `${sec} sec`;
    const mins = Math.floor(sec / 60), rest = sec % 60;
    return rest ? `${mins} min ${rest} sec` : `${mins} min`;
}
export function convertCase(text, mode) {
    const words = () => text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    switch (mode) {
        case 'upper': return text.toUpperCase();
        case 'lower': return text.toLowerCase();
        case 'title': return text.toLowerCase().replace(/(^|[\s\-_(])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
        case 'sentence': return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
        case 'camel': return words().map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join('');
        case 'pascal': return words().map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
        case 'snake': return words().map((w) => w.toLowerCase()).join('_');
        case 'kebab': return words().map((w) => w.toLowerCase()).join('-');
        case 'constant': return words().map((w) => w.toUpperCase()).join('_');
        default: throw new Error('Unknown case: ' + mode);
    }
}

/* ---------- Encoders ---------- */
export function b64Encode(text, urlSafe = false) {
    const bytes = new TextEncoder().encode(text);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    let out = btoa(bin);
    if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return out;
}
export function b64Decode(input) {
    let s = input.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Input is not valid Base64.');
    if (s.replace(/=+$/, '').length % 4 === 1) throw new Error('Input is not valid Base64 (incorrect length).');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
        throw new Error('The decoded bytes are not valid UTF-8 text (it may be a binary file).');
    }
}
export function urlEncode(text, mode = 'component') {
    return mode === 'full' ? encodeURI(text) : encodeURIComponent(text);
}
export function urlDecode(text) {
    try {
        return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch {
        throw new Error('Malformed input: a % sign must be followed by two hex digits.');
    }
}

/* ---------- Diff ---------- */
export function diffLines(a, b, { ignoreCase = false, ignoreWhitespace = false } = {}) {
    const split = (t) => (t === '' ? [] : t.split(/\r\n|\r|\n/));
    const A = split(a), B = split(b);
    const key = (s) => {
        if (ignoreWhitespace) s = s.replace(/\s+/g, ' ').trim();
        return ignoreCase ? s.toLowerCase() : s;
    };
    const ka = A.map(key), kb = B.map(key);
    let s = 0;
    while (s < A.length && s < B.length && ka[s] === kb[s]) s++;
    let ea = A.length, eb = B.length;
    while (ea > s && eb > s && ka[ea - 1] === kb[eb - 1]) { ea--; eb--; }
    const n = ea - s, m = eb - s;
    if (n * m > 9e6) throw new Error('Inputs differ in too many lines to compare in the browser (limit is about 3,000 differing lines per side).');
    const w = m + 1, dp = new Uint32Array((n + 1) * w);
    for (let i = n - 1; i >= 0; i--)
        for (let j = m - 1; j >= 0; j--)
            dp[i * w + j] = ka[s + i] === kb[s + j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    const ops = [];
    for (let i = 0; i < s; i++) ops.push({ type: 'same', text: A[i] });
    let i = 0, j = 0;
    while (i < n && j < m) {
        if (ka[s + i] === kb[s + j]) { ops.push({ type: 'same', text: A[s + i] }); i++; j++; }
        else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) { ops.push({ type: 'del', text: A[s + i] }); i++; }
        else { ops.push({ type: 'add', text: B[s + j] }); j++; }
    }
    while (i < n) ops.push({ type: 'del', text: A[s + i++] });
    while (j < m) ops.push({ type: 'add', text: B[s + j++] });
    for (let k = ea; k < A.length; k++) ops.push({ type: 'same', text: A[k] });
    return ops;
}

/* ---------- Numbers ---------- */
const round6 = (x) => Math.round(x * 1e6) / 1e6;
export function percentage(mode, a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Enter valid numbers.');
    switch (mode) {
        case 'of': return round6((a / 100) * b);
        case 'is':
            if (b === 0) throw new Error('Undefined: cannot express a value as a percentage of zero.');
            return round6((a / b) * 100);
        case 'change':
            if (a === 0) throw new Error('Undefined: percent change from zero cannot be calculated.');
            return round6(((b - a) / Math.abs(a)) * 100);
        default: throw new Error('Unknown mode');
    }
}

/* ---------- Randomness ---------- */
export function secureInt(max) {
    if (!Number.isInteger(max) || max < 1 || max > 2 ** 32) throw new RangeError('max out of range');
    const buf = new Uint32Array(1);
    const limit = Math.floor(2 ** 32 / max) * max; // rejection sampling avoids modulo bias
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
}
const SETS = { lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', digits: '0123456789', symbols: '!@#$%^&*()-_=+[]{};:,.<>?' };
export function generatePassword({ length = 16, lower = true, upper = true, digits = true, symbols = true, avoidAmbiguous = false } = {}) {
    length = Math.floor(length);
    if (!(length >= 4 && length <= 128)) throw new Error('Length must be between 4 and 128.');
    const strip = (s) => (avoidAmbiguous ? s.replace(/[0O1lI]/g, '') : s);
    const pools = Object.entries({ lower, upper, digits, symbols }).filter(([, on]) => on).map(([k]) => strip(SETS[k]));
    if (!pools.length) throw new Error('Select at least one character type.');
    const all = pools.join('');
    const chars = pools.map((p) => p[secureInt(p.length)]); // guarantee one of each selected type
    while (chars.length < length) chars.push(all[secureInt(all.length)]);
    for (let i = chars.length - 1; i > 0; i--) { const j = secureInt(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
    return { password: chars.join(''), bits: Math.round(length * Math.log2(all.length)) };
}
export function uuidv4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/* ---------- Time ---------- */
export function tsToDate(value) {
    const s = String(value).trim();
    if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error('Enter a numeric Unix timestamp.');
    const n = Number(s), abs = Math.abs(n);
    const [unit, div] = abs >= 1e17 ? ['nanoseconds', 1e6] : abs >= 1e14 ? ['microseconds', 1e3] : abs >= 1e11 ? ['milliseconds', 1] : ['seconds', 1 / 1000];
    const ms = Math.round(n / div);
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) throw new Error('Timestamp is out of range.');
    return { unit, ms, iso: d.toISOString(), utc: d.toUTCString(), local: d.toString() };
}
export function dateToTs(str) {
    const d = new Date(str.trim());
    if (!str.trim() || Number.isNaN(d.getTime())) throw new Error('Could not parse that date. Try a format like 2026-01-31T12:00:00Z.');
    return { seconds: Math.floor(d.getTime() / 1000), milliseconds: d.getTime() };
}

/* ---------- Regex ---------- */
export function runRegex(pattern, flags, text, max = 1000) {
    if (pattern === '') throw new Error('Enter a pattern.');
    const f = [...new Set((flags || '').split(''))];
    if (!f.includes('g')) f.push('g');
    let re;
    try { re = new RegExp(pattern, f.join('')); } catch (e) { throw new Error(e.message); }
    const out = [];
    for (const m of text.matchAll(re)) {
        out.push({ index: m.index, match: m[0], groups: m.slice(1), named: m.groups ? { ...m.groups } : null });
        if (out.length >= max) break;
    }
    return out;
}

/* ---------- SEO ---------- */
export function metaTags(o) {
    const a = escapeHtml, L = [];
    if (o.basics !== false) L.push('<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">');
    if (o.title) L.push(`<title>${a(o.title)}</title>`);
    if (o.description) L.push(`<meta name="description" content="${a(o.description)}">`);
    if (o.robots) L.push(`<meta name="robots" content="${a(o.robots)}">`);
    if (o.canonical) L.push(`<link rel="canonical" href="${a(o.canonical)}">`);
    if (o.openGraph) {
        L.push('<meta property="og:type" content="website">');
        if (o.title) L.push(`<meta property="og:title" content="${a(o.title)}">`);
        if (o.description) L.push(`<meta property="og:description" content="${a(o.description)}">`);
        if (o.canonical) L.push(`<meta property="og:url" content="${a(o.canonical)}">`);
        if (o.image) L.push(`<meta property="og:image" content="${a(o.image)}">`);
        if (o.siteName) L.push(`<meta property="og:site_name" content="${a(o.siteName)}">`);
    }
    if (o.twitter) {
        L.push(`<meta name="twitter:card" content="${o.image ? 'summary_large_image' : 'summary'}">`);
        if (o.title) L.push(`<meta name="twitter:title" content="${a(o.title)}">`);
        if (o.description) L.push(`<meta name="twitter:description" content="${a(o.description)}">`);
        if (o.image) L.push(`<meta name="twitter:image" content="${a(o.image)}">`);
    }
    return L.join('\n');
}

/* ---------- QR ---------- */
const luminance = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
        .map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
};
export function contrastRatio(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}
export function qrPayload(type, d) {
    const need = (v, msg) => { if (!v || !String(v).trim()) throw new Error(msg); return String(v).trim(); };
    switch (type) {
        case 'text': return need(d.text, 'Enter some text.');
        case 'url': {
            let u = need(d.url, 'Enter a URL.');
            if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
            let parsed;
            try { parsed = new URL(u); } catch { throw new Error('That does not look like a valid URL.'); }
            if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https URLs are supported.');
            return parsed.href;
        }
        case 'wifi': {
            const esc = (s) => s.replace(/([\\;,:"])/g, '\\$1');
            const sec = ['WPA', 'WEP', 'nopass'].includes(d.security) ? d.security : 'WPA';
            const ssid = need(d.ssid, 'Enter the network name (SSID).');
            if (sec !== 'nopass') need(d.password, 'Enter the Wi-Fi password, or choose "No password".');
            return `WIFI:T:${sec};S:${esc(ssid)};${sec === 'nopass' ? '' : `P:${esc(d.password)};`}${d.hidden ? 'H:true;' : ''};`;
        }
        case 'contact': {
            const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
            const name = need(d.name, 'Enter a name.');
            if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) throw new Error('Enter a valid email address.');
            const parts = name.split(/\s+/);
            const last = parts.length > 1 ? parts.pop() : '';
            const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${esc(last)};${esc(parts.join(' '))};;;`, `FN:${esc(name)}`];
            if (d.org) lines.push(`ORG:${esc(d.org)}`);
            if (d.phone) lines.push(`TEL:${esc(d.phone)}`);
            if (d.email) lines.push(`EMAIL:${esc(d.email)}`);
            if (d.url) lines.push(`URL:${esc(d.url)}`);
            lines.push('END:VCARD');
            return lines.join('\n');
        }
        case 'email': {
            const email = need(d.email, 'Enter an email address.');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
            const q = [];
            if (d.subject) q.push('subject=' + encodeURIComponent(d.subject));
            if (d.body) q.push('body=' + encodeURIComponent(d.body));
            return `mailto:${email}${q.length ? '?' + q.join('&') : ''}`;
        }
        default: throw new Error('Unknown QR type.');
    }
}
