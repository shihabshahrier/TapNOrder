"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { createOrder } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, Store, Bike } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        order_type: "delivery" as "delivery" | "pickup",
    });

    if (items.length === 0) {
        router.push("/menu");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const orderData = {
                ...formData,
                // Clear address if pickup
                delivery_address: formData.order_type === "pickup" ? "Pickup Order" : formData.delivery_address,
                items: items.map((item) => ({
                    item_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await createOrder(orderData);
            clearCart();
            router.push(`/confirmation?orderId=${response.id}`);
        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="p-6 max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2.5 hover:bg-white rounded-full transition-colors text-gray-900 shadow-sm bg-white/50">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, order_type: "delivery" })}
                            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${formData.order_type === "delivery"
                                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10"
                                    : "border-transparent bg-white text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            <div className={`p-3 rounded-full ${formData.order_type === "delivery" ? "bg-blue-100" : "bg-gray-100"}`}>
                                <Bike size={24} />
                            </div>
                            <span className="font-bold">Delivery</span>
                            {formData.order_type === "delivery" && (
                                <motion.div layoutId="activeType" className="absolute inset-0 border-2 border-blue-500 rounded-2xl" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, order_type: "pickup" })}
                            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${formData.order_type === "pickup"
                                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-500/10"
                                    : "border-transparent bg-white text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            <div className={`p-3 rounded-full ${formData.order_type === "pickup" ? "bg-orange-100" : "bg-gray-100"}`}>
                                <Store size={24} />
                            </div>
                            <span className="font-bold">Pickup</span>
                            {formData.order_type === "pickup" && (
                                <motion.div layoutId="activeType" className="absolute inset-0 border-2 border-orange-500 rounded-2xl" />
                            )}
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-5">
                        <h2 className="font-bold text-lg text-gray-900">Contact Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl focus:border-gray-900 outline-none transition-all font-medium"
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-4 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl focus:border-gray-900 outline-none transition-all font-medium"
                                    value={formData.customer_phone}
                                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                    placeholder="+880 1..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address - Conditional */}
                    <AnimatePresence mode="popLayout">
                        {formData.order_type === "delivery" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white p-6 rounded-3xl shadow-sm space-y-5">
                                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                        <MapPin size={20} className="text-blue-500" />
                                        Delivery Location
                                    </h2>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full p-4 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl focus:border-blue-500 outline-none resize-none transition-all font-medium"
                                        value={formData.delivery_address}
                                        onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                                        placeholder="House #, Road #, Area..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h2 className="font-bold text-lg mb-4 text-gray-900">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100 text-gray-900 font-bold px-2 py-1 rounded-md text-xs">
                                            {item.quantity}x
                                        </span>
                                        <span className="text-gray-600 font-medium">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
                            <span className="text-gray-500 font-medium">Total Amount</span>
                            <span className="text-3xl font-extrabold text-gray-900">৳{total().toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 hover:bg-black transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            "Confirm Order"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
