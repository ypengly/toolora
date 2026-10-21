@extends('layouts.app')
@section('title', 'All Tools: Toolora')
@section('description', 'Browse every free Toolora tool: image, developer, text, QR code, SEO and everyday utilities.')
@section('canonical', route('tools.index'))
@if($noindex)@section('noindex', '1')@endif
@section('content')
<div class="container-x py-10">
    <h1 class="text-3xl font-bold">All Tools</h1>
    <form method="get" action="{{ route('tools.index') }}" role="search" class="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <div><label class="sr-only" for="q">Search</label><input class="inp" id="q" name="q" type="search" value="{{ $q }}" placeholder="Search by name, keyword or category…"></div>
        <div><label class="sr-only" for="category">Category</label>
            <select class="inp" id="category" name="category"><option value="">All categories</option>
                @foreach($categories as $c)<option value="{{ $c->slug }}" @selected($activeCategory === $c->slug)>{{ $c->name }}</option>@endforeach
            </select></div>
        <div><label class="sr-only" for="sort">Sort</label>
            <select class="inp" id="sort" name="sort">
                <option value="featured" @selected($sort === 'featured')>Featured</option>
                <option value="new" @selected($sort === 'new')>Recently added</option>
                <option value="name" @selected($sort === 'name')>Name A–Z</option>
            </select></div>
        <button class="btn btn-primary" type="submit">Apply</button>
    </form>

    @if($tools->isEmpty())
        <div class="card mt-8 text-center">
            <h2 class="text-lg font-semibold">No tools match your search</h2>
            <p class="mt-1 text-slate-600 dark:text-slate-400">Try a different keyword, such as “json”, “image” or “qr”, or <a class="text-indigo-600 underline dark:text-indigo-400" href="{{ route('tools.index') }}">clear all filters</a>.</p>
        </div>
    @else
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">@foreach($tools as $tool)@include('partials.tool-card', ['tool' => $tool])@endforeach</div>
        <div class="mt-8">{{ $tools->links() }}</div>
    @endif
</div>
@endsection
