"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [authorized, setAuthorized] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        const storedToken = localStorage.getItem("auth_token");

        // Use a microtask to avoid synchronous setState in effect
        Promise.resolve().then(() => {
            if (urlToken) {
                // New session from WhatsApp link
                localStorage.setItem("auth_token", urlToken);
                setAuthorized(true);
                setVerifying(false);
                // Redirect to menu after showing splash
                setTimeout(() => {
                    router.replace("/menu");
                }, 1500);
            } else if (storedToken) {
                // Existing session
                setAuthorized(true);
                setVerifying(false);
            } else {
                // No token found - show unauthorized message
                setAuthorized(false);
                setVerifying(false);
            }
        });
    }, [router, searchParams]);

    // Show splash screen during verification
    if (verifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-float" />
                    <div className="absolute bottom-20 left-10 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                </div>

                {/* Splash Content */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 animate-pulse-soft" />
                            <div className="relative bg-white p-8 rounded-full shadow-2xl">
                                <span className="text-7xl">👑</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl"
                    >
                        Kacchi King
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-xl text-white/90 font-medium drop-shadow-lg"
                    >
                        Verifying Access...
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                        className="mt-12 flex gap-2"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-white rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Show unauthorized message
    if (!authorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 flex flex-col items-center text-center max-w-md"
                >
                    <div className="mb-8">
                        <div className="relative bg-white p-8 rounded-full shadow-2xl">
                            <span className="text-7xl">🔒</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Access Required</h1>
                    <p className="text-white/90 text-lg leading-relaxed drop-shadow">
                        Please use the link sent to your WhatsApp to access the menu.
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
