import axios from 'axios';
import { useAuthStore } from './store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        // For prototype, we might just use a simple API key header if backend expects that
        // But let's assume we send it as a header. 
        // The backend spec mentioned "Simple API key header for dashboard".
        // So let's add 'x-api-key': token
        config.headers['x-api-key'] = token;
    }
    return config;
});

// Types
export interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    order_type: 'pickup' | 'delivery';
    total: number;
    status: 'pending' | 'accepted' | 'cooking' | 'on_the_way' | 'delivered' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface MenuItem {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: boolean;
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

// API functions
export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
};

export const getMenu = async () => {
    const response = await api.get('/menu');
    return response.data?.categories || [];
};

export const updateMenuItem = async (itemId: string, data: Partial<MenuItem>) => {
    const response = await api.patch(`/menu/${itemId}`, data);
    return response.data;
};

export const createMenuItem = async (data: Omit<MenuItem, 'id'>) => {
    const response = await api.post('/menu', data);
    return response.data;
};

export default api;
