import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items_count?: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface OrdersData {
    data: Order[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
}

interface Props {
    orders: OrdersData;
    [key: string]: unknown;
}

export default function OrderIndex({ orders }: Props) {
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
            <Head title="My Orders" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <Link href="/">
                            <Button variant="outline">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {orders.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
                            <Link href="/products">
                                <Button size="lg">
                                    Shop Now
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="divide-y">
                                    {orders.data.map((order) => (
                                        <div key={order.id} className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Order {order.order_number}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Placed on {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {formatPrice(order.total)}
                                                    </p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">
                                                    {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                                </p>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex space-x-1">
                                        {orders.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        window.location.href = link.url;
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