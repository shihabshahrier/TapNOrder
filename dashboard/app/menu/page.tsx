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
        <div className="max-w-2xl mx-auto p-4 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/orders" className="p-2 hover:bg-white rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">Menu Management</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="space-y-8">
                    {categories.map((category) => (
                        <div key={category.id}>
                            <h2 className="text-lg font-semibold mb-4 px-2">{category.name}</h2>
                            <div className="space-y-3">
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center ${!item.is_available ? "opacity-60 grayscale" : ""
                                            }`}
                                    >
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-medium truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">${item.price}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleAvailability(item.id, item.is_available)}
                                                className={`p-2 rounded-lg transition-colors ${item.is_available
                                                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                title={item.is_available ? "Mark as Sold Out" : "Mark as Available"}
                                            >
                                                {item.is_available ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            {/* Edit functionality would go here */}
                                            <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                                                <Edit2 size={18} />
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
