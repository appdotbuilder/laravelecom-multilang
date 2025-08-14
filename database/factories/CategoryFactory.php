<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nameEn = fake()->words(2, true);
        $nameId = $this->getIndonesianName();
        $slug = Str::slug($nameEn);

        return [
            'name_en' => $nameEn,
            'name_id' => $nameId,
            'slug' => $slug,
            'description_en' => fake()->sentence(),
            'description_id' => $this->getIndonesianDescription(),
            'image' => null,
            'is_active' => true,
        ];
    }

    /**
     * Get Indonesian category name.
     */
    private function getIndonesianName(): string
    {
        $names = [
            'Pakaian Pria',
            'Pakaian Wanita',
            'Sepatu',
            'Tas',
            'Aksesoris',
            'Elektronik',
            'Makanan',
            'Minuman',
            'Olahraga',
            'Kesehatan',
        ];

        return fake()->randomElement($names);
    }

    /**
     * Get Indonesian description.
     */
    private function getIndonesianDescription(): string
    {
        $descriptions = [
            'Koleksi terbaik untuk kebutuhan sehari-hari',
            'Produk berkualitas tinggi dengan harga terjangkau',
            'Pilihan terlengkap untuk gaya hidup modern',
            'Kualitas premium untuk kepuasan pelanggan',
        ];

        return fake()->randomElement($descriptions);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}