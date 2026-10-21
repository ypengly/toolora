@extends('layouts.app')
@section('title', 'Privacy Policy | Toolora')
@section('description', 'How Toolora handles your data.')
@section('content')
<div class="container-x max-w-3xl py-12 prose-tool">
    <h1 class="mb-4 text-3xl font-bold">Privacy Policy</h1>
    <p><strong>Tool inputs.</strong> All current tools process text and files locally in your browser. We do not receive, store or log what you enter or upload into a tool.</p>
    <p><strong>Accounts.</strong> If you register, we store your name, email address and a hashed password, plus the tools you mark as favorites. You can contact us to request deletion.</p>
    <p><strong>Contact messages.</strong> If you write to us, we store your email address, subject and message so we can respond.</p>
    <p><strong>Cookies and local storage.</strong> We use a session cookie and a CSRF token to keep the site secure and keep you signed in, and your browser&rsquo;s local storage to remember your light or dark theme choice.</p>
    <p><strong>Analytics and advertising.</strong> This version does not include analytics or advertising. If that changes, this policy will be updated first.</p>
    <p><strong>Server logs.</strong> Our hosting software may keep standard access and error logs (such as IP address and requested URL) for security and debugging.</p>
</div>
@endsection
