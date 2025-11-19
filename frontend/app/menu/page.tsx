"use client";

import { useEffect, useState, useRef } from "react";
import { getMenu, MenuCategory } from "@/lib/api";
import MenuCard from "@/components/MenuCard";
import { Loader2, UtensilsCrossed, ShoppingBag } from "lucide-react";
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
        <div className="min-h-screen bg-gray-50/50 pb-32">
            {/* Hero Header */}
            <div className="bg-white pt-8 pb-6 px-6 shadow-sm mb-0 sticky top-0 z-40">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-4"
                >
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kacchi King 👑</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Authentic flavors, delivered.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/cart" className="relative bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                            <ShoppingBag className="text-gray-900" size={24} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <UtensilsCrossed className="text-orange-600" size={24} />
                        </div>
                    </div>
                </motion.div>

                {/* Category Tabs */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => scrollToCategory(category.id)}
                            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${activeCategory === category.id
                                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
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
