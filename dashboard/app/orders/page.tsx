"use client";

import { useEffect, useState } from "react";
import { getOrders, Order } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/");
            return;
        }
        fetchOrders();
    }, [isAuthenticated, router]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            // Sort by date desc
            const sorted = data.sort((a: Order, b: Order) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setOrders(sorted);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!isAuthenticated()) return null;

    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Live Orders</h1>
                <div className="flex gap-2">
                    <button
                        onClick={fetchOrders}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <Link
                    href="/orders"
                    className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium whitespace-nowrap"
                >
                    Orders
                </Link>
                <Link
                    href="/menu"
                    className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50"
                >
                    Menu Management
                </Link>
            </div>

            {loading && orders.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No orders yet
                        </div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdate={fetchOrders}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
