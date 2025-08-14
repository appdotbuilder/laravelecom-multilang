<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nameEn = fake()->words(3, true);
        $nameId = $this->getIndonesianProductName();
        $slug = Str::slug($nameEn . '-' . fake()->unique()->randomNumber(4));
        $sku = 'SKU-' . fake()->unique()->randomNumber(6);

        return [
            'category_id' => Category::factory(),
            'name_en' => $nameEn,
            'name_id' => $nameId,
            'slug' => $slug,
            'description_en' => fake()->paragraphs(3, true),
            'description_id' => $this->getIndonesianDescription(),
            'short_description_en' => fake()->sentence(),
            'short_description_id' => $this->getIndonesianShortDescription(),
            'base_price' => fake()->numberBetween(50000, 5000000), // IDR 50k - 5M
            'sku' => $sku,
            'stock_quantity' => fake()->numberBetween(0, 100),
            'weight' => fake()->randomFloat(2, 0.1, 5.0), // 0.1kg - 5kg
            'images' => [
                'https://via.placeholder.com/400x400?text=Product+1',
                'https://via.placeholder.com/400x400?text=Product+2',
            ],
            'is_active' => true,
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
        ];
    }

    /**
     * Get Indonesian product name.
     */
    private function getIndonesianProductName(): string
    {
        $products = [
            'Kemeja Katun Premium',
            'Celana Jeans Klasik',
            'Sepatu Sneakers Modern',
            'Tas Kulit Asli',
            'Jaket Hoodie Stylish',
            'Dress Casual Elegan',
            'Sandal Jepit Nyaman',
            'Topi Baseball Trendy',
            'Kaos Polos Berkualitas',
            'Rok Mini Fashion',
        ];

        return fake()->randomElement($products);
    }

    /**
     * Get Indonesian description.
     */
    private function getIndonesianDescription(): string
    {
        return 'Produk berkualitas tinggi yang dirancang dengan perhatian detail. Terbuat dari bahan pilihan yang nyaman dan tahan lama. Cocok untuk berbagai kesempatan dan gaya hidup modern. Tersedia dalam berbagai ukuran dan warna.';
    }

    /**
     * Get Indonesian short description.
     */
    private function getIndonesianShortDescription(): string
    {
        $descriptions = [
            'Produk berkualitas tinggi dan nyaman',
            'Desain modern dengan bahan premium',
            'Pilihan terbaik untuk gaya hidup aktif',
            'Kombinasi sempurna antara style dan kenyamanan',
        ];

        return fake()->randomElement($descriptions);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}