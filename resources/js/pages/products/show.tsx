import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name_en: string;
    name_id: string;
}

interface ProductVariant {
    id: number;
    size: string | null;
    color: string | null;
    sku: string;
    price_adjustment: number;
    stock_quantity: number;
    is_active: boolean;
}

interface Product {
    id: number;
    name_en: string;
    name_id: string;
    slug: string;
    description_en?: string;
    description_id?: string;
    base_price: number;
    sku: string;
    stock_quantity: number;
    weight: number;
    images: string[] | null;
    category: Category;
    variants: ProductVariant[];
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    locale: string;
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts, locale }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getLocalizedName = (item: Product | Category) => {
        return locale === 'id' ? item.name_id : item.name_en;
    };

    const getLocalizedDescription = (product: Product) => {
        if (locale === 'id') {
            return product.description_id || '';
        }
        return product.description_en || '';
    };

    const getCurrentPrice = () => {
        if (selectedVariant) {
            return product.base_price + selectedVariant.price_adjustment;
        }
        return product.base_price;
    };

    const getCurrentStock = () => {
        if (selectedVariant) {
            return selectedVariant.stock_quantity;
        }
        return product.stock_quantity;
    };

    const getUniqueVariantOptions = (field: 'size' | 'color') => {
        const options = product.variants
            .filter(v => v.is_active && v[field])
            .map(v => v[field])
            .filter((value, index, self) => self.indexOf(value) === index);
        return options;
    };

    const handleAddToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            product_variant_id: selectedVariant?.id,
            quantity: quantity,
        }, {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const texts = {
        en: {
            backToProducts: 'Back to Products',
            addToCart: 'Add to Cart',
            buyNow: 'Buy Now',
            quantity: 'Quantity',
            size: 'Size',
            color: 'Color',
            sku: 'SKU',
            weight: 'Weight',
            inStock: 'In Stock',
            outOfStock: 'Out of Stock',
            selectVariant: 'Please select size and color',
            relatedProducts: 'Related Products',
            kg: 'kg',
        },
        id: {
            backToProducts: 'Kembali ke Produk',
            addToCart: 'Tambah ke Keranjang',
            buyNow: 'Beli Sekarang',
            quantity: 'Jumlah',
            size: 'Ukuran',
            color: 'Warna',
            sku: 'SKU',
            weight: 'Berat',
            inStock: 'Tersedia',
            outOfStock: 'Stok Habis',
            selectVariant: 'Silakan pilih ukuran dan warna',
            relatedProducts: 'Produk Terkait',
            kg: 'kg',
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.en;

    const canAddToCart = () => {
        if (product.variants.length > 0 && !selectedVariant) {
            return false;
        }
        return getCurrentStock() > 0;
    };

    return (
        <>
            <Head title={getLocalizedName(product)} />
            
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
                                        ← {t.backToProducts}
                                    </Button>
                                </Link>
                                <Link href="/cart">
                                    <Button variant="outline" size="sm">
                                        🛒 {locale === 'id' ? 'Keranjang' : 'Cart'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-8 p-6">
                            {/* Product Images */}
                            <div>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                    {product.images && product.images[selectedImage] ? (
                                        <img
                                            src={product.images[selectedImage]}
                                            alt={getLocalizedName(product)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            📦 {locale === 'id' ? 'Tidak ada gambar' : 'No image'}
                                        </div>
                                    )}
                                </div>

                                {/* Image Thumbnails */}
                                {product.images && product.images.length > 1 && (
                                    <div className="flex space-x-2">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square w-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${getLocalizedName(product)} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="mb-4">
                                    <p className="text-blue-600 font-medium mb-1">
                                        {getLocalizedName(product.category)}
                                    </p>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {getLocalizedName(product)}
                                    </h1>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatPrice(getCurrentPrice())}
                                    </p>
                                </div>

                                {/* Product Details */}
                                <div className="mb-6 space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium">{t.sku}:</span> {selectedVariant?.sku || product.sku}</p>
                                    <p><span className="font-medium">{t.weight}:</span> {product.weight} {t.kg}</p>
                                    <p>
                                        <span className="font-medium">
                                            {getCurrentStock() > 0 ? t.inStock : t.outOfStock}
                                        </span>
                                        {getCurrentStock() > 0 && ` (${getCurrentStock()} available)`}
                                    </p>
                                </div>

                                {/* Variant Selection */}
                                {product.variants.length > 0 && (
                                    <div className="mb-6 space-y-4">
                                        {/* Size Selection */}
                                        {getUniqueVariantOptions('size').length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t.size}
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {getUniqueVariantOptions('size').map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => {
                                                                const variant = product.variants.find(v => 
                                                                    v.size === size && 
                                                                    (selectedVariant?.color ? v.color === selectedVariant.color : true)
                                                                );
                                                                setSelectedVariant(variant || null);
                                                            }}
                                                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                                                selectedVariant?.size === size
                                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Color Selection */}
                                        {getUniqueVariantOptions('color').length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t.color}
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {getUniqueVariantOptions('color').map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => {
                                                                const variant = product.variants.find(v => 
                                                                    v.color === color && 
                                                                    (selectedVariant?.size ? v.size === selectedVariant.size : true)
                                                                );
                                                                setSelectedVariant(variant || null);
                                                            }}
                                                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                                                selectedVariant?.color === color
                                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            {color}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quantity */}
                                {canAddToCart() && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.quantity}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={getCurrentStock()}
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {!canAddToCart() && product.variants.length > 0 && (
                                        <p className="text-sm text-red-600">{t.selectVariant}</p>
                                    )}
                                    
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={!canAddToCart()}
                                        className="w-full"
                                        size="lg"
                                    >
                                        🛒 {t.addToCart}
                                    </Button>
                                    
                                    <Button
                                        onClick={() => {
                                            handleAddToCart();
                                            router.visit('/cart');
                                        }}
                                        disabled={!canAddToCart()}
                                        variant="outline"
                                        className="w-full"
                                        size="lg"
                                    >
                                        {t.buyNow}
                                    </Button>
                                </div>

                                {/* Description */}
                                {getLocalizedDescription(product) && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {locale === 'id' ? 'Deskripsi' : 'Description'}
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {getLocalizedDescription(product)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.relatedProducts}</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-sm border group-hover:shadow-md transition-shadow overflow-hidden">
                                            <div className="aspect-square bg-gray-100">
                                                {relatedProduct.images?.[0] ? (
                                                    <img
                                                        src={relatedProduct.images[0]}
                                                        alt={getLocalizedName(relatedProduct)}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        📦
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {getLocalizedName(relatedProduct)}
                                                </h3>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatPrice(relatedProduct.base_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}