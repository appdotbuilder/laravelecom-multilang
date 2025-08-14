import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    sku: string;
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
    locale: string;
    [key: string]: unknown;
}

export default function CartIndex({ cartItems, summary, locale }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getLocalizedName = (product: Product) => {
        return locale === 'id' ? product.name_id : product.name_en;
    };

    const getVariantDisplay = (variant: ProductVariant | null) => {
        if (!variant) return '';
        const parts = [];
        if (variant.size) parts.push(variant.size);
        if (variant.color) parts.push(variant.color);
        return parts.join(' / ');
    };

    const updateQuantity = (cartId: number, quantity: number) => {
        router.patch(`/cart/${cartId}`, { quantity }, {
            preserveState: true,
        });
    };

    const removeItem = (cartId: number) => {
        router.delete(`/cart/${cartId}`, {
            preserveState: true,
        });
    };

    const texts = {
        en: {
            title: 'Shopping Cart',
            emptyCart: 'Your cart is empty',
            emptyCartDesc: 'Add some products to get started',
            continueShopping: 'Continue Shopping',
            product: 'Product',
            price: 'Price',
            quantity: 'Quantity',
            total: 'Total',
            remove: 'Remove',
            subtotal: 'Subtotal',
            tax: 'Tax (10%)',
            shipping: 'Shipping',
            grandTotal: 'Grand Total',
            proceedToCheckout: 'Proceed to Checkout',
            updateCart: 'Update Cart',
        },
        id: {
            title: 'Keranjang Belanja',
            emptyCart: 'Keranjang Anda kosong',
            emptyCartDesc: 'Tambahkan beberapa produk untuk memulai',
            continueShopping: 'Lanjut Belanja',
            product: 'Produk',
            price: 'Harga',
            quantity: 'Jumlah',
            total: 'Total',
            remove: 'Hapus',
            subtotal: 'Subtotal',
            tax: 'Pajak (10%)',
            shipping: 'Ongkir',
            grandTotal: 'Total Keseluruhan',
            proceedToCheckout: 'Lanjut ke Checkout',
            updateCart: 'Update Keranjang',
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.en;

    if (cartItems.length === 0) {
        return (
            <>
                <Head title={t.title} />
                
                <div className="min-h-screen bg-gray-50">
                    {/* Navigation */}
                    <nav className="bg-white shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <Link href="/" className="flex items-center">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        🛍️ E-Store
                                    </h1>
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.emptyCart}</h2>
                            <p className="text-gray-600 mb-8">{t.emptyCartDesc}</p>
                            <Link href="/products">
                                <Button size="lg">
                                    {t.continueShopping}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={t.title} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">
                                    🛍️ E-Store
                                </h1>
                            </Link>
                            
                            <div className="flex items-center space-x-4">
                                <Link href="/products">
                                    <Button variant="outline" size="sm">
                                        ← {t.continueShopping}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.title}</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Desktop Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b bg-gray-50 font-medium text-gray-700">
                                    <div className="col-span-6">{t.product}</div>
                                    <div className="col-span-2 text-center">{t.price}</div>
                                    <div className="col-span-2 text-center">{t.quantity}</div>
                                    <div className="col-span-2 text-center">{t.total}</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6">
                                            {/* Desktop Layout */}
                                            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-6 flex items-center space-x-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.product.images?.[0] ? (
                                                            <img
                                                                src={item.product.images[0]}
                                                                alt={getLocalizedName(item.product)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                📦
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {getLocalizedName(item.product)}
                                                        </h3>
                                                        {getVariantDisplay(item.product_variant) && (
                                                            <p className="text-sm text-gray-500">
                                                                {getVariantDisplay(item.product_variant)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="col-span-2 text-center">
                                                    <p className="font-medium">{formatPrice(item.price)}</p>
                                                </div>
                                                
                                                <div className="col-span-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                
                                                <div className="col-span-2 text-center">
                                                    <p className="font-medium">{formatPrice(item.quantity * item.price)}</p>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-sm text-red-600 hover:text-red-800 mt-1"
                                                    >
                                                        {t.remove}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile Layout */}
                                            <div className="md:hidden">
                                                <div className="flex space-x-4 mb-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.product.images?.[0] ? (
                                                            <img
                                                                src={item.product.images[0]}
                                                                alt={getLocalizedName(item.product)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                📦
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 mb-1">
                                                            {getLocalizedName(item.product)}
                                                        </h3>
                                                        {getVariantDisplay(item.product_variant) && (
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {getVariantDisplay(item.product_variant)}
                                                            </p>
                                                        )}
                                                        <p className="font-medium text-lg">{formatPrice(item.price)}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">{t.quantity}:</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    
                                                    <div className="text-right">
                                                        <p className="font-medium text-lg">{formatPrice(item.quantity * item.price)}</p>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            {t.remove}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">{locale === 'id' ? 'Ringkasan Pesanan' : 'Order Summary'}</h2>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>{t.subtotal}</span>
                                        <span>{formatPrice(summary.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t.tax}</span>
                                        <span>{formatPrice(summary.tax_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t.shipping}</span>
                                        <span>{formatPrice(summary.shipping_cost)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>{t.grandTotal}</span>
                                            <span>{formatPrice(summary.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Link href="/checkout">
                                        <Button className="w-full" size="lg">
                                            {t.proceedToCheckout}
                                        </Button>
                                    </Link>
                                    <Link href="/products">
                                        <Button variant="outline" className="w-full">
                                            {t.continueShopping}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}