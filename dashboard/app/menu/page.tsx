"use client";

import { useEffect, useState } from "react";
import { getMenu, MenuCategory, MenuItem, updateMenuItem, createMenuItem, deleteMenuItem } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Edit2, Eye, EyeOff, Plus, Trash2, X, Save, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface EditFormData {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    is_available: boolean;
}

export default function MenuManagementPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<EditFormData>({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        category_id: "",
        is_available: true,
    });
    const [submitting, setSubmitting] = useState(false);
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
            setCategories(categories.map(cat => ({
                ...cat,
                items: cat.items.map(item =>
                    item.id === itemId ? { ...item, is_available: !currentStatus } : item
                )
            })));
        } catch (error) {
            console.error("Failed to update item:", error);
            alert("Failed to update item status");
            fetchMenu();
        }
    };

    const handleAddItem = () => {
        if (categories.length > 0) {
            setFormData({
                name: "",
                description: "",
                price: 0,
                image_url: "",
                category_id: categories[0].id,
                is_available: true,
            });
            setShowAddModal(true);
        }
    };

    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: item.category_id,
            is_available: item.is_available,
        });
        setShowEditModal(true);
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createMenuItem(formData);
            setShowAddModal(false);
            fetchMenu();
        } catch (error) {
            console.error("Failed to create item:", error);
            alert("Failed to create menu item");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        setSubmitting(true);
        try {
            await updateMenuItem(editingItem.id, formData);
            setShowEditModal(false);
            setEditingItem(null);
            fetchMenu();
        } catch (error) {
            console.error("Failed to update item:", error);
            alert("Failed to update menu item");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteItem = async (itemId: string, itemName: string) => {
        if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
        try {
            await deleteMenuItem(itemId);
            fetchMenu();
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Failed to delete menu item");
        }
    };

    if (!isAuthenticated()) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 pb-20 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass mb-8 p-6 rounded-3xl shadow-xl border border-white/50"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/orders"
                            className="p-3 hover:bg-white/80 bg-white/50 rounded-xl transition-all shadow-sm hover:shadow-md group"
                        >
                            <ArrowLeft size={24} strokeWidth={2.5} className="text-gray-700 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Menu Management</h1>
                            <p className="text-sm text-gray-600 font-medium mt-1">
                                Manage your restaurant menu items
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddItem}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        Add Item
                    </motion.button>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse-soft" />
                        <Loader2 className="relative animate-spin text-blue-600" size={48} strokeWidth={2.5} />
                    </div>
                </div>
            ) : categories.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-3xl text-center"
                >
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Menu Items</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first menu item</p>
                    <button
                        onClick={handleAddItem}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add First Item
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-10">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-5 px-2">
                                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                                <div className="h-1 flex-grow bg-gradient-to-r from-blue-200 via-purple-200 to-transparent rounded-full" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {category.items.length} items
                                </span>
                            </div>
                            <div className="space-y-4">
                                {category.items.map((item, itemIndex) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: itemIndex * 0.05 }}
                                        whileHover={{ scale: 1.01 }}
                                        className={`bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex gap-4 items-center transition-all hover:shadow-xl ${!item.is_available ? "opacity-60" : ""
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
                                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
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
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleAvailability(item.id, item.is_available)}
                                                className={`p-3 rounded-xl transition-all shadow-sm hover:shadow-md ${item.is_available
                                                    ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                                                    }`}
                                                title={item.is_available ? "Mark as Sold Out" : "Mark as Available"}
                                            >
                                                {item.is_available ? <Eye size={20} strokeWidth={2.5} /> : <EyeOff size={20} strokeWidth={2.5} />}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEditItem(item)}
                                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm hover:shadow-md border border-blue-200"
                                            >
                                                <Edit2 size={20} strokeWidth={2.5} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm hover:shadow-md border border-red-200"
                                            >
                                                <Trash2 size={20} strokeWidth={2.5} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modals */}
            <AnimatePresence>
                {showAddModal && (
                    <FormModal
                        title="Add New Item"
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        onSubmit={handleSubmitAdd}
                        onClose={() => setShowAddModal(false)}
                        submitting={submitting}
                    />
                )}
                {showEditModal && editingItem && (
                    <FormModal
                        title="Edit Menu Item"
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        onSubmit={handleSubmitEdit}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingItem(null);
                        }}
                        submitting={submitting}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Form Modal Component
interface FormModalProps {
    title: string;
    formData: EditFormData;
    setFormData: (data: EditFormData) => void;
    categories: MenuCategory[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    submitting: boolean;
}

function FormModal({ title, formData, setFormData, categories, onSubmit, onClose, submitting }: FormModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-black text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price (৳)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_available"
                            checked={formData.is_available}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="is_available" className="text-sm font-bold text-gray-700">
                            Available for order
                        </label>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={20} />
                                    {title.includes("Add") ? "Create Item" : "Save Changes"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
