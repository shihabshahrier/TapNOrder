"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setToken(apiKey);
      router.push("/orders");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="bg-gray-100 p-5 rounded-full"
          >
            <Lock size={32} className="text-gray-800" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your secure key to manage orders.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white focus:bg-white"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
          >
            Access Dashboard
            <ArrowRight size={20} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
