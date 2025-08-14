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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->comment('Unique order identifier');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('status')->default('pending')->comment('Order status');
            $table->decimal('subtotal', 15, 2)->comment('Subtotal before tax and shipping');
            $table->decimal('tax_amount', 15, 2)->default(0)->comment('Tax amount');
            $table->decimal('shipping_cost', 15, 2)->default(0)->comment('Shipping cost');
            $table->decimal('total', 15, 2)->comment('Total order amount');
            $table->string('currency', 3)->default('IDR')->comment('Order currency');
            $table->json('billing_address')->comment('Billing address information');
            $table->json('shipping_address')->comment('Shipping address information');
            $table->string('payment_method')->nullable()->comment('Payment method used');
            $table->string('payment_status')->default('pending')->comment('Payment status');
            $table->string('shipping_method')->nullable()->comment('Shipping method');
            $table->text('notes')->nullable()->comment('Order notes');
            $table->timestamp('shipped_at')->nullable()->comment('When order was shipped');
            $table->timestamp('delivered_at')->nullable()->comment('When order was delivered');
            $table->timestamps();
            
            $table->index('order_number');
            $table->index('user_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};