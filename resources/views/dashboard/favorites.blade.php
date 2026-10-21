@extends('layouts.app')
@section('title', 'Favorite tools | Toolora')
@section('noindex', '1')
@section('content')
<div class="container-x py-10">
    <h1 class="text-3xl font-bold">Favorite tools</h1>
    @if($tools->isEmpty())
        <div class="card mt-6 text-center"><p>You have no favorites yet. Open any tool and choose “Add to favorites”.</p><a class="btn btn-primary mt-4" href="{{ route('tools.index') }}">Browse tools</a></div>
    @else
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">@foreach($tools as $tool)@include('partials.tool-card', ['tool' => $tool])@endforeach</div>
    @endif
</div>
@endsection
