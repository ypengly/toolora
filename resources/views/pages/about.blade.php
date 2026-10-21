@extends('layouts.app')
@section('title', 'About Toolora')
@section('description', 'Toolora is a collection of free, browser-based tools for everyday tasks.')
@section('content')
<div class="container-x max-w-3xl py-12 prose-tool">
    <h1 class="mb-4 text-3xl font-bold">About Toolora</h1>
    <p>Toolora is a collection of small, focused online tools for developers, students, designers, creators and everyday users. Our goal is simple: find a tool, finish the job in seconds, and move on.</p>
    <p>Current tools run in your browser, so the text and images you work with stay on your device. Accounts are optional and only add conveniences such as favorites.</p>
    <p>Questions or suggestions? Use the <a class="text-indigo-600 underline dark:text-indigo-400" href="{{ route('contact') }}">contact form</a>.</p>
</div>
@endsection
