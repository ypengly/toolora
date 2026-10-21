@extends('layouts.app')
@section('title', $category->name.': Free Online Tools | Toolora')
@section('description', $category->description)
@section('content')
<div class="container-x py-10">
    <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500"><a class="hover:underline" href="{{ route('home') }}">Home</a> / <a class="hover:underline" href="{{ route('tools.index') }}">Tools</a> / <span>{{ $category->name }}</span></nav>
    <h1 class="text-3xl font-bold">{{ $category->name }}</h1>
    <p class="mt-2 text-slate-600 dark:text-slate-400">{{ $category->description }}</p>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">@foreach($tools as $tool)@include('partials.tool-card', ['tool' => $tool])@endforeach</div>
</div>
@endsection
