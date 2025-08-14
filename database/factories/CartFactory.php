<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
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
        
        return [
            'session_id' => fake()->uuid(),
            'user_id' => User::factory(),
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'quantity' => fake()->numberBetween(1, 5),
            'price' => $variant->getFinalPrice(),
        ];
    }

    /**
     * Indicate that the cart belongs to a guest session.
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'session_id' => fake()->uuid(),
        ]);
    }
}