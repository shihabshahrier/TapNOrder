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
            const sorted = (data.orders || []).sort((a: Order, b: Order) =>
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
        <div className="pb-20 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                {/* Header */}
                <div className="glass mb-8 p-6 rounded-3xl shadow-xl border border-white/50">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse-soft" />
                                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                                    <LayoutDashboard className="text-white" size={28} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">Live Orders</h1>
                                <p className="text-sm text-gray-600 font-medium mt-1">
                                    Real-time order management
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchOrders}
                                className="p-3 hover:bg-white/80 bg-white/50 rounded-xl transition-all shadow-sm hover:shadow-md border border-gray-200/50"
                                title="Refresh"
                            >
                                <RefreshCw size={22} className={`text-gray-700 ${loading ? "animate-spin" : ""}`} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-3 hover:bg-red-50 bg-white/50 text-red-600 rounded-xl transition-all shadow-sm hover:shadow-md border border-red-200/50"
                                title="Logout"
                            >
                                <LogOut size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2 bg-white/60 p-2 rounded-2xl w-fit">
                        <Link
                            href="/orders"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2"
                        >
                            <LayoutDashboard size={18} strokeWidth={2.5} />
                            Orders
                        </Link>
                        <Link
                            href="/menu"
                            className="px-6 py-3 text-gray-600 hover:text-gray-900 rounded-xl text-sm font-bold hover:bg-white/80 transition-all flex items-center gap-2"
                        >
                            <UtensilsCrossed size={18} strokeWidth={2.5} />
                            Menu
                        </Link>
                    </div>
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
