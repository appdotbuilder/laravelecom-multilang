import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name_en: string;
    name_id: string;
    images: string[] | null;
}

interface ProductVariant {
    id: number;
    size: string | null;
    color: string | null;
}

interface CartItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
    price: number;
    product: Product;
    product_variant: ProductVariant | null;
}

interface Summary {
    subtotal: number;
    tax_amount: number;
    shipping_cost: number;
    total: number;
}

interface Props {
    cartItems: CartItem[];
    summary: Summary;
    [key: string]: unknown;
}

export default function CheckoutIndex({ cartItems, summary }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        'billing_address.name': '',
        'billing_address.phone': '',
        'billing_address.address': '',
        'billing_address.city': '',
        'billing_address.postal_code': '',
        'shipping_address.name': '',
        'shipping_address.phone': '',
        'shipping_address.address': '',
        'shipping_address.city': '',
        'shipping_address.postal_code': '',
        payment_method: 'bank_transfer',
        shipping_method: 'regular',
        notes: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <>
            <Head title="Checkout" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Billing Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['billing_address.name']}
                                                onChange={(e) => setData('billing_address.name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors['billing_address.name'] && (
                                                <p className="text-sm text-red-600 mt-1">{errors['billing_address.name']}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={data['billing_address.phone']}
                                                onChange={(e) => setData('billing_address.phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={data['billing_address.address']}
                                                onChange={(e) => setData('billing_address.address', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['billing_address.city']}
                                                onChange={(e) => setData('billing_address.city', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['billing_address.postal_code']}
                                                onChange={(e) => setData('billing_address.postal_code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['shipping_address.name']}
                                                onChange={(e) => setData('shipping_address.name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={data['shipping_address.phone']}
                                                onChange={(e) => setData('shipping_address.phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={data['shipping_address.address']}
                                                onChange={(e) => setData('shipping_address.address', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['shipping_address.city']}
                                                onChange={(e) => setData('shipping_address.city', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data['shipping_address.postal_code']}
                                                onChange={(e) => setData('shipping_address.postal_code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment & Shipping */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment & Shipping</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Method
                                            </label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="bank_transfer"
                                                        checked={data.payment_method === 'bank_transfer'}
                                                        onChange={(e) => setData('payment_method', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    Bank Transfer
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="credit_card"
                                                        checked={data.payment_method === 'credit_card'}
                                                        onChange={(e) => setData('payment_method', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    Credit Card
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="e_wallet"
                                                        checked={data.payment_method === 'e_wallet'}
                                                        onChange={(e) => setData('payment_method', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    E-Wallet
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Method
                                            </label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="regular"
                                                        checked={data.shipping_method === 'regular'}
                                                        onChange={(e) => setData('shipping_method', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    Regular ({formatPrice(25000)})
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="express"
                                                        checked={data.shipping_method === 'express'}
                                                        onChange={(e) => setData('shipping_method', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    Express ({formatPrice(50000)})
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Any special instructions for your order..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                
                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                                                {item.product.images?.[0] && (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name_en}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {item.product.name_en}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium">
                                                {formatPrice(item.quantity * item.price)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Totals */}
                                <div className="border-t pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(summary.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (10%)</span>
                                        <span>{formatPrice(summary.tax_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{formatPrice(summary.shipping_cost)}</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total</span>
                                            <span>{formatPrice(summary.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="w-full mt-6"
                                    size="lg"
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}