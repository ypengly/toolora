<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request, string $slug)
    {
        $tool = Tool::published()->where('slug', $slug)->firstOrFail();
        $request->user()->favorites()->toggle($tool->id);

        return back();
    }
}
