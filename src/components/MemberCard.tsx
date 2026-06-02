"use client";

import React from "react";

import { motion } from "framer-motion";
import { Member } from "@/lib/supabase";
import { User } from "lucide-react";

interface MemberCardProps {
  member: Member;
  index?: number;
  onClick?: () => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export function MemberCard({ member, index = 0, onClick, isHighlighted, isDimmed }: MemberCardProps) {
  const age = member.birth_date && !member.death_date
    ? new Date().getFullYear() - new Date(member.birth_date).getFullYear()
    : member.death_date && member.birth_date
      ? new Date(member.death_date).getFullYear() - new Date(member.birth_date).getFullYear()
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        scale: isHighlighted ? 1.05 : 1,
      }}
      whileHover={{ scale: isDimmed ? 0.95 : 1.02 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`glass rounded-xl p-4 cursor-pointer transition-all ${
        isHighlighted ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/20' : ''
      } ${isDimmed ? 'pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={`${member.first_name} ${member.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500">
              <User className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {member.first_name} {member.last_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {member.birth_date && (
              <span>{new Date(member.birth_date).getFullYear()}</span>
            )}
            {age !== null && (
              <span className="text-slate-400">({age} years)</span>
            )}
          </div>
        </div>
        {member.branch && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
            {member.branch}
          </span>
        )}
      </div>
    </motion.div>
  );
}
