"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-black text-white p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Dashboard Access</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your API key to access the restaurant dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors active:scale-95"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
