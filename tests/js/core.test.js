import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../../resources/js/core.js';

test('json: format, minify, error location', () => {
    assert.equal(c.formatJson('{"a":1}', 2), '{\n  "a": 1\n}');
    assert.equal(c.minifyJson('{ "a" : [1, 2] }'), '{"a":[1,2]}');
    const bad = '{\n  "a": 1,\n  "b": }';
    let err; try { c.formatJson(bad); } catch (e) { err = e; }
    const p = c.parseJsonError(bad, err);
    assert.ok(p.message.length > 0);
    assert.equal(p.line, 3);
});

test('countText', () => {
    assert.deepEqual(Object.values(c.countText('')).slice(0, 6), [0, 0, 0, 0, 0, 0]);
    const r = c.countText('Hello world. How are you?\n\nFine!');
    assert.equal(r.words, 6);
    assert.equal(r.sentences, 3);
    assert.equal(r.paragraphs, 2);
    assert.equal(r.lines, 3);
    assert.equal(c.countText('😀 a').characters, 3);
});

test('convertCase', () => {
    assert.equal(c.convertCase('hello big WORLD', 'title'), 'Hello Big World');
    assert.equal(c.convertCase('hello. how are you? fine', 'sentence'), 'Hello. How are you? Fine');
    assert.equal(c.convertCase('Hello big-world_foo', 'camel'), 'helloBigWorldFoo');
    assert.equal(c.convertCase('helloWorld', 'snake'), 'hello_world');
    assert.equal(c.convertCase('Hello World', 'kebab'), 'hello-world');
    assert.equal(c.convertCase('hello world', 'constant'), 'HELLO_WORLD');
    assert.equal(c.convertCase('straße', 'upper'), 'STRASSE');
});

test('base64 round-trip, url-safe and errors', () => {
    const s = 'héllo 😀 世界';
    assert.equal(c.b64Decode(c.b64Encode(s)), s);
    assert.equal(c.b64Encode('??>>', true), 'Pz8-Pg');
    assert.equal(c.b64Decode('Pz8-Pg'), '??>>');
    assert.throws(() => c.b64Decode('***'), /not valid Base64/);
    assert.throws(() => c.b64Decode('/w=='), /UTF-8/);
});

test('url encode/decode', () => {
    assert.equal(c.urlEncode('a b&c=d'), 'a%20b%26c%3Dd');
    assert.equal(c.urlEncode('https://x.com/a b?q=1', 'full'), 'https://x.com/a%20b?q=1');
    assert.equal(c.urlDecode('a%20b+c'), 'a b c');
    assert.throws(() => c.urlDecode('100%'), /Malformed/);
});

test('diffLines', () => {
    const ops = c.diffLines('a\nb\nc', 'a\nx\nc');
    assert.deepEqual(ops.map((o) => o.type + o.text), ['samea', 'delb', 'addx', 'samec']);
    assert.ok(c.diffLines('A', 'a', { ignoreCase: true }).every((o) => o.type === 'same'));
    assert.ok(c.diffLines('a  b', 'a b', { ignoreWhitespace: true }).every((o) => o.type === 'same'));
    assert.deepEqual(c.diffLines('', ''), []);
    assert.deepEqual(c.diffLines('', 'x').map((o) => o.type), ['add']);
});

test('percentage', () => {
    assert.equal(c.percentage('of', 15, 200), 30);
    assert.equal(c.percentage('is', 50, 200), 25);
    assert.equal(c.percentage('change', 80, 100), 25);
    assert.equal(c.percentage('change', 100, 80), -20);
    assert.equal(c.percentage('change', -10, -5), 50);
    assert.throws(() => c.percentage('is', 1, 0), /zero/);
    assert.throws(() => c.percentage('change', 0, 5), /zero/);
    assert.throws(() => c.percentage('of', NaN, 1));
});

test('password generator', () => {
    for (let i = 0; i < 200; i++) {
        const { password } = c.generatePassword({ length: 12 });
        assert.equal(password.length, 12);
        assert.match(password, /[a-z]/); assert.match(password, /[A-Z]/); assert.match(password, /\d/); assert.match(password, /[^A-Za-z0-9]/);
    }
    assert.match(c.generatePassword({ length: 30, upper: false, digits: false, symbols: false }).password, /^[a-z]+$/);
    assert.doesNotMatch(c.generatePassword({ length: 128, avoidAmbiguous: true }).password, /[0O1lI]/);
    assert.throws(() => c.generatePassword({ lower: false, upper: false, digits: false, symbols: false }));
    assert.throws(() => c.generatePassword({ length: 3 }));
    const counts = new Array(7).fill(0);
    for (let i = 0; i < 70000; i++) counts[c.secureInt(7)]++;
    counts.forEach((n) => assert.ok(n > 9300 && n < 10700, 'roughly uniform'));
});

test('uuid v4', () => {
    const u = c.uuidv4();
    assert.match(u, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('timestamps', () => {
    assert.equal(c.tsToDate('0').iso, '1970-01-01T00:00:00.000Z');
    assert.equal(c.tsToDate('1767225600').iso, '2026-01-01T00:00:00.000Z');
    assert.equal(c.tsToDate('1767225600000').unit, 'milliseconds');
    assert.equal(c.tsToDate('1767225600000').iso, '2026-01-01T00:00:00.000Z');
    assert.equal(c.tsToDate('4102444800').iso, '2100-01-01T00:00:00.000Z');
    assert.throws(() => c.tsToDate('abc'));
    assert.equal(c.dateToTs('2026-01-01T00:00:00Z').seconds, 1767225600);
    assert.throws(() => c.dateToTs('nope'));
});

test('regex', () => {
    const r = c.runRegex('(\\w+)@(?<d>\\w+)\\.com', 'i', 'a@b.com, C@D.com');
    assert.equal(r.length, 2);
    assert.deepEqual(r[0].groups, ['a', 'b']);
    assert.equal(r[1].named.d, 'D');
    assert.equal(c.runRegex('x*', '', 'ab').length, 3);
    assert.throws(() => c.runRegex('(', '', 'a'));
    assert.throws(() => c.runRegex('', '', 'a'));
});

test('metaTags escapes', () => {
    const out = c.metaTags({ title: 'A "q" <b>', description: 'd', canonical: 'https://e.com', openGraph: true, twitter: true });
    assert.ok(out.includes('<title>A &quot;q&quot; &lt;b&gt;</title>'));
    assert.ok(out.includes('og:url'));
    assert.ok(out.includes('summary"'));
});

test('qrPayload', () => {
    assert.equal(c.qrPayload('url', { url: 'example.com' }), 'https://example.com/');
    assert.throws(() => c.qrPayload('url', { url: 'javascript:alert(1)' }), /http/);
    assert.equal(c.qrPayload('wifi', { ssid: 'My;Net', password: 'p:w', security: 'WPA' }), 'WIFI:T:WPA;S:My\\;Net;P:p\\:w;;');
    assert.equal(c.qrPayload('email', { email: 'a@b.co', subject: 'Hi there' }), 'mailto:a@b.co?subject=Hi%20there');
    assert.match(c.qrPayload('contact', { name: 'Ada Lovelace', email: 'a@b.co' }), /^BEGIN:VCARD\nVERSION:3.0\nN:Lovelace;Ada/);
    assert.throws(() => c.qrPayload('text', { text: '  ' }));
    assert.ok(c.contrastRatio('#000000', '#ffffff') > 20);
    assert.ok(c.contrastRatio('#777777', '#888888') < 2);
});

test('findJsonErrorPosition agrees with JSON.parse', () => {
    const good = ['{}', '[]', '[1,2.5e3,-0,"a\\u00e9\\n",null,true,{"a":[{}]}]', ' 12 '];
    const bad = ['{"a":1,}', "{'a':1}", '[1,]', '{"a" 1}', '"abc', '01', '[1 2]', '{"a":1}}', '', '{"a":tru}', '"\\x"'];
    for (const g of good) assert.equal(c.findJsonErrorPosition(g), -1, g);
    for (const b of bad) {
        assert.throws(() => JSON.parse(b), b);
        assert.ok(c.findJsonErrorPosition(b) >= 0, 'should locate: ' + b);
    }
    assert.equal(c.findJsonErrorPosition('{"a":1,}'), 7);
});
