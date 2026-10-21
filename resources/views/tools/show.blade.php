@extends('layouts.app')
@section('title', $tool->title.' | Toolora')
@section('description', $tool->description)
@section('canonical', route('tools.show', $tool->slug))
@push('head')
<script type="application/ld+json">{!! json_encode([
    '@context' => 'https://schema.org',
    '@graph' => [
        ['@type' => 'WebApplication', 'name' => $tool->title, 'description' => $tool->description,
         'url' => route('tools.show', $tool->slug), 'applicationCategory' => 'UtilitiesApplication',
         'operatingSystem' => 'Any', 'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD']],
        ['@type' => 'BreadcrumbList', 'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => route('home')],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $tool->category->name, 'item' => route('tools.category', $tool->category->slug)],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $tool->name],
        ]],
    ],
], JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
@endpush
@section('content')
<div class="container-x py-8">
    <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500"><a class="hover:underline" href="{{ route('home') }}">Home</a> / <a class="hover:underline" href="{{ route('tools.category', $tool->category->slug) }}">{{ $tool->category->name }}</a> / <span>{{ $tool->name }}</span></nav>
    <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold">{{ $tool->title }}</h1>
            <p class="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">{{ $tool->description }}</p>
        </div>
        @auth
            <form method="post" action="{{ route('favorites.toggle', $tool->slug) }}">@csrf
                <button class="btn" type="submit"><i data-lucide="heart" class="h-4 w-4 {{ $isFavorite ? 'fill-current text-red-500' : '' }}"></i>{{ $isFavorite ? 'Remove favorite' : 'Add to favorites' }}</button>
            </form>
        @endauth
    </div>

    <div class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950">
        <div id="tool-root" data-tool="{{ $tool->slug }}"><noscript><p class="alert alert-warn">This tool needs JavaScript, because it runs entirely in your browser.</p></noscript></div>
    </div>
    <p class="mt-2 text-xs text-slate-500">Runs locally in your browser. Your input is not uploaded.</p>

    <div class="mt-12 grid gap-10 lg:grid-cols-3">
        <div class="space-y-10 lg:col-span-2">
            @if(!empty($content['howto']))
            <section><h2 class="mb-3 text-xl font-bold">How to use this tool</h2>
                <ol class="list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">@foreach($content['howto'] as $step)<li>{{ $step }}</li>@endforeach</ol></section>
            @endif
            @if(!empty($content['about']))
            <section class="prose-tool"><h2 class="mb-3 text-xl font-bold">About this tool</h2><p>{{ $content['about'] }}</p></section>
            @endif
            @if(!empty($content['faqs']))
            <section><h2 class="mb-3 text-xl font-bold">Frequently asked questions</h2>
                <div class="space-y-2">@foreach($content['faqs'] as [$q, $a])
                    <details class="card p-4"><summary class="cursor-pointer font-medium">{{ $q }}</summary><p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ $a }}</p></details>
                @endforeach</div></section>
            @endif
        </div>
        <aside><h2 class="mb-3 text-xl font-bold">Related tools</h2>
            <div class="grid gap-3">@foreach($related as $r)@include('partials.tool-card', ['tool' => $r])@endforeach</div></aside>
    </div>
</div>
@endsection
