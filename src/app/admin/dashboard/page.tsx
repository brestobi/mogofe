"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminAuth, useMembers, useStatistics, useUpcomingBirthdays, useActivities } from "@/hooks/useData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  Heart,
  Image,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const router = useRouter();
  const { members, loading: membersLoading } = useMembers();
  const { stats, loading: statsLoading } = useStatistics();
  const { birthdays, loading: birthdaysLoading } = useUpcomingBirthdays(30);
  const { activities, loading: activitiesLoading } = useActivities(10);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const loading = membersLoading || statsLoading || birthdaysLoading || activitiesLoading;

  const newMembersThisMonth = members.filter(m => {
    const created = new Date(m.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const birthdaysThisMonth = birthdays.filter(b => {
    if (!b.birth_date) return false;
    const birthDate = new Date(b.birth_date);
    const now = new Date();
    return birthDate.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your family tree</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <DashboardCard
            icon={<Users className="w-5 h-5" />}
            label="Total Members"
            value={stats?.totalMembers || 0}
            color="bg-amber-100 text-amber-600"
          />
          <DashboardCard
            icon={<UserPlus className="w-5 h-5" />}
            label="New This Month"
            value={newMembersThisMonth}
            color="bg-emerald-100 text-emerald-600"
          />
          <DashboardCard
            icon={<Calendar className="w-5 h-5" />}
            label="Birthdays This Month"
            value={birthdaysThisMonth}
            color="bg-pink-100 text-pink-600"
          />
          <DashboardCard
            icon={<Activity className="w-5 h-5" />}
            label="Recent Activities"
            value={activities.length}
            color="bg-blue-100 text-blue-600"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <ActionCard
            href="/admin/dashboard/members"
            icon={<Plus className="w-6 h-6" />}
            title="Add Member"
            description="Add a new family member"
            color="bg-emerald-500"
          />
          <ActionCard
            href="/admin/dashboard/memories"
            icon={<BookOpen className="w-6 h-6" />}
            title="Add Memory"
            description="Create a new memory"
            color="bg-amber-500"
          />
          <ActionCard
            href="/admin/dashboard/wishes"
            icon={<Heart className="w-6 h-6" />}
            title="Add Wish"
            description="Add a wish or message"
            color="bg-pink-500"
          />
          <ActionCard
            href="/admin/dashboard/gallery"
            icon={<Image className="w-6 h-6" />}
            title="Upload Media"
            description="Add photos or videos"
            color="bg-purple-500"
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const icons: Record<string, React.ReactNode> = {
                member_added: <UserPlus className="w-4 h-4" />,
                member_updated: <Edit3 className="w-4 h-4" />,
                member_deleted: <Trash2 className="w-4 h-4" />,
                memory_added: <BookOpen className="w-4 h-4" />,
                wish_added: <Heart className="w-4 h-4" />,
                gallery_added: <Image className="w-4 h-4" />,
              };

              const colors: Record<string, string> = {
                member_added: 'bg-emerald-100 text-emerald-600',
                member_updated: 'bg-blue-100 text-blue-600',
                member_deleted: 'bg-red-100 text-red-600',
                memory_added: 'bg-amber-100 text-amber-600',
                wish_added: 'bg-pink-100 text-pink-600',
                gallery_added: 'bg-purple-100 text-purple-600',
              };

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors[activity.type] || 'bg-slate-100 text-slate-600'}`}>
                    {icons[activity.type] || <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {activities.length === 0 && (
              <p className="text-center text-slate-400 py-8">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900">
        <AnimatedCounter value={value} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function ActionCard({ href, icon, title, description, color }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </motion.div>
    </Link>
  );
}
