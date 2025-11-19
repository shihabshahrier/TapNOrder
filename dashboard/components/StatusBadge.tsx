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
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-blue-100 text-blue-800",
        cooking: "bg-orange-100 text-orange-800",
        on_the_way: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    const labels = {
        pending: "Pending",
        accepted: "Accepted",
        cooking: "Cooking",
        on_the_way: "On the Way",
        delivered: "Delivered",
        cancelled: "Cancelled",
    };

    const statusKey = status.toLowerCase() as keyof typeof styles;

    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                styles[statusKey] || "bg-gray-100 text-gray-800"
            )}
        >
            {labels[statusKey] || status}
        </span>
    );
}
