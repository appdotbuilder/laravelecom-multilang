<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    /**
     * Display the admin dashboard.
     */
    public function index(Request $request)
    {
        // Check if user is admin
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized access. Admin privileges required.');
        }

        $period = $request->get('period', 'daily');
        
        // Get statistics
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::active()->count(),
            'total_categories' => Category::count(),
            'total_customers' => User::customers()->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
        ];

        // Get sales data based on period
        $salesData = $this->getSalesData($period);

        // Recent orders
        $recentOrders = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Top products
        $topProducts = Product::withCount(['orderItems as total_sold' => function($query) {
                $query->selectRaw('sum(quantity)');
            }])
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'period' => $period,
        ]);
    }

    /**
     * Get sales data for the specified period.
     */
    private function getSalesData(string $period): array
    {
        $now = Carbon::now();
        
        switch ($period) {
            case 'daily':
                $startDate = $now->copy()->subDays(30);
                $groupBy = 'DATE(created_at)';
                $dateFormat = 'Y-m-d';
                break;
            case 'weekly':
                $startDate = $now->copy()->subWeeks(12);
                $groupBy = 'YEARWEEK(created_at)';
                $dateFormat = 'Y-W';
                break;
            case 'monthly':
                $startDate = $now->copy()->subMonths(12);
                $groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
                $dateFormat = 'Y-m';
                break;
            case 'yearly':
                $startDate = $now->copy()->subYears(5);
                $groupBy = 'YEAR(created_at)';
                $dateFormat = 'Y';
                break;
            default:
                $startDate = $now->copy()->subDays(30);
                $groupBy = 'DATE(created_at)';
                $dateFormat = 'Y-m-d';
        }

        $salesData = Order::selectRaw("
            {$groupBy} as period,
            COUNT(*) as orders_count,
            SUM(total) as total_sales,
            AVG(total) as average_order_value
        ")
        ->where('created_at', '>=', $startDate)
        ->where('payment_status', 'paid')
        ->groupBy('period')
        ->orderBy('period')
        ->get();

        return [
            'labels' => $salesData->pluck('period')->toArray(),
            'orders' => $salesData->pluck('orders_count')->toArray(),
            'sales' => $salesData->pluck('total_sales')->toArray(),
            'average_order_value' => $salesData->pluck('average_order_value')->toArray(),
        ];
    }
}