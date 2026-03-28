import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FamilyMember } from '../types/member';
import * as treeUtils from '../utils/treeUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface TreeStoreState {
  familyTree: FamilyMember[];
  selectedMemberId: string | null;
  highlightedIds: string[];
  loading: boolean;
  setSelectedMemberId: (id: string | null) => void;
  loadMembers: () => Promise<void>;
  addMember: (data: Omit<FamilyMember, 'memberId' | 'children' | 'x' | 'y'>, parentId?: string | null) => Promise<void>;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  searchMembers: (query: string) => FamilyMember[];
  filterSubtreeByQuery: (query: string) => FamilyMember[];
  clearHighlights: () => void;
  setHighlightedIds: (ids: string[]) => void;
}

const TreeContext = createContext<TreeStoreState | undefined>(undefined);

const initialFamilyTree: FamilyMember[] = [];

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>(initialFamilyTree);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIdsState] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/members`);
      if (!response.ok) {
        throw new Error('Failed to load family members');
      }
      const members: FamilyMember[] = await response.json();
      setFamilyTree(treeUtils.buildTree(members));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const addMember = useCallback(
    async (data: Omit<FamilyMember, 'memberId' | 'children' | 'x' | 'y'>, parentId?: string | null) => {
      const response = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, parentId: parentId ?? null }),
      });
      if (!response.ok) {
        throw new Error('Failed to add member');
      }
      await loadMembers();
    },
    [loadMembers]
  );

  const updateMember = useCallback(
    async (memberId: string, updates: Partial<FamilyMember>) => {
      const response = await fetch(`${API_BASE}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update member');
      }
      await loadMembers();
    },
    [loadMembers]
  );

  const deleteMember = useCallback(
    async (memberId: string) => {
      const response = await fetch(`${API_BASE}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      if (selectedMemberId === memberId) {
        setSelectedMemberId(null);
      }
      await loadMembers();
    },
    [loadMembers, selectedMemberId]
  );

  const searchMembers = useCallback(
    (query: string) => {
      if (!query.trim()) return [];
      return treeUtils.searchMembersByMiddleLast(familyTree, query);
    },
    [familyTree]
  );

  const filterSubtreeByQuery = useCallback(
    (query: string) => {
      const lower = query.trim().toLowerCase();
      return treeUtils.filterSubtree(familyTree, (member) => {
        const text = `${member.middleName} ${member.lastName}`.toLowerCase();
        return text.includes(lower);
      });
    },
    [familyTree]
  );

  const clearHighlights = useCallback(() => setHighlightedIdsState([]), []);

  const setHighlightedIds = useCallback((ids: string[]) => setHighlightedIdsState(ids), []);

  const value = useMemo(
    () => ({
      familyTree,
      selectedMemberId,
      highlightedIds,
      loading,
      setSelectedMemberId,
      loadMembers,
      addMember,
      updateMember,
      deleteMember,
      searchMembers,
      filterSubtreeByQuery,
      clearHighlights,
      setHighlightedIds,
    }),
    [familyTree, selectedMemberId, highlightedIds, loading, loadMembers, addMember, updateMember, deleteMember, searchMembers, filterSubtreeByQuery, clearHighlights, setHighlightedIds]
  );

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export function useTreeStore(): TreeStoreState {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTreeStore must be used within a TreeProvider');
  }
  return context;
}
