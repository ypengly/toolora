<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Tool;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    public function run(): void
    {
        $ids = [];
        $i = 0;
        foreach (config('tools.categories') as $slug => $c) {
            $ids[$slug] = Category::updateOrCreate(['slug' => $slug], [
                'name' => $c['name'], 'description' => $c['description'],
                'icon' => $c['icon'], 'sort_order' => $i++,
            ])->id;
        }

        $i = 0;
        foreach (config('tools.tools') as $slug => $t) {
            $tool = Tool::firstOrNew(['slug' => $slug]);
            $tool->fill([
                'category_id' => $ids[$t['category']], 'name' => $t['name'], 'title' => $t['title'],
                'description' => $t['description'], 'keywords' => $t['keywords'], 'icon' => $t['icon'],
                'is_featured' => $t['featured'], 'sort_order' => $i++,
            ]);
            if (! $tool->exists) {
                $tool->access_level = 'free';
                $tool->status = 'published';
                $tool->published_at = now()->subMinute();
            }
            $tool->save();
        }
    }
}
