<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create sample customer
        User::create([
            'name' => 'John Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'phone' => '081234567890',
            'address' => [
                'street' => 'Jl. Sample Street No. 123',
                'city' => 'Jakarta',
                'state' => 'DKI Jakarta',
                'postal_code' => '12345',
                'country' => 'Indonesia',
            ],
            'is_active' => true,
        ]);

        // Create categories
        $categories = [
            [
                'name_en' => 'Men\'s Clothing',
                'name_id' => 'Pakaian Pria',
                'description_en' => 'Stylish clothing for men',
                'description_id' => 'Pakaian bergaya untuk pria',
            ],
            [
                'name_en' => 'Women\'s Clothing',
                'name_id' => 'Pakaian Wanita',
                'description_en' => 'Fashion clothing for women',
                'description_id' => 'Pakaian fashion untuk wanita',
            ],
            [
                'name_en' => 'Shoes',
                'name_id' => 'Sepatu',
                'description_en' => 'Comfortable and stylish footwear',
                'description_id' => 'Alas kaki yang nyaman dan bergaya',
            ],
            [
                'name_en' => 'Accessories',
                'name_id' => 'Aksesoris',
                'description_en' => 'Fashion accessories and more',
                'description_id' => 'Aksesoris fashion dan lainnya',
            ],
        ];

        foreach ($categories as $categoryData) {
            $slug = Str::slug($categoryData['name_en']);
            Category::create([
                'name_en' => $categoryData['name_en'],
                'name_id' => $categoryData['name_id'],
                'slug' => $slug,
                'description_en' => $categoryData['description_en'],
                'description_id' => $categoryData['description_id'],
                'is_active' => true,
            ]);
        }

        // Create sample products
        $products = [
            [
                'category_name' => 'Men\'s Clothing',
                'name_en' => 'Classic Cotton T-Shirt',
                'name_id' => 'Kaos Katun Klasik',
                'description_en' => 'A comfortable and durable cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with excellent breathability and softness.',
                'description_id' => 'Kaos katun yang nyaman dan tahan lama, cocok untuk pemakaian sehari-hari. Terbuat dari 100% katun premium dengan sirkulasi udara dan kelembutan yang sangat baik.',
                'short_description_en' => 'Comfortable 100% cotton t-shirt',
                'short_description_id' => 'Kaos katun 100% yang nyaman',
                'base_price' => 150000,
                'stock_quantity' => 50,
                'is_featured' => true,
            ],
            [
                'category_name' => 'Women\'s Clothing',
                'name_en' => 'Elegant Summer Dress',
                'name_id' => 'Dress Musim Panas Elegan',
                'description_en' => 'Beautiful floral summer dress made from lightweight fabric. Perfect for casual outings and summer events.',
                'description_id' => 'Dress musim panas bermotif bunga yang cantik terbuat dari bahan ringan. Cocok untuk acara santai dan acara musim panas.',
                'short_description_en' => 'Lightweight floral summer dress',
                'short_description_id' => 'Dress musim panas bermotif bunga yang ringan',
                'base_price' => 250000,
                'stock_quantity' => 30,
                'is_featured' => true,
            ],
            [
                'category_name' => 'Shoes',
                'name_en' => 'Running Sneakers',
                'name_id' => 'Sepatu Sneakers Lari',
                'description_en' => 'High-performance running sneakers with advanced cushioning technology. Designed for comfort and durability during athletic activities.',
                'description_id' => 'Sepatu sneakers lari berkinerja tinggi dengan teknologi bantalan canggih. Dirancang untuk kenyamanan dan daya tahan selama aktivitas atletik.',
                'short_description_en' => 'High-performance running sneakers',
                'short_description_id' => 'Sepatu sneakers lari berkinerja tinggi',
                'base_price' => 750000,
                'stock_quantity' => 25,
                'is_featured' => true,
            ],
            [
                'category_name' => 'Accessories',
                'name_en' => 'Leather Wallet',
                'name_id' => 'Dompet Kulit',
                'description_en' => 'Premium genuine leather wallet with multiple card slots and bill compartments. Handcrafted with attention to detail.',
                'description_id' => 'Dompet kulit asli premium dengan banyak slot kartu dan ruang uang. Dibuat dengan tangan dengan perhatian pada detail.',
                'short_description_en' => 'Premium genuine leather wallet',
                'short_description_id' => 'Dompet kulit asli premium',
                'base_price' => 300000,
                'stock_quantity' => 40,
                'is_featured' => true,
            ],
        ];

        foreach ($products as $productData) {
            $category = Category::where('name_en', $productData['category_name'])->first();
            $slug = Str::slug($productData['name_en'] . '-' . fake()->unique()->randomNumber(4));
            $sku = 'SKU-' . fake()->unique()->randomNumber(6);

            $product = Product::create([
                'category_id' => $category->id,
                'name_en' => $productData['name_en'],
                'name_id' => $productData['name_id'],
                'slug' => $slug,
                'description_en' => $productData['description_en'],
                'description_id' => $productData['description_id'],
                'short_description_en' => $productData['short_description_en'],
                'short_description_id' => $productData['short_description_id'],
                'base_price' => $productData['base_price'],
                'sku' => $sku,
                'stock_quantity' => $productData['stock_quantity'],
                'weight' => fake()->randomFloat(2, 0.2, 2.0),
                'images' => [
                    'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=' . urlencode($productData['name_en']),
                    'https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=' . urlencode($productData['name_en'] . '+2'),
                ],
                'is_active' => true,
                'is_featured' => $productData['is_featured'],
            ]);

            // Create variants for clothing items
            if (in_array($productData['category_name'], ['Men\'s Clothing', 'Women\'s Clothing'])) {
                $sizes = ['S', 'M', 'L', 'XL'];
                $colors = ['Black', 'White', 'Navy', 'Gray'];

                foreach ($sizes as $size) {
                    foreach ($colors as $color) {
                        $variantSku = $sku . '-' . $size . '-' . strtoupper(substr($color, 0, 2));
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'size' => $size,
                            'color' => $color,
                            'sku' => $variantSku,
                            'price_adjustment' => $size === 'XL' ? 25000 : 0, // XL costs more
                            'stock_quantity' => random_int(5, 15),
                            'is_active' => true,
                        ]);
                    }
                }
            }

            // Create variants for shoes
            if ($productData['category_name'] === 'Shoes') {
                $sizes = ['38', '39', '40', '41', '42', '43', '44'];
                $colors = ['Black', 'White', 'Blue'];

                foreach ($sizes as $size) {
                    foreach ($colors as $color) {
                        $variantSku = $sku . '-' . $size . '-' . strtoupper(substr($color, 0, 2));
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'size' => $size,
                            'color' => $color,
                            'sku' => $variantSku,
                            'price_adjustment' => 0,
                            'stock_quantity' => random_int(3, 8),
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }

        // Create additional products using factories
        $categories = Category::all();
        foreach ($categories as $category) {
            Product::factory()
                ->count(random_int(3, 6))
                ->for($category)
                ->create()
                ->each(function ($product) {
                    // Create 2-5 variants for each product
                    ProductVariant::factory()
                        ->count(random_int(2, 5))
                        ->for($product)
                        ->create();
                });
        }
    }
}