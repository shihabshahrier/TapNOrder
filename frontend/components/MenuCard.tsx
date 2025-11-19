"use client";

import { MenuItem } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { Plus } from "lucide-react";
import Image from "next/image";

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="relative h-48 w-full bg-gray-200">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                    <span className="font-bold text-green-600">${item.price}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {item.description}
                </p>

                <button
                    onClick={() => addItem(item)}
                    disabled={!item.is_available}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${item.is_available
                            ? "bg-black text-white hover:bg-gray-800 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    <Plus size={18} />
                    {item.is_available ? "Add to Cart" : "Sold Out"}
                </button>
            </div>
        </div>
    );
}
