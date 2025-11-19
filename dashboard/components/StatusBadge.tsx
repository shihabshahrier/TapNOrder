import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
        accepted: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
        cooking: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
        on_the_way: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
        delivered: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
        cancelled: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    };

    const labels = {
        pending: "⏳ Pending",
        accepted: "✓ Accepted",
        cooking: "🍳 Cooking",
        on_the_way: "🚴 On the Way",
        delivered: "✓ Delivered",
        cancelled: "✕ Cancelled",
    };

    const statusKey = status.toLowerCase() as keyof typeof styles;

    return (
        <span
            className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm",
                styles[statusKey] || "bg-gray-100 text-gray-800 border-gray-300"
            )}
        >
            {labels[statusKey] || status}
        </span>
    );
}
