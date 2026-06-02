"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Member,
  Memory,
  Wish,
  GalleryItem,
  Activity,
} from "@/lib/supabase";
import {
  getAllMembers,
  getMemberById,
  getMemoriesByMemberId,
  getWishesByMemberId,
  getGalleryByMemberId,
  getRecentActivities,
  getStatistics,
  getUpcomingBirthdays,
} from "@/utils/data";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const data = await getAllMembers();
        setMembers(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch members"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  return { members, loading, error };
}

export function useMember(id: string | null) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setMember(null);
      setLoading(false);
      return;
    }

    async function fetchMember(memberId: string) {
      try {
        setLoading(true);
        const data = await getMemberById(memberId);
        setMember(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch member"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMember(id);
  }, [id]);

  return { member, loading, error };
}

export function useMemberMemories(memberId: string | null) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) {
      setMemories([]);
      setLoading(false);
      return;
    }

    async function fetchMemories(id: string) {
      try {
        setLoading(true);
        const data = await getMemoriesByMemberId(id);
        setMemories(data);
      } catch (err) {
        console.error("Failed to fetch memories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMemories(memberId);
  }, [memberId]);

  return { memories, loading };
}

export function useMemberWishes(memberId: string | null) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) {
      setWishes([]);
      setLoading(false);
      return;
    }

    async function fetchWishes(id: string) {
      try {
        setLoading(true);
        const data = await getWishesByMemberId(id);
        setWishes(data);
      } catch (err) {
        console.error("Failed to fetch wishes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishes(memberId);
  }, [memberId]);

  return { wishes, loading };
}

export function useMemberGallery(memberId: string | null) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) {
      setGallery([]);
      setLoading(false);
      return;
    }

    async function fetchGallery(id: string) {
      try {
        setLoading(true);
        const data = await getGalleryByMemberId(id);
        setGallery(data);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery(memberId);
  }, [memberId]);

  return { gallery, loading };
}

export function useActivities(limit: number = 10) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const data = await getRecentActivities(limit);
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [limit]);

  return { activities, loading };
}

export function useStatistics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatistics() {
      try {
        setLoading(true);
        const data = await getStatistics();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, []);

  return { stats, loading };
}

export function useUpcomingBirthdays(days: number = 30) {
  const [birthdays, setBirthdays] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        setLoading(true);
        const data = await getUpcomingBirthdays(days);
        setBirthdays(data);
      } catch (err) {
        console.error("Failed to fetch birthdays:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBirthdays();
  }, [days]);

  return { birthdays, loading };
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("familyroots_admin");
    setIsAuthenticated(auth === "true");
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string): boolean => {
    const correctPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === correctPassword) {
      localStorage.setItem("familyroots_admin", "true");
      setIsAuthenticated(true);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("familyroots_admin");
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
