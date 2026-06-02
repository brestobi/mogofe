"use client";

import React from "react";

import { motion } from "framer-motion";
import { Member } from "@/lib/supabase";
import { Cake } from "lucide-react";

interface BirthdayCardProps {
  member: Member;
  index: number;
}

export function BirthdayCard({ member, index }: BirthdayCardProps) {
  const today = new Date();
  const birthDate = member.birth_date ? new Date(member.birth_date) : null;
  const nextBirthday = birthDate ? new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) : null;

  if (nextBirthday && nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const daysUntil = nextBirthday 
    ? Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const age = birthDate ? nextBirthday!.getFullYear() - birthDate.getFullYear() : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
          <Cake className="w-7 h-7 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            {member.first_name} {member.last_name}
          </h3>
          <p className="text-sm text-slate-500">
            Turning {age} years old
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {birthDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          daysUntil <= 7 
            ? 'bg-red-100 text-red-600' 
            : daysUntil <= 14 
              ? 'bg-amber-100 text-amber-600' 
              : 'bg-slate-100 text-slate-600'
        }`}>
          {daysUntil === 0 ? 'Today!' : `${daysUntil} days`}
        </div>
      </div>
    </motion.div>
  );
}
