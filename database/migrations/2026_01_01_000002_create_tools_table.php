<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tools', function (Blueprint $t) {
            $t->id();
            $t->foreignId('category_id')->constrained()->restrictOnDelete();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('title');
            $t->string('description', 300);
            $t->text('keywords')->nullable();
            $t->string('icon', 50)->default('wrench');
            $t->string('access_level', 10)->default('free');   // free | premium
            $t->string('status', 10)->default('draft');        // draft | published | archived
            $t->boolean('is_featured')->default(false);
            $t->unsignedSmallInteger('sort_order')->default(0);
            $t->timestamp('published_at')->nullable();
            $t->timestamps();

            $t->index(['status', 'published_at']);
            $t->index(['category_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools');
    }
};
