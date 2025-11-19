"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="bg-green-100 text-green-600 p-6 rounded-full mb-6 animate-bounce">
                <CheckCircle2 size={64} />
            </div>

            <h1 className="text-3xl font-bold mb-4">Order Received!</h1>

            <p className="text-gray-500 mb-8 max-w-md">
                Thank you for your order. We have sent a confirmation to your WhatsApp number.
            </p>

            {orderId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-8 w-full max-w-xs">
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono font-bold text-lg break-all">{orderId}</p>
                </div>
            )}

            <div className="space-y-4 w-full max-w-xs">
                <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors"
                >
                    <MessageCircle size={20} />
                    Open WhatsApp
                </a>

                <Link
                    href="/menu"
                    className="w-full block bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                    Order More
                </Link>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
