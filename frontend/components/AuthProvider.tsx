"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        const storedToken = localStorage.getItem("auth_token");

        if (urlToken) {
            // New session from WhatsApp link
            localStorage.setItem("auth_token", urlToken);
            setAuthorized(true);
            // Clean URL
            router.replace("/");
        } else if (storedToken) {
            // Existing session
            setAuthorized(true);
        } else {
            // No token found
            setAuthorized(false);
        }
    }, [router, searchParams]);

    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Loader2 className="text-primary animate-spin" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verifying Access...</h1>
                <p className="text-muted-foreground max-w-xs">
                    Please use the link sent to your WhatsApp to access the menu.
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
