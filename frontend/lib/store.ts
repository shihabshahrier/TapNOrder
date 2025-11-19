import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from './api';

export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: MenuItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...items, { ...item, quantity: 1 }] });
                }
            },

            removeItem: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                set({
                    items: get().items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            total: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },

            itemCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
