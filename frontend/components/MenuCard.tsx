"use client";

import { MenuItem } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const { items, addItem, updateQuantity } = useCartStore();
    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="group bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🍽️</div>
                            <div className="text-sm">No Image</div>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {!item.is_available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-md">
                        <div className="text-center">
                            <span className="text-white font-bold px-6 py-2 border-2 border-white rounded-full uppercase tracking-wider text-sm shadow-lg">
                                Sold Out
                            </span>
                        </div>
                    </div>
                )}

                {quantity > 0 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-xl border-2 border-white animate-pulse-soft">
                        {quantity}
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50">
                        <span className="font-black text-lg bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                            ৳{item.price}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-xl text-foreground leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                    {item.name}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {item.description}
                </p>

                {quantity > 0 ? (
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2 shadow-inner">
                        <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95 text-foreground"
                        >
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <span className="font-black text-xl text-foreground px-4">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => addItem(item)}
                        disabled={!item.is_available}
                        className={`w-full py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all duration-300 ${item.is_available
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <Plus size={22} strokeWidth={2.5} />
                        {item.is_available ? "Add to Order" : "Unavailable"}
                    </button>
                )}
            </div>
        </div>
    );
}
