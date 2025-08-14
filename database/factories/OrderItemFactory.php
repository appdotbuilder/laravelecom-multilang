<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        $variant = ProductVariant::factory()->for($product)->create();
        $quantity = fake()->numberBetween(1, 3);
        $price = $variant->getFinalPrice();
        $total = $quantity * $price;

        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'quantity' => $quantity,
            'price' => $price,
            'total' => $total,
            'product_name' => $product->name_en,
            'product_sku' => $variant->sku,
            'product_details' => [
                'size' => $variant->size,
                'color' => $variant->color,
                'variant_sku' => $variant->sku,
            ],
        ];
    }
}