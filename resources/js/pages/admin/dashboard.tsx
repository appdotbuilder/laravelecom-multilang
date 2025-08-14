import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Stats {
    total_products: number;
    active_products: number;
    total_categories: number;
    total_customers: number;
    total_orders: number;
    pending_orders: number;
}

interface SalesData {
    labels: string[];
    orders: number[];
    sales: number[];
    average_order_value: number[];
}

interface Order {
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Product {
    id: number;
    name_en: string;
    total_sold: number;
}

interface Props {
    stats: Stats;
    salesData: SalesData;
    recentOrders: Order[];
    topProducts: Product[];
    period: string;
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentOrders, topProducts }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-green-100 text-green-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-8">
                                <Link href="/" className="flex items-center">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        🛍️ E-Store Admin
                                    </h1>
                                </Link>
                                
                                <div className="hidden md:flex space-x-4">
                                    <Link 
                                        href="/admin/dashboard" 
                                        className="text-blue-600 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        href="/admin/products" 
                                        className="text-gray-700 hover:text-blue-600"
                                    >
                                        Products
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Link href="/">
                                    <Button variant="outline" size="sm">
                                        View Store
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome to your e-commerce admin panel</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                                    <p className="text-sm text-green-600">{stats.active_products} active</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <span className="text-2xl">🛒</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                                    <p className="text-sm text-yellow-600">{stats.pending_orders} pending</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <span className="text-2xl">📂</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Categories</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_categories}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                            </div>
                            <div className="p-6">
                                {recentOrders.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {order.user?.name || 'Guest'} • {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {formatPrice(order.total)}
                                                    </p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {recentOrders.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Link href="/admin/orders">
                                            <Button variant="outline" size="sm" className="w-full">
                                                View All Orders
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Top Selling Products</h2>
                            </div>
                            <div className="p-6">
                                {topProducts.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No sales data yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {topProducts.map((product, index) => (
                                            <div key={product.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {product.name_en}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {product.total_sold || 0} sold
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {topProducts.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Link href="/admin/products">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Manage Products
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/admin/products/create">
                                <Button className="w-full h-16 text-left">
                                    <div>
                                        <p className="font-medium">Add Product</p>
                                        <p className="text-sm opacity-75">Create new product</p>
                                    </div>
                                </Button>
                            </Link>
                            
                            <Link href="/admin/products">
                                <Button variant="outline" className="w-full h-16 text-left">
                                    <div>
                                        <p className="font-medium">Manage Products</p>
                                        <p className="text-sm opacity-75">View all products</p>
                                    </div>
                                </Button>
                            </Link>
                            
                            <Button variant="outline" className="w-full h-16 text-left" disabled>
                                <div>
                                    <p className="font-medium">Orders</p>
                                    <p className="text-sm opacity-75">Coming soon</p>
                                </div>
                            </Button>
                            
                            <Button variant="outline" className="w-full h-16 text-left" disabled>
                                <div>
                                    <p className="font-medium">Reports</p>
                                    <p className="text-sm opacity-75">Coming soon</p>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}