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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name_en')->comment('Product name in English');
            $table->string('name_id')->comment('Product name in Indonesian');
            $table->string('slug')->unique()->comment('URL-friendly identifier');
            $table->text('description_en')->nullable()->comment('Product description in English');
            $table->text('description_id')->nullable()->comment('Product description in Indonesian');
            $table->text('short_description_en')->nullable()->comment('Short description in English');
            $table->text('short_description_id')->nullable()->comment('Short description in Indonesian');
            $table->decimal('base_price', 15, 2)->comment('Base price in IDR');
            $table->string('sku')->unique()->comment('Stock keeping unit');
            $table->integer('stock_quantity')->default(0)->comment('Total stock quantity');
            $table->decimal('weight', 8, 2)->nullable()->comment('Product weight in kg');
            $table->json('images')->nullable()->comment('Product images array');
            $table->boolean('is_active')->default(true)->comment('Product status');
            $table->boolean('is_featured')->default(false)->comment('Featured product flag');
            $table->timestamps();
            
            $table->index('category_id');
            $table->index('slug');
            $table->index('sku');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index(['is_active', 'is_featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};