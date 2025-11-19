"use client";

import { useCartStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton() {
    const [mounted, setMounted] = useState(false);
    const itemCount = useCartStore((state) => state.itemCount());
    const total = useCartStore((state) => state.total());

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {itemCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-background via-background/80 to-transparent pb-6"
                >
                    <Link
                        href="/cart"
                        className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-between max-w-md mx-auto hover:bg-primary/90 transition-all active:scale-95 backdrop-blur-md border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                <ShoppingBag size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base leading-none">{itemCount} items</span>
                                <span className="text-xs text-primary-foreground/80 font-medium mt-1">View your cart</span>
                            </div>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            <span className="font-bold text-lg">৳{total.toFixed(2)}</span>
                        </div>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
