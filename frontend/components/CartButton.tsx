"use client";

import { useCartStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartButton() {
    const [mounted, setMounted] = useState(false);
    const itemCount = useCartStore((state) => state.itemCount());
    const total = useCartStore((state) => state.total());

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
    }, []);

    if (!mounted || itemCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
            <Link
                href="/cart"
                className="bg-black text-white p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md mx-auto hover:bg-gray-900 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded-lg">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{itemCount} items</span>
                        <span className="text-xs text-gray-400">View Cart</span>
                    </div>
                </div>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </Link>
        </div>
    );
}
