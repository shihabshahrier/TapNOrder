"use client";

import { useCartStore } from "@/lib/store";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, updateQuantity, removeItem, total } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="bg-muted p-8 rounded-full mb-6"
                >
                    <Trash2 size={64} className="text-muted-foreground" />
                </motion.div>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold mb-3 text-foreground"
                >
                    Your cart is empty
                </motion.h2>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground mb-8 text-lg max-w-xs mx-auto"
                >
                    Looks like you haven&apos;t added anything yet. Hungry?
                </motion.p>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/menu"
                        className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 inline-block"
                    >
                        Browse Menu
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-40">
            <div className="p-6 max-w-md mx-auto">
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-8 text-foreground"
                >
                    Your Cart
                </motion.h1>

                <div className="space-y-6 mb-8">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-card p-4 rounded-2xl shadow-sm border border-border flex gap-4"
                            >
                                <div className="relative w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col flex-grow justify-between py-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-bold text-lg line-clamp-1 text-foreground">{item.name}</h3>
                                        <span className="font-bold text-primary whitespace-nowrap">৳{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-3 bg-muted rounded-lg p-1.5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 hover:bg-white rounded-md transition-colors shadow-sm text-foreground"
                                            >
                                                <Minus size={16} strokeWidth={2.5} />
                                            </button>
                                            <span className="font-bold text-sm w-6 text-center text-foreground">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 hover:bg-white rounded-md transition-colors shadow-sm text-foreground"
                                            >
                                                <Plus size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-6 safe-area-bottom z-50"
            >
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground font-medium">Total Amount</span>
                        <span className="text-3xl font-bold text-foreground">৳{total().toFixed(2)}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Proceed to Checkout
                        <ArrowRight size={22} strokeWidth={2.5} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
