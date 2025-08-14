<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(100000, 2000000);
        $taxAmount = $subtotal * 0.10;
        $shippingCost = 25000;
        $total = $subtotal + $taxAmount + $shippingCost;

        return [
            'order_number' => 'ORD-' . date('Ymd') . '-' . Str::upper(Str::random(6)),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'currency' => 'IDR',
            'billing_address' => [
                'name' => fake()->name(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'city' => fake()->city(),
                'postal_code' => fake()->postcode(),
            ],
            'shipping_address' => [
                'name' => fake()->name(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'city' => fake()->city(),
                'postal_code' => fake()->postcode(),
            ],
            'payment_method' => fake()->randomElement(['bank_transfer', 'credit_card', 'e_wallet']),
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'shipping_method' => fake()->randomElement(['regular', 'express']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
            'shipped_at' => fake()->dateTimeBetween('-1 week', '-3 days'),
            'delivered_at' => fake()->dateTimeBetween('-3 days', 'now'),
        ]);
    }
}