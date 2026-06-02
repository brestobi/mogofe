"use client";

import React from "react";

import { TreePine, Heart } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <TreePine className="w-6 h-6 text-amber-500" />
            <span className="text-lg font-bold text-white">FamilyRoots</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-400 flex items-center gap-1"
          >
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for families everywhere
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-500"
          >
            &copy; {new Date().getFullYear()} FamilyRoots. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
