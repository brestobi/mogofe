"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useMembers } from "@/hooks/useData";
import { Clock, Baby, Heart, Star, BookOpen } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  type: 'birth' | 'death' | 'marriage' | 'memory' | 'achievement';
  title: string;
  description: string;
  memberName: string;
}

export default function TimelinePage() {
  const { members, loading } = useMembers();
  const [filter, setFilter] = useState<string>('all');

  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = [];

    members.forEach(member => {
      if (member.birth_date) {
        allEvents.push({
          id: `${member.id}-birth`,
          date: member.birth_date,
          type: 'birth',
          title: `${member.first_name} ${member.last_name} was born`,
          description: `Born to the family`,
          memberName: `${member.first_name} ${member.last_name}`,
        });
      }
      if (member.death_date) {
        allEvents.push({
          id: `${member.id}-death`,
          date: member.death_date,
          type: 'death',
          title: `${member.first_name} ${member.last_name} passed away`,
          description: `Rest in peace`,
          memberName: `${member.first_name} ${member.last_name}`,
        });
      }
    });

    return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [members]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  const eventIcons = {
    birth: Baby,
    death: Heart,
    marriage: Heart,
    memory: BookOpen,
    achievement: Star,
  };

  const eventColors = {
    birth: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    death: 'bg-slate-100 text-slate-600 border-slate-200',
    marriage: 'bg-pink-100 text-pink-600 border-pink-200',
    memory: 'bg-amber-100 text-amber-600 border-amber-200',
    achievement: 'bg-purple-100 text-purple-600 border-purple-200',
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Family Timeline</h1>
          <p className="text-slate-500">Journey through our family history</p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {['all', 'birth', 'death', 'marriage', 'memory', 'achievement'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-translate-x-px" />

          {filteredEvents.map((event, index) => {
            const Icon = eventIcons[event.type];
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex items-center mb-8 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className={`glass rounded-xl p-4 inline-block ${
                    isLeft ? 'md:ml-auto' : ''
                  }`}>
                    <span className="text-sm text-slate-500">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1">{event.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{event.description}</p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${eventColors[event.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
