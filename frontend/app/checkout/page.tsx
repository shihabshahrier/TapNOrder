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
        <div className="min-h-screen bg-background pb-24">
            <div className="p-6 max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2.5 hover:bg-muted rounded-full transition-colors text-foreground">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-5">
                        <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Contact Info
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.customer_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, customer_name: e.target.value })
                                }
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.customer_phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, customer_phone: e.target.value })
                                }
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    {/* Order Type */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-5">
                        <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Order Type
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, order_type: "delivery" })}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.order_type === "delivery"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border hover:border-primary/50 text-muted-foreground"
                                    }`}
                            >
                                Delivery
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, order_type: "pickup" })}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.order_type === "pickup"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border hover:border-primary/50 text-muted-foreground"
                                    }`}
                            >
                                Pickup
                            </button>
                        </div>

                        {formData.order_type === "delivery" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                    Delivery Address
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
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
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <h2 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Order Summary
                        </h2>
                        <div className="space-y-3 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">
                                        <span className="text-foreground font-bold">{item.quantity}x</span> {item.name}
                                    </span>
                                    <span className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between items-end">
                            <span className="text-muted-foreground font-medium">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">৳{total().toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
    );
}
