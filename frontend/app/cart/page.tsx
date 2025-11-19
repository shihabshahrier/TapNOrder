"use client";

import { useCartStore } from "@/lib/store";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    const { items, updateQuantity, removeItem, total } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <Trash2 size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">
                    Looks like you haven&apos;t added anything yet.
                </p>
                <Link
                    href="/menu"
                    className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto pb-24">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            <div className="space-y-4 mb-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
                    >
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col flex-grow justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-medium text-sm w-4 text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Total</span>
                        <span className="text-2xl font-bold">${total().toFixed(2)}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-95"
                    >
                        Proceed to Checkout
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
