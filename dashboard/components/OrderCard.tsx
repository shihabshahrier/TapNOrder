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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{order.customer_name}</h3>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-500">{order.order_type.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">${order.total}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {order.items.slice(0, expanded ? undefined : 2).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>
                                {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-500">${item.subtotal}</span>
                        </div>
                    ))}

                    {order.items.length > 2 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700"
                        >
                            {expanded ? (
                                <>
                                    Show Less <ChevronUp size={12} />
                                </>
                            ) : (
                                <>
                                    Show {order.items.length - 2} more items <ChevronDown size={12} />
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    {nextAction && (
                        <button
                            onClick={() => handleStatusUpdate(nextAction)}
                            disabled={updating}
                            className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {updating && <Loader2 className="animate-spin" size={14} />}
                            Mark as {nextAction.replace(/_/g, " ")}
                        </button>
                    )}

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                            onClick={() => handleStatusUpdate("cancelled")}
                            disabled={updating}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {order.delivery_address && (
                <div className="bg-gray-50 p-3 text-xs text-gray-500 border-t">
                    📍 {order.delivery_address} • 📞 {order.customer_phone}
                </div>
            )}
        </div>
    );
}
