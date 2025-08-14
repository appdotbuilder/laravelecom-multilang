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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('size')->nullable()->comment('Product size variant');
            $table->string('color')->nullable()->comment('Product color variant');
            $table->string('sku')->unique()->comment('Variant specific SKU');
            $table->decimal('price_adjustment', 10, 2)->default(0)->comment('Price adjustment from base price');
            $table->integer('stock_quantity')->default(0)->comment('Variant stock quantity');
            $table->string('image')->nullable()->comment('Variant specific image');
            $table->boolean('is_active')->default(true)->comment('Variant status');
            $table->timestamps();
            
            $table->index('product_id');
            $table->index('sku');
            $table->index(['product_id', 'size', 'color']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};