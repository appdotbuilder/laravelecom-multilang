<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index(Request $request)
    {
        $cartItems = $this->getCartItems($request);
        
        $subtotal = $cartItems->sum(function($item) {
            return $item->quantity * $item->price;
        });
        
        $taxRate = 0.10; // 10% tax
        $taxAmount = $subtotal * $taxRate;
        $shippingCost = 25000; // Fixed shipping cost IDR 25k
        $total = $subtotal + $taxAmount + $shippingCost;

        return Inertia::render('cart/index', [
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
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Set default value for product_variant_id if not provided
        $validated['product_variant_id'] = $validated['product_variant_id'] ?? null;

        $product = Product::findOrFail($validated['product_id']);
        $variant = $validated['product_variant_id'] ? 
            ProductVariant::findOrFail($validated['product_variant_id']) : null;

        // Calculate price
        $price = $variant ? $variant->getFinalPrice() : $product->base_price;

        // Check if item already exists in cart
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('session_id', $request->session()->getId())
            ->where('product_id', $validated['product_id'])
            ->where('product_variant_id', $validated['product_variant_id'])
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            Cart::create([
                'user_id' => auth()->id(),
                'session_id' => $request->session()->getId(),
                'product_id' => $validated['product_id'],
                'product_variant_id' => $validated['product_variant_id'],
                'quantity' => $validated['quantity'],
                'price' => $price,
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, Cart $cart)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->update(['quantity' => $validated['quantity']]);

        return redirect()->route('cart.index')
            ->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();

        return redirect()->route('cart.index')
            ->with('success', 'Item removed from cart.');
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