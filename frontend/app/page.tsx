"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto"
        >
          <motion.div variants={item} className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-xl opacity-50 animate-pulse-soft" />
              <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
                <span className="text-6xl">👑</span>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            variants={item} 
            className="text-5xl md:text-6xl font-black mb-4 text-foreground tracking-tight"
          >
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Kacchi King
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-sm mx-auto">
            Experience the royal taste of authentic Kacchi Biryani, delivered straight to your doorstep.
          </motion.p>

          <motion.div variants={item}>
            <Link
              href="/menu"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_100%] animate-shimmer" />
              <span className="relative text-white flex items-center gap-3">
                Start Order
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={22} />
              </span>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            variants={item}
            className="mt-16 flex items-center justify-center gap-8 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">500+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.9</div>
              <div className="text-muted-foreground">Rating</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">30min</div>
              <div className="text-muted-foreground">Delivery</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 glass py-12 px-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-white/50">
        <div className="max-w-md mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-bold mb-8 text-foreground"
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: UtensilsCrossed, label: "Fresh Food", color: "from-green-400 to-green-600" },
              { icon: ShoppingBag, label: "Easy Order", color: "from-blue-400 to-blue-600" },
              { icon: Truck, label: "Fast Delivery", color: "from-orange-400 to-orange-600" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center text-center gap-3 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl text-white shadow-lg`}>
                  <feature.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-foreground">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
