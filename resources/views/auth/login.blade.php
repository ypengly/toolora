@extends('layouts.app')
@section('title', 'Sign in | Toolora')
@section('noindex', '1')
@section('content')
<div class="container-x max-w-md py-14">
    <h1 class="mb-6 text-2xl font-bold">Sign in</h1>
    <form method="post" action="{{ url('/auth/login') }}" class="card space-y-4">@csrf
        <div><label class="label" for="email">Email</label><input class="inp" id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email">@error('email')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="password">Password</label><input class="inp" id="password" name="password" type="password" required autocomplete="current-password"></div>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="remember" value="1"> Remember me</label>
        <button class="btn btn-primary w-full" type="submit">Sign in</button>
    </form>
    <p class="mt-4 text-sm text-slate-600 dark:text-slate-400">No account? <a class="text-indigo-600 underline dark:text-indigo-400" href="{{ route('register') }}">Create one</a>. Accounts are optional; all tools work without one.</p>
</div>
@endsection
