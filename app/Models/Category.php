<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'icon', 'sort_order'];

    public function tools(): HasMany
    {
        return $this->hasMany(Tool::class);
    }
}
