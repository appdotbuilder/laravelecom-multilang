<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcommerceTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_displays_featured_products(): void
    {
        // Create category and featured product
        $category = Category::factory()->create();
        $product = Product::factory()
            ->for($category)
            ->featured()
            ->create();

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('featuredProducts', 1)
                ->where('featuredProducts.0.id', $product->id)
        );
    }

    public function test_products_index_shows_products(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('products/index')
                ->has('products.data', 1)
        );
    }

    public function test_product_show_displays_product_details(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $response = $this->get("/products/{$product->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('products/show')
                ->where('product.id', $product->id)
        );
    }

    public function test_cart_index_shows_empty_cart(): void
    {
        $response = $this->get('/cart');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('cart/index')
                ->has('cartItems', 0)
        );
    }

    public function test_admin_dashboard_requires_authentication(): void
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_admin_dashboard_requires_admin_role(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user)->get('/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('admin/dashboard')
        );
    }

    public function test_add_to_cart_functionality(): void
    {
        $this->withSession(['_token' => 'test-token']);
        
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $response = $this->post('/cart', [
            'product_id' => $product->id,
            'product_variant_id' => null,
            'quantity' => 2,
        ]);

        $response->assertRedirect('/cart');
        
        $this->assertDatabaseHas('carts', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_checkout_requires_authentication(): void
    {
        $response = $this->get('/checkout');

        $response->assertRedirect('/login');
    }

    public function test_user_can_view_orders(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/orders');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('orders/index')
        );
    }
}