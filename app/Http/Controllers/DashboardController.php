<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function favorites(Request $request)
    {
        return view('dashboard.favorites', [
            'tools' => $request->user()->favorites()->published()->with('category')->orderBy('tools.name')->get(),
        ]);
    }
}
