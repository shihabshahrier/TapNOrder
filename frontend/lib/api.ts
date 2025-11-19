import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Types
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

export interface OrderItem {
    item_id: string;
    quantity: number;
}

export interface CreateOrderData {
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    order_type: 'pickup' | 'delivery';
    items: OrderItem[];
}

// API functions
export const getMenu = async (): Promise<MenuCategory[]> => {
    const response = await api.get('/menu');
    return response.data?.categories || [];
};

export const getOrder = async (id: string) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
};

export const createOrder = async (data: CreateOrderData) => {
    const response = await api.post('/order', data);
    return response.data;
};

export default api;
