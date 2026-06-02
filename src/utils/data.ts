import { supabase, Member, Relationship, Memory, Wish, GalleryItem, Activity } from '@/lib/supabase';

// ==================== MEMBER OPERATIONS ====================

export async function getAllMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('birth_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMemberById(id: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getMembersWithRelationships(): Promise<(Member & { relationships: Relationship | null })[]> {
  const { data, error } = await supabase
    .from('members')
    .select(`
      *,
      relationships(*)
    `);

  if (error) throw error;
  return data || [];
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create member');
  return data;
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update member');
  return data;
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== RELATIONSHIP OPERATIONS ====================

export async function getRelationshipByMemberId(memberId: string): Promise<Relationship | null> {
  const { data, error } = await supabase
    .from('relationships')
    .select('*')
    .eq('member_id', memberId)
    .single();

  if (error) return null;
  return data;
}

export async function createRelationship(relationship: Omit<Relationship, 'id' | 'created_at'>): Promise<Relationship> {
  const { data, error } = await supabase
    .from('relationships')
    .insert(relationship)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create relationship');
  return data;
}

export async function updateRelationship(memberId: string, updates: Partial<Relationship>): Promise<Relationship> {
  const { data, error } = await supabase
    .from('relationships')
    .update(updates)
    .eq('member_id', memberId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update relationship');
  return data;
}

// ==================== MEMORY OPERATIONS ====================

export async function getAllMemories(): Promise<(Memory & { members: { member_id: string }[] })[]> {
  const { data, error } = await supabase
    .from('memories')
    .select(`
      *,
      memory_members(member_id)
    `)
    .order('event_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesByMemberId(memberId: string): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select(`
      *,
      memory_members!inner(member_id)
    `)
    .eq('memory_members.member_id', memberId)
    .order('event_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMemory(memory: Omit<Memory, 'id' | 'created_at'>, memberIds: string[]): Promise<Memory> {
  const { data: memoryData, error: memoryError } = await supabase
    .from('memories')
    .insert(memory)
    .select()
    .single();

  if (memoryError) throw memoryError;
  if (!memoryData) throw new Error('Failed to create memory');

  const memoryMembers = memberIds.map(memberId => ({
    memory_id: memoryData.id,
    member_id: memberId
  }));

  const { error: junctionError } = await supabase
    .from('memory_members')
    .insert(memoryMembers);

  if (junctionError) throw junctionError;

  return memoryData;
}

// ==================== WISH OPERATIONS ====================

export async function getWishesByMemberId(memberId: string): Promise<Wish[]> {
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWish(wish: Omit<Wish, 'id' | 'created_at'>): Promise<Wish> {
  const { data, error } = await supabase
    .from('wishes')
    .insert(wish)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create wish');
  return data;
}

// ==================== GALLERY OPERATIONS ====================

export async function getGalleryByMemberId(memberId: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
  const { data, error } = await supabase
    .from('gallery')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create gallery item');
  return data;
}

// ==================== ACTIVITY OPERATIONS ====================

export async function getRecentActivities(limit: number = 10): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function logActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to log activity');
  return data;
}

// ==================== STATISTICS ====================

export async function getStatistics() {
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('*');

  if (membersError) throw membersError;

  const allMembers = members || [];
  const livingMembers = allMembers.filter(m => !m.death_date);
  const deceasedMembers = allMembers.filter(m => m.death_date);

  const generations = new Set(allMembers.map(m => m.generation).filter(Boolean));
  const branches = new Set(allMembers.map(m => m.branch).filter(Boolean));

  const ages = livingMembers.map(m => {
    if (!m.birth_date) return 0;
    return new Date().getFullYear() - new Date(m.birth_date).getFullYear();
  }).filter(a => a > 0);

  const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

  // Find largest branch
  const branchCounts: Record<string, number> = {};
  allMembers.forEach(m => {
    if (m.branch) {
      branchCounts[m.branch] = (branchCounts[m.branch] || 0) + 1;
    }
  });

  const largestBranch = Object.entries(branchCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return {
    totalMembers: allMembers.length,
    livingMembers: livingMembers.length,
    deceasedMembers: deceasedMembers.length,
    totalGenerations: generations.size,
    totalBranches: branches.size,
    averageAge,
    largestBranch,
    oldestMember: allMembers.sort((a, b) => {
      if (!a.birth_date) return 1;
      if (!b.birth_date) return -1;
      return new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime();
    })[0] || null,
    youngestMember: allMembers.sort((a, b) => {
      if (!a.birth_date) return -1;
      if (!b.birth_date) return 1;
      return new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime();
    })[0] || null,
  };
}

// ==================== BIRTHDAY ENGINE ====================

export async function getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .is('death_date', null)
    .not('birth_date', 'is', null);

  if (error) throw error;

  const members = data || [];
  const today = new Date();
  const upcoming: Member[] = [];

  members.forEach(member => {
    if (!member.birth_date) return;
    const birthDate = new Date(member.birth_date);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= days) {
      upcoming.push(member);
    }
  });

  return upcoming.sort((a, b) => {
    const aDate = new Date(a.birth_date!);
    const bDate = new Date(b.birth_date!);
    const aNext = new Date(today.getFullYear(), aDate.getMonth(), aDate.getDate());
    const bNext = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
    if (aNext < today) aNext.setFullYear(today.getFullYear() + 1);
    if (bNext < today) bNext.setFullYear(today.getFullYear() + 1);
    return aNext.getTime() - bNext.getTime();
  });
}

// ==================== GENERATION CALCULATION ====================

export async function calculateGenerations(): Promise<void> {
  const { data: members, error } = await supabase
    .from('members')
    .select(`
      *,
      relationships!relationships_member_id_fkey(father_id, mother_id)
    `);

  if (error) throw error;
  if (!members) return;

  // Find root members (no parents)
  const memberMap = new Map(members.map(m => [m.id, m]));
  const rootMembers = members.filter(m => {
    const rel = (m as any).relationships;
    return !rel || (!rel.father_id && !rel.mother_id);
  });

  // BFS to calculate generations
  const generationMap = new Map<string, number>();

  rootMembers.forEach(root => {
    generationMap.set(root.id, 1);
  });

  let changed = true;
  while (changed) {
    changed = false;
    members.forEach(member => {
      const rel = (member as any).relationships;
      if (!rel) return;

      const parentGen = Math.max(
        generationMap.get(rel.father_id) || 0,
        generationMap.get(rel.mother_id) || 0
      );

      if (parentGen > 0) {
        const currentGen = generationMap.get(member.id) || 0;
        const newGen = parentGen + 1;
        if (newGen > currentGen) {
          generationMap.set(member.id, newGen);
          changed = true;
        }
      }
    });
  }

  // Update members with calculated generations
  for (const [memberId, generation] of generationMap) {
    await supabase
      .from('members')
      .update({ generation })
      .eq('id', memberId);
  }
}
