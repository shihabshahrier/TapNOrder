"use client";

import { useEffect, useState } from "react";
import { getMenu, MenuCategory } from "@/lib/api";
import MenuCard from "@/components/MenuCard";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <div className="bg-white p-6 shadow-sm mb-6 sticky top-0 z-40 bg-opacity-90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Kacchi King 👑</h1>
                        <p className="text-muted-foreground text-sm mt-1">Authentic flavors delivered to you.</p>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-md mx-auto px-4">
                {/* Category Tabs */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-2 no-scrollbar sticky top-[88px] z-30 bg-background/95 backdrop-blur-sm py-2 -mx-4 px-4">
                    {categories.map((category, idx) => (
                        <motion.button
                            key={category.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${activeCategory === category.id
                                ? "bg-primary text-primary-foreground shadow-primary/25 ring-2 ring-primary ring-offset-2"
                                : "bg-white text-muted-foreground hover:bg-gray-50 border border-border"
                                }`}
                        >
                            {category.name}
                        </motion.button>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-8 min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        {categories.map((category) => (
                            activeCategory === category.id && (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                                        <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                                            {category.items.length} items
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {category.items.map((item, idx) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <MenuCard item={item} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
