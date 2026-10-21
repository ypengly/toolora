@extends('layouts.app')
@section('title', 'Contact Toolora')
@section('description', 'Send feedback, report a bug or suggest a tool.')
@section('content')
<div class="container-x max-w-xl py-12">
    <h1 class="mb-2 text-3xl font-bold">Contact us</h1>
    <p class="mb-6 text-slate-600 dark:text-slate-400">Report a bug, suggest a tool or ask a question. Please do not include passwords or sensitive data.</p>
    @if(session('status'))<div class="alert alert-ok mb-4" role="status">{{ session('status') }}</div>@endif
    <form method="post" action="{{ route('contact.store') }}" class="card space-y-4">@csrf
        <div><label class="label" for="email">Your email</label><input class="inp" id="email" name="email" type="email" value="{{ old('email', auth()->user()?->email) }}" required>@error('email')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="subject">Subject</label><input class="inp" id="subject" name="subject" value="{{ old('subject') }}" required maxlength="150">@error('subject')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="message">Message</label><textarea class="inp" id="message" name="message" rows="6" required minlength="10" maxlength="5000">{{ old('message') }}</textarea>@error('message')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <button class="btn btn-primary" type="submit">Send message</button>
    </form>
</div>
@endsection
