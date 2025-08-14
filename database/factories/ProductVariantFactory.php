<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        $colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Brown'];
        
        $size = fake()->randomElement($sizes);
        $color = fake()->randomElement($colors);
        $sku = 'VAR-' . fake()->unique()->randomNumber(6);

        return [
            'product_id' => Product::factory(),
            'size' => $size,
            'color' => $color,
            'sku' => $sku,
            'price_adjustment' => fake()->randomFloat(2, -50000, 100000), // -50k to +100k IDR
            'stock_quantity' => fake()->numberBetween(0, 50),
            'image' => null,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the variant is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the variant is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}