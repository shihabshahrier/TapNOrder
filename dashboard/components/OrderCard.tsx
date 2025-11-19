"use client";

import { Order, updateOrderStatus } from "@/lib/api";
import StatusBadge from "./StatusBadge";
import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface OrderCardProps {
    order: Order;
    onUpdate: () => void;
}

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
    const [updating, setUpdating] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            onUpdate();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const nextStatus = {
        pending: "accepted",
        accepted: "cooking",
        cooking: "on_the_way",
        on_the_way: "delivered",
    };

    const nextAction = nextStatus[order.status as keyof typeof nextStatus];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                                {order.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">{order.customer_name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <StatusBadge status={order.status} />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {order.order_type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-2 rounded-xl border border-green-200">
                            <p className="font-black text-2xl text-green-700">৳{order.total}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-medium">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <div className="space-y-2.5">
                        {order.items.slice(0, expanded ? undefined : 2).map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-lg text-xs">
                                        {item.quantity}x
                                    </span>
                                    <span className="font-semibold text-gray-700">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">৳{item.subtotal}</span>
                            </div>
                        ))}

                        {order.items.length > 2 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 mt-2 transition-colors"
                            >
                                {expanded ? (
                                    <>
                                        Show Less <ChevronUp size={14} />
                                    </>
                                ) : (
                                    <>
                                        +{order.items.length - 2} more items <ChevronDown size={14} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                    {nextAction && (
                        <button
                            onClick={() => handleStatusUpdate(nextAction)}
                            disabled={updating}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            {updating && <Loader2 className="animate-spin" size={16} />}
                            {!updating && "Mark as"} {nextAction.replace(/_/g, " ")}
                        </button>
                    )}

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                            onClick={() => handleStatusUpdate("cancelled")}
                            disabled={updating}
                            className="px-5 py-3.5 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {order.delivery_address && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 text-sm text-gray-600 border-t border-gray-100 font-medium">
                    <div className="flex items-start gap-3">
                        <span className="text-lg">📍</span>
                        <div className="flex-1">
                            <p className="mb-1">{order.delivery_address}</p>
                            <p className="text-xs text-gray-500">📞 {order.customer_phone}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
