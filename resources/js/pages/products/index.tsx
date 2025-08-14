import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name_en: string;
    name_id: string;
    slug: string;
}

interface Product {
    id: number;
    name_en: string;
    name_id: string;
    slug: string;
    base_price: number;
    images: string[] | null;
    short_description_en?: string;
    short_description_id?: string;
    stock_quantity: number;
    category: Category;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductsData {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
}

interface Props {
    products: ProductsData;
    categories: Category[];
    filters: {
        category?: number;
        search?: string;
    };
    locale: string;
    [key: string]: unknown;
}

export default function ProductIndex({ products, categories, filters, locale }: Props) {
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
            return product.short_description_id || '';
        }
        return product.short_description_en || '';
    };

    const handleFilter = (type: string, value: string | number) => {
        const newFilters: Record<string, string | number> = { ...filters };
        if (value) {
            newFilters[type] = value;
        } else {
            delete newFilters[type];
        }
        
        router.get('/products', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const texts = {
        en: {
            title: 'Products',
            allCategories: 'All Categories',
            search: 'Search products...',
            noProducts: 'No products found',
            noProductsDesc: 'Try adjusting your search or filter criteria',
            stockAvailable: 'In Stock',
            outOfStock: 'Out of Stock',
            addToCart: 'Add to Cart',
            viewDetails: 'View Details',
        },
        id: {
            title: 'Produk',
            allCategories: 'Semua Kategori',
            search: 'Cari produk...',
            noProducts: 'Tidak ada produk ditemukan',
            noProductsDesc: 'Coba sesuaikan pencarian atau kriteria filter',
            stockAvailable: 'Tersedia',
            outOfStock: 'Stok Habis',
            addToCart: 'Tambah ke Keranjang',
            viewDetails: 'Lihat Detail',
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.en;

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
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
                        
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Category Filter */}
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilter('category', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">{t.allCategories}</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {getLocalizedName(category)}
                                    </option>
                                ))}
                            </select>

                            {/* Search */}
                            <input
                                type="text"
                                placeholder={t.search}
                                value={filters.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noProducts}</h3>
                            <p className="text-gray-500">{t.noProductsDesc}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                                        <Link href={`/products/${product.slug}`}>
                                            <div className="aspect-square bg-gray-100 relative group">
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
                                                
                                                {product.stock_quantity === 0 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white font-medium">{t.outOfStock}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        
                                        <div className="p-4">
                                            <p className="text-sm text-blue-600 font-medium mb-1">
                                                {getLocalizedName(product.category)}
                                            </p>
                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                    {getLocalizedName(product)}
                                                </h3>
                                            </Link>
                                            
                                            {getLocalizedDescription(product) && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {getLocalizedDescription(product)}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.base_price)}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    product.stock_quantity > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.stock_quantity > 0 ? t.stockAvailable : t.outOfStock}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-4 flex gap-2">
                                                <Link href={`/products/${product.slug}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        {t.viewDetails}
                                                    </Button>
                                                </Link>
                                                
                                                {product.stock_quantity > 0 && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            router.post('/cart', {
                                                                product_id: product.id,
                                                                quantity: 1,
                                                            });
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        🛒
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex space-x-1">
                                        {products.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url);
                                                    }
                                                }}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}