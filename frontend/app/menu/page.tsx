"use client";

import { useEffect, useState } from "react";
import { getMenu, MenuCategory } from "@/lib/api";
import MenuCard from "@/components/MenuCard";
import { Loader2 } from "lucide-react";

export default function MenuPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await getMenu();
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategory(data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch menu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Our Menu</h1>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category.id
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-8">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={activeCategory === category.id ? "block" : "hidden"}
                    >
                        <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {category.items.map((item) => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
