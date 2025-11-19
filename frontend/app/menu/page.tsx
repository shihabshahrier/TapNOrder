"use client";

import { useEffect, useState, useRef } from "react";
import { getMenu, MenuCategory } from "@/lib/api";
import MenuCard from "@/components/MenuCard";
import { Loader2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import Link from "next/link";

export default function MenuPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const itemCount = useCartStore((state) => state.itemCount());

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

    // Scroll spy to update active category
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150; // Offset for header

            for (const category of categories) {
                const element = categoryRefs.current[category.id];
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(category.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [categories]);

    const scrollToCategory = (categoryId: string) => {
        setActiveCategory(categoryId);
        const element = categoryRefs.current[categoryId];
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - 140;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white pb-32">
            {/* Hero Header */}
            <div className="glass sticky top-0 z-40 border-b border-white/50 shadow-lg">
                <div className="pt-8 pb-6 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center mb-6"
                    >
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                    Kacchi King
                                </span> 👑
                            </h1>
                            <p className="text-gray-600 text-sm mt-1 font-semibold">Authentic flavors, delivered fresh.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/cart"
                                className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-3.5 rounded-2xl hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md"
                            >
                                <ShoppingBag className="text-white" size={22} strokeWidth={2.5} />
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-orange-600 shadow-lg"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </Link>
                        </div>
                    </motion.div>

                    {/* Category Tabs */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => scrollToCategory(category.id)}
                                className={`relative px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 ${activeCategory === category.id
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                                    }`}
                            >
                                {category.name}
                                {activeCategory === category.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl -z-10"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6">
                {/* Menu Items */}
                <div className="space-y-10">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            id={category.id}
                            ref={(el) => { categoryRefs.current[category.id] = el; }}
                            className="scroll-mt-32"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                                <div className="h-1 flex-grow bg-gray-100 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {category.items.length} Items
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {category.items.map((item) => (
                                    <MenuCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
