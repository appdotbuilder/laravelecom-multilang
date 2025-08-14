<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_en')->comment('Category name in English');
            $table->string('name_id')->comment('Category name in Indonesian');
            $table->string('slug')->unique()->comment('URL-friendly identifier');
            $table->text('description_en')->nullable()->comment('Category description in English');
            $table->text('description_id')->nullable()->comment('Category description in Indonesian');
            $table->string('image')->nullable()->comment('Category image path');
            $table->boolean('is_active')->default(true)->comment('Category status');
            $table->timestamps();
            
            $table->index('slug');
            $table->index('is_active');
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};