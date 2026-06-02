"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useMembers } from "@/hooks/useData";
import { MemberCard } from "@/components/MemberCard";
import { PersonModal } from "@/components/PersonModal";
import { Search, Filter, SortAsc, Users, UserCheck, UserX, GitBranch } from "lucide-react";

type FilterType = 'all' | 'living' | 'deceased';
type SortType = 'name' | 'birthDate' | 'age';

export default function MembersPage() {
  const { members, loading } = useMembers();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');

  const branches = useMemo(() => {
    const branchSet = new Set(members.map(m => m.branch).filter(Boolean));
    return Array.from(branchSet);
  }, [members]);

  const generations = useMemo(() => {
    const genSet = new Set(members.map(m => m.generation).filter(Boolean));
    return Array.from(genSet).sort((a, b) => (a || 0) - (b || 0));
  }, [members]);

  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.first_name.toLowerCase().includes(query) ||
        m.last_name.toLowerCase().includes(query) ||
        m.nickname?.toLowerCase().includes(query)
      );
    }

    // Filter
    if (filter === 'living') {
      result = result.filter(m => !m.death_date);
    } else if (filter === 'deceased') {
      result = result.filter(m => !!m.death_date);
    }

    // Branch filter
    if (selectedBranch !== 'all') {
      result = result.filter(m => m.branch === selectedBranch);
    }

    // Generation filter
    if (selectedGeneration !== 'all') {
      result = result.filter(m => m.generation === parseInt(selectedGeneration));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      }
      if (sortBy === 'birthDate') {
        if (!a.birth_date) return 1;
        if (!b.birth_date) return -1;
        return new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime();
      }
      if (sortBy === 'age') {
        const ageA = a.birth_date ? new Date().getFullYear() - new Date(a.birth_date).getFullYear() : 0;
        const ageB = b.birth_date ? new Date().getFullYear() - new Date(b.birth_date).getFullYear() : 0;
        return ageB - ageA;
      }
      return 0;
    });

    return result;
  }, [members, searchQuery, filter, sortBy, selectedBranch, selectedGeneration]);

  const stats = useMemo(() => ({
    total: members.length,
    living: members.filter(m => !m.death_date).length,
    deceased: members.filter(m => !!m.death_date).length,
  }), [members]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Family Members</h1>
          <p className="text-slate-500">Browse and discover your family</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <UserCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{stats.living}</p>
            <p className="text-sm text-slate-500">Living</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <UserX className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{stats.deceased}</p>
            <p className="text-sm text-slate-500">Deceased</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 mb-8"
        >
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Members</option>
                <option value="living">Living</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>

            {/* Branch Filter */}
            {branches.length > 0 && (
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Generation Filter */}
            {generations.length > 0 && (
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedGeneration}
                  onChange={(e) => setSelectedGeneration(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Generations</option>
                  {generations.map(gen => (
                    <option key={gen} value={gen}>Generation {gen}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="name">Sort by Name</option>
              <option value="birthDate">Sort by Birth Date</option>
              <option value="age">Sort by Age</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-4">
          Showing {filteredMembers.length} of {members.length} members
        </p>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onClick={() => setSelectedMemberId(member.id)}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No members found matching your criteria</p>
          </motion.div>
        )}
      </div>

      <PersonModal
        memberId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        onMemberClick={(id) => setSelectedMemberId(id)}
      />
    </div>
  );
}
