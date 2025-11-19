"use client";

import { useEffect, useState } from "react";
import { getMenu, MenuCategory, updateMenuItem } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Edit2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MenuManagementPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/");
            return;
        }
        fetchMenu();
    }, [isAuthenticated, router]);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const data = await getMenu();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
        try {
            await updateMenuItem(itemId, { is_available: !currentStatus });
            // Optimistic update
            setCategories(categories.map(cat => ({
                ...cat,
                items: cat.items.map(item =>
                    item.id === itemId ? { ...item, is_available: !currentStatus } : item
                )
            })));
        } catch (error) {
            console.error("Failed to update item:", error);
            alert("Failed to update item status");
            fetchMenu(); // Revert on error
        }
    };

    if (!isAuthenticated()) return null;

    return (
        <div className="max-w-3xl mx-auto p-4 pb-20 min-h-screen">
            <div className="glass mb-8 p-6 rounded-3xl shadow-xl border border-white/50">
                <div className="flex items-center gap-4">
                    <Link
                        href="/orders"
                        className="p-3 hover:bg-white/80 bg-white/50 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft size={24} strokeWidth={2.5} className="text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Menu Management</h1>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                            Manage availability and pricing
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse-soft" />
                        <Loader2 className="relative animate-spin text-blue-600" size={48} strokeWidth={2.5} />
                    </div>
                </div>
            ) : (
                <div className="space-y-10">
                    {categories.map((category) => (
                        <div key={category.id}>
                            <div className="flex items-center gap-3 mb-5 px-2">
                                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                                <div className="h-1 flex-grow bg-gradient-to-r from-gray-200 to-transparent rounded-full" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {category.items.length} items
                                </span>
                            </div>
                            <div className="space-y-4">
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex gap-4 items-center transition-all hover:shadow-lg ${!item.is_available ? "opacity-60" : ""
                                            }`}
                                    >
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                                    🍽️
                                                </div>
                                            )}
                                            {!item.is_available && (
                                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">OUT</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-bold text-lg truncate text-gray-900">{item.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-black text-orange-600">৳{item.price}</span>
                                                {item.is_available ? (
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleAvailability(item.id, item.is_available)}
                                                className={`p-3 rounded-xl transition-all shadow-sm hover:shadow-md ${item.is_available
                                                    ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                                                    }`}
                                                title={item.is_available ? "Mark as Sold Out" : "Mark as Available"}
                                            >
                                                {item.is_available ? <Eye size={20} strokeWidth={2.5} /> : <EyeOff size={20} strokeWidth={2.5} />}
                                            </button>
                                            <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm hover:shadow-md border border-blue-200">
                                                <Edit2 size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
