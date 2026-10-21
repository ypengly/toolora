<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index(Request $request)
    {
        $q = mb_substr(trim((string) $request->query('q', '')), 0, 100);
        $sort = in_array($request->query('sort'), ['featured', 'new', 'name'], true) ? $request->query('sort') : 'featured';
        $categorySlug = is_string($request->query('category')) ? $request->query('category') : null;

        $query = Tool::published()->with('category');

        if ($categorySlug) {
            $query->whereHas('category', fn ($c) => $c->where('slug', $categorySlug));
        }

        // Every search word must match name, description, keywords or category name.
        foreach (array_slice(preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY), 0, 6) as $word) {
            $like = '%'.addcslashes($word, '%_\\').'%';
            $query->where(fn ($w) => $w->where('name', 'like', $like)
                ->orWhere('description', 'like', $like)
                ->orWhere('keywords', 'like', $like)
                ->orWhereHas('category', fn ($c) => $c->where('name', 'like', $like)));
        }

        match ($sort) {
            'new' => $query->orderByDesc('published_at')->orderByDesc('id'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('is_featured')->orderBy('sort_order'),
        };

        return view('tools.index', [
            'tools' => $query->paginate(24)->withQueryString(),
            'categories' => Category::orderBy('sort_order')->get(),
            'q' => $q, 'sort' => $sort, 'activeCategory' => $categorySlug,
            'noindex' => $q !== '' || $sort !== 'featured' || $categorySlug,
        ]);
    }

    public function category(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return view('tools.category', [
            'category' => $category,
            'tools' => Tool::published()->with('category')->where('category_id', $category->id)->orderBy('sort_order')->get(),
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $tool = Tool::published()->with('category')->where('slug', $slug)->firstOrFail();
        $content = $tool->content();

        return view('tools.show', [
            'tool' => $tool,
            'content' => $content,
            'related' => Tool::published()->with('category')->whereIn('slug', $content['related'] ?? [])->get(),
            'isFavorite' => $request->user()
                ? $request->user()->favorites()->where('tools.id', $tool->id)->exists()
                : false,
        ]);
    }
}
