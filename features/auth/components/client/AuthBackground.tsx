"use client";

import { motion } from "framer-motion";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 bg-gradient-to-br from-[#eff6ff] to-[#e0e7ff]">
      {/* Soft gradient top */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent" />

      {/* ---- Large Blur Elements ---- */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px]"
      />

      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[80px]"
      />

      {/* ---- Floating Geometry Elements ---- */}
      {/* Element 1: Outline Square */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-16 h-16 rounded-xl border-[3px] border-primary/20"
      />

      {/* Element 2: Small Outline Circle */}
      <motion.div
        animate={{ y: [0, 50, 0], x: [0, -30, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[30%] left-[15%] w-10 h-10 rounded-full border-2 border-accent/30"
      />

      {/* Element 5: Filled tiny dot */}
      <motion.div
        animate={{ y: [0, -100, 0], x: [0, -50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[40%] right-[30%] w-4 h-4 rounded-full bg-accent/30"
      />

      {/* Element 6: Semi-transparent square */}
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[15%] right-[40%] w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-md"
      />

      {/* Element 7: Multiple outline circles */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute top-[50%] left-[10%] w-20 h-20 rounded-full border border-secondary/20 flex items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full border border-secondary/10" />
      </motion.div>

      {/* Element 8: Outline square bottom left */}
      <motion.div
        animate={{ y: [0, -50, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[10%] left-[40%] w-12 h-12 border-2 border-accent/20 rounded-lg"
      />
    </div>
  );
}
