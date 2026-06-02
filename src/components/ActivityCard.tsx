"use client";

import React from "react";

import { motion } from "framer-motion";
import { Activity } from "@/lib/supabase";
import { UserPlus, Pencil, Trash2, BookOpen, Heart, Image } from "lucide-react";

const activityIcons = {
  member_added: UserPlus,
  member_updated: Pencil,
  member_deleted: Trash2,
  memory_added: BookOpen,
  wish_added: Heart,
  gallery_added: Image,
};

const activityColors = {
  member_added: "bg-emerald-100 text-emerald-600",
  member_updated: "bg-blue-100 text-blue-600",
  member_deleted: "bg-red-100 text-red-600",
  memory_added: "bg-amber-100 text-amber-600",
  wish_added: "bg-pink-100 text-pink-600",
  gallery_added: "bg-purple-100 text-purple-600",
};

interface ActivityCardProps {
  activity: Activity;
  index: number;
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const Icon = activityIcons[activity.type] || UserPlus;
  const colorClass = activityColors[activity.type] || "bg-slate-100 text-slate-600";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 glass rounded-xl hover:shadow-md transition-shadow"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-slate-900 font-medium">{activity.description}</p>
        <p className="text-sm text-slate-500">
          {new Date(activity.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
