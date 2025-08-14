import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name_en: string;
    name_id: string;
    slug: string;
    base_price: number;
    images: string[] | null;
    is_featured: boolean;
    category: {
        name_en: string;
        name_id: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    auth?: {
        user?: User;
    };
    featuredProducts: Product[];
    locale: string;
    [key: string]: unknown;
}

export default function Welcome({ auth, featuredProducts, locale }: Props) {
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

    const getCategoryName = (category: Product['category']) => {
        return locale === 'id' ? category.name_id : category.name_en;
    };

    const texts = {
        en: {
            title: '🛍️ Indonesian E-Commerce Store',
            subtitle: 'Discover amazing products with the best prices in Indonesia',
            features: [
                '🚀 Fast & secure checkout process',
                '📱 Multi-language support (English & Indonesian)',  
                '💳 Multiple payment methods available',
                '🚚 Free shipping for orders above Rp 500,000'
            ],
            featuredTitle: 'Featured Products',
            shopNow: 'Shop Now',
            viewAllProducts: 'View All Products',
            login: 'Login',
            register: 'Register',
            dashboard: 'Dashboard'
        },
        id: {
            title: '🛍️ Toko Online Indonesia',
            subtitle: 'Temukan produk-produk menarik dengan harga terbaik di Indonesia',
            features: [
                '🚀 Proses checkout cepat & aman',
                '📱 Dukungan multi-bahasa (Inggris & Indonesia)',
                '💳 Berbagai metode pembayaran tersedia',
                '🚚 Gratis ongkir untuk pembelian di atas Rp 500,000'
            ],
            featuredTitle: 'Produk Unggulan',
            shopNow: 'Belanja Sekarang',
            viewAllProducts: 'Lihat Semua Produk',
            login: 'Masuk',
            register: 'Daftar',
            dashboard: 'Dashboard'
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.en;

    return (
        <>
            <Head title="Welcome" />
            
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">
                                    🛍️ E-Store
                                </h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/products"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    {locale === 'id' ? 'Produk' : 'Products'}
                                </Link>
                                
                                {auth?.user ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            {t.dashboard}
                                        </Link>
                                        <Link
                                            href="/cart"
                                            className="text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            🛒 {locale === 'id' ? 'Keranjang' : 'Cart'}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="outline" size="sm">
                                                {t.login}
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="sm">
                                                {t.register}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                
                                {/* Language Switcher */}
                                <div className="flex space-x-1">
                                    <Link
                                        href="?locale=en"
                                        className={`px-2 py-1 text-sm rounded ${locale === 'en' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        EN
                                    </Link>
                                    <Link
                                        href="?locale=id"
                                        className={`px-2 py-1 text-sm rounded ${locale === 'id' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        ID
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            {t.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                            {t.subtitle}
                        </p>
                        
                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {t.features.map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                                    <p className="text-gray-700">{feature}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link href="/products">
                                <Button size="lg" className="w-full sm:w-auto">
                                    {t.shopNow}
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    {t.viewAllProducts}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Featured Products */}
                    {featuredProducts && featuredProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                                {t.featuredTitle}
                            </h2>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-sm border group-hover:shadow-md transition-shadow overflow-hidden">
                                            <div className="aspect-square bg-gray-100">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={getLocalizedName(product)}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        📦 {locale === 'id' ? 'Tidak ada gambar' : 'No image'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-blue-600 font-medium mb-1">
                                                    {getCategoryName(product.category)}
                                                </p>
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {getLocalizedName(product)}
                                                </h3>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.base_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="text-center mt-8">
                                <Link href="/products">
                                    <Button variant="outline">
                                        {t.viewAllProducts} →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}