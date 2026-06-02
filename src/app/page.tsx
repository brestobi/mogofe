"use client";

import { motion } from "framer-motion";
import { TreePine, Users, Calendar, Baby, Clock, TrendingUp, Heart, Sparkles } from "lucide-react";
import { useMembers, useStatistics, useUpcomingBirthdays, useActivities } from "@/hooks/useData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ActivityCard } from "@/components/ActivityCard";
import { BirthdayCard } from "@/components/BirthdayCard";
import Link from "next/link";

export default function HomePage() {
  const { members, loading: membersLoading } = useMembers();
  const { stats, loading: statsLoading } = useStatistics();
  const { birthdays, loading: birthdaysLoading } = useUpcomingBirthdays(30);
  const { activities, loading: activitiesLoading } = useActivities(5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, "-10%"],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TreePine className="w-20 h-20 text-amber-500 mx-auto mb-6 animate-float" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            The <span className="text-gradient">FamilyRoots</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-8"
          >
            Preserving our family history, one story at a time. Explore our roots, celebrate our connections, and keep our legacy alive for generations to come.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/tree"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25"
            >
              Explore the Tree
            </Link>
            <Link
              href="/members"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm transition-all hover:scale-105 border border-white/20"
            >
              View Members
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                <AnimatedCounter value={stats?.totalMembers || 0} />
              </div>
              <p className="text-slate-500 text-sm mt-1">Total Members</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center">
              <TreePine className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                <AnimatedCounter value={stats?.totalGenerations || 0} />
              </div>
              <p className="text-slate-500 text-sm mt-1">Generations</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                <AnimatedCounter value={stats?.livingMembers || 0} />
              </div>
              <p className="text-slate-500 text-sm mt-1">Living Members</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                <AnimatedCounter value={stats?.averageAge || 0} />
              </div>
              <p className="text-slate-500 text-sm mt-1">Average Age</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Family Highlights</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Meet the pillars of our family tree</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats?.oldestMember && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Oldest Living Member</h3>
                    <p className="text-sm text-slate-500">The family elder</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                    {stats.oldestMember.photo_url ? (
                      <img
                        src={stats.oldestMember.photo_url}
                        alt={stats.oldestMember.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                        {stats.oldestMember.first_name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {stats.oldestMember.first_name} {stats.oldestMember.last_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Born {new Date(stats.oldestMember.birth_date!).getFullYear()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {stats?.youngestMember && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Youngest Member</h3>
                    <p className="text-sm text-slate-500">The newest generation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                    {stats.youngestMember.photo_url ? (
                      <img
                        src={stats.youngestMember.photo_url}
                        alt={stats.youngestMember.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                        {stats.youngestMember.first_name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {stats.youngestMember.first_name} {stats.youngestMember.last_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Born {new Date(stats.youngestMember.birth_date!).getFullYear()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Largest Branch</h3>
                  <p className="text-sm text-slate-500">Most connected family line</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{stats?.largestBranch || "N/A"}</p>
                  <p className="text-sm text-slate-500">
                    {members.filter(m => m.branch === stats?.largestBranch).length} members
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Birthdays */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming Birthdays</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Celebrations on the horizon</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {birthdays.slice(0, 3).map((member, index) => (
              <BirthdayCard key={member.id} member={member} index={index} />
            ))}
            {birthdays.length === 0 && !birthdaysLoading && (
              <div className="col-span-3 text-center text-slate-400 py-12">
                No upcoming birthdays in the next 30 days
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Recent Activity</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">What's happening in the family</p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
            {activities.length === 0 && !activitiesLoading && (
              <div className="text-center text-slate-400 py-12">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
