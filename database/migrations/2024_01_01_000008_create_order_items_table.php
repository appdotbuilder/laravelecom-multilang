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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('quantity')->comment('Quantity ordered');
            $table->decimal('price', 15, 2)->comment('Price at time of purchase');
            $table->decimal('total', 15, 2)->comment('Line total (quantity × price)');
            $table->string('product_name')->comment('Product name at time of purchase');
            $table->string('product_sku')->comment('Product SKU at time of purchase');
            $table->json('product_details')->nullable()->comment('Product details at time of purchase');
            $table->timestamps();
            
            $table->index('order_id');
            $table->index('product_id');
            $table->index(['order_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};