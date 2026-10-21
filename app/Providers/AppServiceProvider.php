<?php

namespace App\Providers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceHttps();
        }

        View::composer('layouts.app', function ($view) {
            $view->with('navCategories', Cache::remember('nav.categories', 3600, fn () =>
                Category::orderBy('sort_order')->get(['name', 'slug'])->toArray()
            ));
        });
    }
}
