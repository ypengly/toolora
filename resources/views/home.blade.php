@extends('layouts.app')
@section('title', 'Toolora: Free Online Tools for Images, Text, Code and More')
@section('description', 'Free online tools for images, text, coding, QR codes, SEO and everyday tasks. Fast, private and easy to use.')
@section('content')
<section class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div class="container-x py-16 text-center sm:py-24">
        <h1 class="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Everyday Problems. One Simple Toolkit.</h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">Free online tools for images, text, coding, QR codes, SEO, and everyday tasks. Fast, private, and easy to use.</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a href="{{ route('tools.index') }}" class="btn btn-primary px-5 py-2.5">Explore All Tools</a>
            <a href="{{ route('tools.category', 'developer') }}" class="btn px-5 py-2.5">Browse Developer Tools</a>
        </div>
        <form action="{{ route('tools.index') }}" method="get" role="search" class="mx-auto mt-8 flex max-w-xl gap-2">
            <label class="sr-only" for="hero-q">Search for a tool</label>
            <input id="hero-q" name="q" type="search" placeholder="Search for a tool..." class="inp py-3 text-base">
            <button class="btn btn-primary px-5" type="submit">Search</button>
        </form>
        <div class="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            @foreach($suggested as $s)
                <a href="{{ route('tools.show', $s->slug) }}" class="rounded-full border border-slate-200 px-3 py-1 hover:border-indigo-400 dark:border-slate-700">{{ $s->name }}</a>
            @endforeach
        </div>
    </div>
</section>

<section class="container-x py-14">
    <div class="mb-6 flex items-end justify-between"><h2 class="text-2xl font-bold">Popular tools</h2><a class="text-sm font-medium text-indigo-600 dark:text-indigo-400" href="{{ route('tools.index') }}">View all</a></div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">@foreach($featured as $tool)@include('partials.tool-card', ['tool' => $tool])@endforeach</div>
</section>

<section class="container-x py-6">
    <h2 class="mb-6 text-2xl font-bold">Categories</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @foreach($categories as $c)
            <a href="{{ route('tools.category', $c->slug) }}" class="card flex items-center gap-4 transition hover:border-indigo-400">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"><i data-lucide="{{ $c->icon }}" class="h-6 w-6"></i></span>
                <span><span class="block font-semibold">{{ $c->name }}</span><span class="text-sm text-slate-500">{{ $c->tools_count }} {{ Str::plural('tool', $c->tools_count) }}</span></span>
            </a>
        @endforeach
    </div>
</section>

<section class="container-x py-14">
    <h2 class="mb-6 text-2xl font-bold">Why Toolora?</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @foreach([
            ['gift', 'Free tools', 'Every tool listed here is free to use, with no account required.'],
            ['wrench', 'No installation', 'Open a page and get the job done in your browser.'],
            ['cpu', 'Browser-based processing', 'Current tools run on your device, so your text and images are not uploaded.'],
            ['shield-check', 'Privacy-conscious', 'No tool inputs are sent to our servers or to third parties.'],
            ['zap', 'Fast results', 'Results appear instantly; there are no queues or uploads to wait for.'],
            ['smartphone', 'Works across devices', 'Responsive layouts for phones, tablets and desktops.'],
        ] as [$icon, $t, $d])
            <div class="card"><i data-lucide="{{ $icon }}" class="mb-3 h-6 w-6 text-indigo-600 dark:text-indigo-400"></i><h3 class="font-semibold">{{ $t }}</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ $d }}</p></div>
        @endforeach
    </div>
</section>

<section class="container-x py-6">
    <h2 class="mb-6 text-2xl font-bold">Recently added</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">@foreach($recent as $tool)@include('partials.tool-card', ['tool' => $tool])@endforeach</div>
</section>
@endsection
