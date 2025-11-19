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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-md mx-auto"
        >
          <motion.div variants={item} className="mb-8 flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-primary/20">
              <span className="text-4xl">👑</span>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">
            Kacchi King
          </motion.h1>

          <motion.p variants={item} className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Experience the royal taste of authentic Kacchi Biryani, delivered straight to your doorstep.
          </motion.p>

          <motion.div variants={item}>
            <Link
              href="/menu"
              className="group bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Order
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
          {[
            { icon: UtensilsCrossed, label: "Fresh Food" },
            { icon: ShoppingBag, label: "Easy Order" },
            { icon: Truck, label: "Fast Delivery" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="bg-primary/5 p-3 rounded-xl text-primary">
                <feature.icon size={24} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
