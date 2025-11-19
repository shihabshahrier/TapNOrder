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
        <div className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
            <div className="relative h-52 w-full bg-muted">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                    </div>
                )}
                {!item.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold px-4 py-1 border-2 border-white rounded-full uppercase tracking-wider text-sm">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg text-foreground leading-tight">{item.name}</h3>
                    <span className="font-bold text-primary whitespace-nowrap">৳{item.price}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {item.description}
                </p>

                <button
                    onClick={() => addItem(item)}
                    disabled={!item.is_available}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all active:scale-95 ${item.is_available
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                >
                    <Plus size={20} strokeWidth={2.5} />
                    {item.is_available ? "Add to Order" : "Unavailable"}
                </button>
            </div>
        </div>
    );
}
