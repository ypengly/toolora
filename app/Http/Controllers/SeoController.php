<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Tool;

class SeoController extends Controller
{
    /** Only published, canonical, indexable pages. */
    public function sitemap()
    {
        $urls = [
            [route('home'), null], [route('tools.index'), null], [route('about'), null],
            [route('privacy'), null], [route('terms'), null], [route('contact'), null],
        ];
        foreach (Category::orderBy('sort_order')->get() as $c) {
            $urls[] = [route('tools.category', $c->slug), $c->updated_at];
        }
        foreach (Tool::published()->orderBy('sort_order')->get() as $t) {
            $urls[] = [route('tools.show', $t->slug), $t->updated_at];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as [$loc, $mod]) {
            $xml .= '  <url><loc>'.e($loc).'</loc>'.($mod ? '<lastmod>'.$mod->toAtomString().'</lastmod>' : '').'</url>'."\n";
        }

        return response($xml.'</urlset>', 200, ['Content-Type' => 'application/xml']);
    }

    public function robots()
    {
        $body = "User-agent: *\nDisallow: /dashboard\nDisallow: /auth/\nDisallow: /*?q=\nDisallow: /*?sort=\nDisallow: /*?category=\n\nSitemap: ".route('sitemap')."\n";

        return response($body, 200, ['Content-Type' => 'text/plain']);
    }
}
