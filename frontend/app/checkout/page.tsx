"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { createOrder } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="p-4 max-w-md mx-auto pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h2 className="font-semibold text-lg">Contact Info</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            value={formData.customer_name}
                            onChange={(e) =>
                                setFormData({ ...formData, customer_name: e.target.value })
                            }
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            value={formData.customer_phone}
                            onChange={(e) =>
                                setFormData({ ...formData, customer_phone: e.target.value })
                            }
                            placeholder="+1 234 567 8900"
                        />
                    </div>
                </div>

                {/* Order Type */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h2 className="font-semibold text-lg">Order Type</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, order_type: "delivery" })}
                            className={`p-4 rounded-lg border-2 font-medium transition-all ${formData.order_type === "delivery"
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            Delivery
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, order_type: "pickup" })}
                            className={`p-4 rounded-lg border-2 font-medium transition-all ${formData.order_type === "pickup"
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            Pickup
                        </button>
                    </div>

                    {formData.order_type === "delivery" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Address
                            </label>
                            <textarea
                                required
                                rows={3}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                                value={formData.delivery_address}
                                onChange={(e) =>
                                    setFormData({ ...formData, delivery_address: e.target.value })
                                }
                                placeholder="Enter your full address"
                            />
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.quantity}x {item.name}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total().toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Placing Order...
                        </>
                    ) : (
                        "Place Order"
                    )}
                </button>
            </form>
        </div>
    );
}
