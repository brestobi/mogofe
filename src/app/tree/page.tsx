"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Member } from "@/lib/supabase";
import { useMembers } from "@/hooks/useData";
import { PersonModal } from "@/components/PersonModal";
import { User, Search, Maximize } from "lucide-react";

interface FamilyNodeData {
  member: Member;
  onClick: () => void;
  isHighlighted: boolean;
  isDimmed: boolean;
}

function FamilyNode({ data }: NodeProps<FamilyNodeData>) {
  const { member, onClick, isHighlighted, isDimmed } = data;
  const isDeceased = !!member.death_date;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        opacity: isDimmed ? 0.3 : 1,
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isHighlighted ? 'ring-4 ring-amber-400 shadow-lg shadow-amber-400/30' : ''
      }`}
    >
      <div className={`glass rounded-xl p-3 w-48 text-center border-2 ${
        isDeceased ? 'border-slate-300 opacity-75' : 'border-amber-200'
      }`}>
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-slate-200 mb-2">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>
        <p className="font-semibold text-slate-900 text-sm truncate">
          {member.first_name} {member.last_name}
        </p>
        {member.birth_date && (
          <p className="text-xs text-slate-500">
            {new Date(member.birth_date).getFullYear()}
            {member.death_date && ` - ${new Date(member.death_date).getFullYear()}`}
          </p>
        )}
        {member.generation && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
            Gen {member.generation}
          </span>
        )}
      </div>
    </motion.div>
  );
}

const nodeTypes = {
  familyNode: FamilyNode,
};

export default function FamilyTreePage() {
  const { members, loading } = useMembers();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const { highlightedIds, dimmedIds } = useMemo(() => {
    if (!hoveredMemberId) return { highlightedIds: new Set<string>(), dimmedIds: new Set<string>() };
    const highlighted = new Set<string>([hoveredMemberId]);
    const dimmed = new Set(members.map(m => m.id).filter(id => !highlighted.has(id)));
    return { highlightedIds: highlighted, dimmedIds: dimmed };
  }, [hoveredMemberId, members]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(m => 
      m.first_name.toLowerCase().includes(query) ||
      m.last_name.toLowerCase().includes(query) ||
      m.nickname?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const initialNodes: Node<FamilyNodeData>[] = useMemo(() => {
    return filteredMembers.map((member, index) => ({
      id: member.id,
      type: "familyNode",
      position: {
        x: (index % 4) * 280 + 50,
        y: Math.floor(index / 4) * 200 + 50,
      },
      data: {
        member,
        onClick: () => setSelectedMemberId(member.id),
        isHighlighted: highlightedIds.has(member.id),
        isDimmed: dimmedIds.has(member.id),
      },
    }));
  }, [filteredMembers, highlightedIds, dimmedIds]);

  const initialEdges: Edge[] = useMemo(() => {
    return [];
  }, [filteredMembers]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
    instance.fitView();
  }, []);

  const handleFitView = () => {
    reactFlowInstance?.fitView();
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Family Tree</h1>
            <p className="text-sm text-slate-500">
              {members.length} members across {new Set(members.map(m => m.generation).filter((g): g is number => g !== null && g !== undefined)).size} generations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
              />
            </div>
            <button
              onClick={handleFitView}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Fit to view"
            >
              <Maximize className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          attributionPosition="bottom-right"
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>

      <PersonModal
        memberId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        onMemberClick={(id) => setSelectedMemberId(id)}
      />
    </div>
  );
}
