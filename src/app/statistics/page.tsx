"use client";

import { motion } from "framer-motion";
import { useStatistics, useMembers, useUpcomingBirthdays } from "@/hooks/useData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  Users,
  UserCheck,
  UserX,
  TreePine,
  GitBranch,
  TrendingUp,
  Clock,
  Baby,
  Calendar,
  Cake,
} from "lucide-react";

export default function StatisticsPage() {
  const { stats, loading: statsLoading } = useStatistics();
  const { members, loading: membersLoading } = useMembers();
  const { birthdays, loading: birthdaysLoading } = useUpcomingBirthdays(30);

  const loading = statsLoading || membersLoading || birthdaysLoading;

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const genderStats = {
    male: members.filter(m => m.gender === 'male').length,
    female: members.filter(m => m.gender === 'female').length,
    other: members.filter(m => m.gender === 'other').length,
  };

  const generationStats = members.reduce((acc, m) => {
    if (m.generation) {
      acc[m.generation] = (acc[m.generation] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Family Statistics</h1>
          <p className="text-slate-500">Insights into our family tree</p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Members"
            value={stats?.totalMembers || 0}
            color="text-amber-600"
            bgColor="bg-amber-100"
          />
          <StatCard
            icon={<UserCheck className="w-6 h-6" />}
            label="Living Members"
            value={stats?.livingMembers || 0}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            icon={<UserX className="w-6 h-6" />}
            label="Deceased Members"
            value={stats?.deceasedMembers || 0}
            color="text-slate-600"
            bgColor="bg-slate-100"
          />
          <StatCard
            icon={<TreePine className="w-6 h-6" />}
            label="Generations"
            value={stats?.totalGenerations || 0}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Average Age</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900">
              <AnimatedCounter value={stats?.averageAge || 0} />
            </p>
            <p className="text-sm text-slate-500 mt-1">years old</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Largest Branch</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats?.largestBranch || "N/A"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {members.filter(m => m.branch === stats?.largestBranch).length} members
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Cake className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Upcoming Birthdays</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900">
              <AnimatedCounter value={birthdays.length} />
            </p>
            <p className="text-sm text-slate-500 mt-1">in the next 30 days</p>
          </div>
        </motion.div>

        {/* Gender Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h3 className="font-semibold text-slate-900 mb-6">Gender Distribution</h3>
          <div className="space-y-4">
            {Object.entries(genderStats).map(([gender, count]) => {
              const percentage = stats?.totalMembers ? Math.round((count / stats.totalMembers) * 100) : 0;
              const colors: Record<string, string> = {
                male: 'bg-blue-500',
                female: 'bg-pink-500',
                other: 'bg-purple-500',
              };
              return (
                <div key={gender}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-700">{gender}</span>
                    <span className="text-slate-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${colors[gender]} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Generation Distribution */}
        {Object.keys(generationStats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-6">Generation Distribution</h3>
            <div className="space-y-4">
              {Object.entries(generationStats)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([gen, count]) => {
                  const percentage = stats?.totalMembers ? Math.round((count / stats.totalMembers) * 100) : 0;
                  return (
                    <div key={gen}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">Generation {gen}</span>
                        <span className="text-slate-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className={`w-12 h-12 ${bgColor} ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900">
        <AnimatedCounter value={value} />
      </div>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}
