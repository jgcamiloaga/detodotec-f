"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function HeroCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
    >
      <Link href="/products">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-xl bg-accent text-white font-bold text-base hover:bg-accent-600 transition-colors shadow-glow-accent cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5" />
          Ver productos
        </motion.span>
      </Link>
      <Link href="/products?sort=newest">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-colors cursor-pointer"
        >
          Novedades
          <ArrowRight className="h-4 w-4" />
        </motion.span>
      </Link>
    </motion.div>
  );
}
