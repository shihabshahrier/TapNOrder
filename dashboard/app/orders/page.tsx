"use client";

import { useEffect, useState } from "react";
import { getOrders, Order } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, LogOut, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RevenueChart from "@/components/RevenueChart";

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

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
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
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-xl">
                            <LayoutDashboard className="text-blue-600" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchOrders}
                            className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className={`text-gray-600 ${loading ? "animate-spin" : ""}`} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-100"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>


                {/* Navigation */}
                <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
                    <Link
                        href="/orders"
                        className="px-6 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
                    >
                        <LayoutDashboard size={16} />
                        Orders
                    </Link>
                    <Link
                        href="/menu"
                        className="px-6 py-2.5 text-gray-500 hover:text-gray-900 rounded-xl text-sm font-medium hover:bg-white/50 transition-all flex items-center gap-2"
                    >
                        <UtensilsCrossed size={16} />
                        Menu
                    </Link>
                </div>

                {/* Charts */}
                <RevenueChart />

                {/* Orders List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {loading && orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center py-12"
                            >
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                            </motion.div>
                        ) : orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
                            >
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LayoutDashboard className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                                <p className="text-gray-500">New orders will appear here automatically.</p>
                            </motion.div>
                        ) : (
                            orders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                >
                                    <OrderCard
                                        order={order}
                                        onUpdate={fetchOrders}
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
