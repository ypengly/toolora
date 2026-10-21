@extends('layouts.app')
@section('title', 'Create account | Toolora')
@section('noindex', '1')
@section('content')
<div class="container-x max-w-md py-14">
    <h1 class="mb-6 text-2xl font-bold">Create your account</h1>
    <form method="post" action="{{ url('/auth/register') }}" class="card space-y-4">@csrf
        <div><label class="label" for="name">Name</label><input class="inp" id="name" name="name" value="{{ old('name') }}" required autocomplete="name">@error('name')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="email">Email</label><input class="inp" id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email">@error('email')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="password">Password</label><input class="inp" id="password" name="password" type="password" required minlength="10" autocomplete="new-password"><p class="hint">At least 10 characters.</p>@error('password')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror</div>
        <div><label class="label" for="password_confirmation">Confirm password</label><input class="inp" id="password_confirmation" name="password_confirmation" type="password" required autocomplete="new-password"></div>
        <button class="btn btn-primary w-full" type="submit">Create account</button>
    </form>
</div>
@endsection
