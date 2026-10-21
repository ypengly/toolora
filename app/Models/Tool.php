<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tool extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'title', 'description', 'keywords', 'icon',
        'access_level', 'status', 'is_featured', 'sort_order', 'published_at',
    ];

    protected function casts(): array
    {
        return ['is_featured' => 'boolean', 'published_at' => 'datetime'];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** Only live tools. Columns are table-qualified so this also works through pivot relations. */
    public function scopePublished(Builder $q): Builder
    {
        return $q->where('tools.status', 'published')->where('tools.published_at', '<=', now());
    }

    /** Page content (how-to, FAQs, explanation) from config/tools.php. */
    public function content(): array
    {
        return config('tools.tools.'.$this->slug, []);
    }
}
