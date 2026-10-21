<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Toolora: Small Tools. Big Productivity.')</title>
    <meta name="description" content="@yield('description', 'Free online tools for images, text, coding, QR codes, SEO and everyday tasks. Fast, private and easy to use.')">
    <link rel="canonical" href="@yield('canonical', url()->current())">
    @hasSection('noindex')<meta name="robots" content="noindex,follow">@endif
    <meta property="og:site_name" content="Toolora">
    <meta property="og:type" content="website">
    <meta property="og:title" content="@yield('title', 'Toolora')">
    <meta property="og:description" content="@yield('description', 'Free online tools for everyday tasks.')">
    <meta property="og:url" content="@yield('canonical', url()->current())">
    <meta name="twitter:card" content="summary">
    <script>
        (function () {
            try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
            } catch (e) {}
        })();
    </script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>
<body class="flex min-h-screen flex-col">
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2 dark:focus:bg-slate-900">Skip to content</a>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
    <div class="container-x flex h-16 items-center gap-4">
        <a href="{{ route('home') }}" class="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><i data-lucide="wrench" class="h-4 w-4"></i></span>Toolora
        </a>
        <nav class="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            <a class="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('home') }}">Home</a>
            <a class="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('tools.index') }}">All Tools</a>
            <div class="group relative">
                <button class="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" aria-haspopup="true">Categories</button>
                <div class="invisible absolute left-0 top-full w-56 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                    @foreach($navCategories ?? [] as $c)
                        <a class="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('tools.category', $c['slug']) }}">{{ $c['name'] }}</a>
                    @endforeach
                </div>
            </div>
        </nav>
        <div class="ml-auto flex items-center gap-2">
            <form action="{{ route('tools.index') }}" method="get" role="search" class="hidden lg:block">
                <label class="sr-only" for="hdr-q">Search tools</label>
                <input id="hdr-q" name="q" type="search" placeholder="Search tools…" class="inp w-52">
            </form>
            <button type="button" id="theme-toggle" class="btn px-2.5" aria-label="Toggle dark mode"><i data-lucide="moon" class="h-4 w-4 dark:hidden"></i><i data-lucide="sun" class="hidden h-4 w-4 dark:block"></i></button>
            @auth
                <a href="{{ route('dashboard') }}" class="btn hidden sm:inline-flex">Dashboard</a>
                <form method="post" action="{{ route('logout') }}" class="hidden sm:block">@csrf<button class="btn">Sign out</button></form>
            @else
                <a href="{{ route('login') }}" class="btn hidden sm:inline-flex">Sign In</a>
                <a href="{{ route('register') }}" class="btn btn-primary hidden sm:inline-flex">Get Started</a>
            @endauth
            <button type="button" id="menu-toggle" class="btn px-2.5 md:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><i data-lucide="menu" class="h-4 w-4"></i></button>
        </div>
    </div>
    <div id="mobile-menu" class="hidden border-t border-slate-200 p-4 md:hidden dark:border-slate-800">
        <form action="{{ route('tools.index') }}" method="get" role="search" class="mb-3">
            <label class="sr-only" for="m-q">Search tools</label>
            <input id="m-q" name="q" type="search" placeholder="Search tools…" class="inp">
        </form>
        <div class="grid gap-1 text-sm">
            <a class="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('home') }}">Home</a>
            <a class="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('tools.index') }}">All Tools</a>
            @foreach($navCategories ?? [] as $c)
                <a class="rounded-lg px-3 py-2 pl-6 hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('tools.category', $c['slug']) }}">{{ $c['name'] }}</a>
            @endforeach
            @auth
                <a class="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('dashboard') }}">Dashboard</a>
                <form method="post" action="{{ route('logout') }}">@csrf<button class="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800">Sign out</button></form>
            @else
                <a class="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="{{ route('login') }}">Sign In</a>
                <a class="btn btn-primary mt-2" href="{{ route('register') }}">Get Started</a>
            @endauth
        </div>
    </div>
</header>

<main id="main" class="flex-1">
    @yield('content')
</main>

<footer class="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div class="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
            <div class="text-lg font-bold">Toolora</div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Small Tools. Big Productivity.</p>
        </div>
        <div>
            <h2 class="mb-2 text-sm font-semibold">Categories</h2>
            <ul class="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                @foreach($navCategories ?? [] as $c)
                    <li><a class="hover:underline" href="{{ route('tools.category', $c['slug']) }}">{{ $c['name'] }}</a></li>
                @endforeach
            </ul>
        </div>
        <div>
            <h2 class="mb-2 text-sm font-semibold">Toolora</h2>
            <ul class="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li><a class="hover:underline" href="{{ route('tools.index') }}">All tools</a></li>
                <li><a class="hover:underline" href="{{ route('about') }}">About</a></li>
                <li><a class="hover:underline" href="{{ route('contact') }}">Contact</a></li>
            </ul>
        </div>
        <div>
            <h2 class="mb-2 text-sm font-semibold">Legal</h2>
            <ul class="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li><a class="hover:underline" href="{{ route('privacy') }}">Privacy</a></li>
                <li><a class="hover:underline" href="{{ route('terms') }}">Terms</a></li>
            </ul>
        </div>
    </div>
    <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">&copy; {{ date('Y') }} Toolora. All rights reserved.</div>
</footer>
</body>
</html>
