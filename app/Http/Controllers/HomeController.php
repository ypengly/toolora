<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Tool;

class HomeController extends Controller
{
    public function index()
    {
        return view('home', [
            'suggested' => Tool::published()->whereIn('slug', ['json-formatter', 'image-compressor', 'qr-code-generator', 'word-counter'])->get(),
            'featured' => Tool::published()->with('category')->where('is_featured', true)->orderBy('sort_order')->limit(8)->get(),
            'categories' => Category::withCount(['tools' => fn ($q) => $q->published()])->orderBy('sort_order')->get(),
            'recent' => Tool::published()->with('category')->orderByDesc('published_at')->orderByDesc('id')->limit(6)->get(),
        ]);
    }
}
