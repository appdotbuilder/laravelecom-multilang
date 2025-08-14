<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(Request $request)
    {
        $cartItems = $this->getCartItems($request);
        
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }
        
        $subtotal = $cartItems->sum(function($item) {
            return $item->quantity * $item->price;
        });
        
        $taxRate = 0.10; // 10% tax
        $taxAmount = $subtotal * $taxRate;
        $shippingCost = 25000; // Fixed shipping cost IDR 25k
        $total = $subtotal + $taxAmount + $shippingCost;

        return Inertia::render('checkout/index', [
            'cartItems' => $cartItems->load(['product', 'productVariant']),
            'summary' => [
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_cost' => $shippingCost,
                'total' => $total,
            ],
        ]);
    }

    /**
     * Process the order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'billing_address' => 'required|array',
            'billing_address.name' => 'required|string|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'billing_address.address' => 'required|string',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.postal_code' => 'required|string|max:10',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.postal_code' => 'required|string|max:10',
            'payment_method' => 'required|string|in:bank_transfer,credit_card,e_wallet',
            'shipping_method' => 'required|string|in:regular,express',
            'notes' => 'nullable|string',
        ]);

        $cartItems = $this->getCartItems($request);
        
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Calculate totals
        $subtotal = $cartItems->sum(function($item) {
            return $item->quantity * $item->price;
        });
        
        $taxRate = 0.10;
        $taxAmount = $subtotal * $taxRate;
        $shippingCost = $validated['shipping_method'] === 'express' ? 50000 : 25000;
        $total = $subtotal + $taxAmount + $shippingCost;

        // Create order
        $order = Order::create([
            'order_number' => 'ORD-' . date('Ymd') . '-' . Str::upper(Str::random(6)),
            'user_id' => auth()->id(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'currency' => 'IDR',
            'billing_address' => $validated['billing_address'],
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'shipping_method' => $validated['shipping_method'],
            'notes' => $validated['notes'],
        ]);

        // Create order items
        foreach ($cartItems as $cartItem) {
            $variant = $cartItem->productVariant;
            $productDetails = [
                'size' => $variant?->size,
                'color' => $variant?->color,
                'variant_sku' => $variant?->sku,
            ];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'product_variant_id' => $cartItem->product_variant_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'total' => $cartItem->quantity * $cartItem->price,
                'product_name' => $cartItem->product->getName(app()->getLocale()),
                'product_sku' => $variant ? $variant->sku : $cartItem->product->sku,
                'product_details' => $productDetails,
            ]);
        }

        // Clear cart
        $cartItems->each->delete();

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully!');
    }

    /**
     * Get cart items for current user/session.
     */
    public function getCartItems(Request $request)
    {
        $query = Cart::query();

        if (auth()->check()) {
            $query->where('user_id', auth()->id());
        } else {
            $query->where('session_id', $request->session()->getId());
        }

        return $query->get();
    }
}