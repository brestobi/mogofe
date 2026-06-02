"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Member } from "@/lib/supabase";
import { useMember, useMemberMemories, useMemberWishes, useMemberGallery } from "@/hooks/useData";
import {
  X,
  User,
  Calendar,
  FileText,
  Users,
  Heart,
  Image as ImageIcon,
  Clock,
} from "lucide-react";

interface PersonModalProps {
  memberId: string | null;
  onClose: () => void;
  onMemberClick: (id: string) => void;
}

const tabs = [
  { id: "details", label: "Details", icon: FileText },
  { id: "family", label: "Family", icon: Users },
  { id: "memories", label: "Memories", icon: Heart },
  { id: "wishes", label: "Wishes", icon: Heart },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function PersonModal({ memberId, onClose, onMemberClick }: PersonModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { member, loading } = useMember(memberId);
  const { memories, loading: memoriesLoading } = useMemberMemories(memberId);
  const { wishes, loading: wishesLoading } = useMemberWishes(memberId);
  const { gallery, loading: galleryLoading } = useMemberGallery(memberId);

  if (!memberId) return null;

  const age = member?.birth_date && !member?.death_date
    ? new Date().getFullYear() - new Date(member.birth_date).getFullYear()
    : member?.death_date && member?.birth_date
      ? new Date(member.death_date).getFullYear() - new Date(member.birth_date).getFullYear()
      : null;

  return (
    <AnimatePresence>
      {memberId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : member ? (
              <>
                <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-700">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white"
                    >
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={`${member.first_name} ${member.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <User className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                    </motion.div>

                    <div className="pb-2">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white"
                      >
                        {member.first_name} {member.middle_name} {member.last_name}
                      </motion.h2>
                      {member.nickname && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-amber-100 text-lg"
                        >
                          "{member.nickname}"
                        </motion.p>
                      )}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 mt-2 text-white/80"
                      >
                        {member.birth_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(member.birth_date).toLocaleDateString()}
                          </span>
                        )}
                        {member.death_date && (
                          <span className="flex items-center gap-1">
                            - {new Date(member.death_date).toLocaleDateString()}
                          </span>
                        )}
                        {age !== null && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {age} years old
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                            activeTab === tab.id
                              ? "text-amber-600"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <DetailItem label="Full Name" value={`${member.first_name} ${member.middle_name || ''} ${member.last_name}`} />
                          <DetailItem label="Nickname" value={member.nickname || "N/A"} />
                          <DetailItem label="Gender" value={member.gender || "N/A"} />
                          <DetailItem label="Occupation" value={member.occupation || "N/A"} />
                          <DetailItem label="Birth Date" value={member.birth_date ? new Date(member.birth_date).toLocaleDateString() : "N/A"} />
                          <DetailItem label="Death Date" value={member.death_date ? new Date(member.death_date).toLocaleDateString() : "N/A"} />
                          <DetailItem label="Generation" value={member.generation ? `Generation ${member.generation}` : "N/A"} />
                          <DetailItem label="Branch" value={member.branch || "N/A"} />
                        </div>
                        {member.biography && (
                          <div className="mt-6">
                            <h4 className="font-semibold text-slate-900 mb-2">Biography</h4>
                            <p className="text-slate-600 leading-relaxed">{member.biography}</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "family" && (
                      <motion.div
                        key="family"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center text-slate-400 py-8"
                      >
                        Family relationships will be displayed here based on database connections
                      </motion.div>
                    )}

                    {activeTab === "memories" && (
                      <motion.div
                        key="memories"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {memoriesLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : memories.length > 0 ? (
                          memories.map((memory) => (
                            <div key={memory.id} className="glass rounded-xl p-4">
                              <h4 className="font-semibold text-slate-900">{memory.title}</h4>
                              {memory.event_date && (
                                <p className="text-sm text-slate-500 mb-2">
                                  {new Date(memory.event_date).toLocaleDateString()}
                                </p>
                              )}
                              {memory.description && (
                                <p className="text-slate-600">{memory.description}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-400 py-8">No memories yet</p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "wishes" && (
                      <motion.div
                        key="wishes"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {wishesLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : wishes.length > 0 ? (
                          wishes.map((wish) => (
                            <div key={wish.id} className="glass rounded-xl p-4 border-l-4 border-pink-400">
                              <h4 className="font-semibold text-slate-900">{wish.title}</h4>
                              {wish.message && (
                                <p className="text-slate-600 mt-1">{wish.message}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-400 py-8">No wishes yet</p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "gallery" && (
                      <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                      >
                        {galleryLoading ? (
                          <div className="col-span-full flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : gallery.length > 0 ? (
                          gallery.map((item) => (
                            <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                              {item.file_type === 'photo' ? (
                                <img
                                  src={item.file_url}
                                  alt={item.caption || 'Gallery image'}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                  <ImageIcon className="w-8 h-8 text-slate-400" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="col-span-full text-center text-slate-400 py-8">No gallery items yet</p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "timeline" && (
                      <TimelineTab member={member} memories={memories} />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function TimelineTab({ member, memories }: { member: Member; memories: any[] }) {
  const events = [
    ...(member.birth_date ? [{ date: member.birth_date, type: 'birth', title: 'Born', description: `${member.first_name} was born` }] : []),
    ...(member.death_date ? [{ date: member.death_date, type: 'death', title: 'Passed Away', description: `${member.first_name} passed away` }] : []),
    ...memories.map(m => ({
      date: m.event_date || m.created_at,
      type: 'memory',
      title: m.title,
      description: m.description,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative"
    >
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
      <div className="space-y-6">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
              event.type === 'birth' ? 'bg-emerald-500 border-emerald-200' :
              event.type === 'death' ? 'bg-slate-500 border-slate-200' :
              'bg-amber-500 border-amber-200'
            }`} />
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
              <h4 className="font-semibold text-slate-900">{event.title}</h4>
              {event.description && (
                <p className="text-slate-600 mt-1">{event.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
