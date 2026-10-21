import {
    createIcons, Braces, Image, QrCode, Type, CaseSensitive, Binary, Link, Fingerprint, KeyRound, Percent,
    FileImage, Tags, Regex, GitCompare, Clock, Sun, Moon, Menu, Heart, Calculator, Wrench, ArrowRight,
    ShieldCheck, Zap, Smartphone, Gift, Cpu,
} from 'lucide';

const icons = {
    Braces, Image, QrCode, Type, CaseSensitive, Binary, Link, Fingerprint, KeyRound, Percent, FileImage, Tags,
    Regex, GitCompare, Clock, Sun, Moon, Menu, Heart, Calculator, Wrench, ArrowRight, ShieldCheck, Zap, Smartphone, Gift, Cpu,
};
createIcons({ icons });

// Theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
});

// Mobile menu
const menuBtn = document.getElementById('menu-toggle');
menuBtn?.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    const open = menu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
});

// Tool loader: each tool page declares data-tool="{slug}" and loads only its own module.
const root = document.getElementById('tool-root');
if (root) {
    const modules = import.meta.glob('./tools/*.js');
    const loader = modules[`./tools/${root.dataset.tool}.js`];
    if (!loader) {
        root.textContent = 'This tool is not available right now.';
    } else {
        root.textContent = 'Loading tool…';
        loader()
            .then((m) => { root.textContent = ''; m.default(root); })
            .catch((e) => { console.error(e); root.textContent = 'Sorry, this tool failed to load. Please refresh the page.'; });
    }
}
