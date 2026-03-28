import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FamilyMember } from '../types/member';
import * as treeUtils from '../utils/treeUtils';

interface TreeStoreState {
  familyTree: FamilyMember[];
  selectedMemberId: string | null;
  highlightedIds: string[];
  setSelectedMemberId: (id: string | null) => void;
  addMember: (data: Omit<FamilyMember, 'memberId' | 'children' | 'x' | 'y'>, parentId?: string | null) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (memberId: string) => void;
  searchMembers: (query: string) => FamilyMember[];
  filterSubtreeByQuery: (query: string) => FamilyMember[];
  clearHighlights: () => void;
  setHighlightedIds: (ids: string[]) => void;
}

const TreeContext = createContext<TreeStoreState | undefined>(undefined);

const initialFamilyTree: FamilyMember[] = [
  {
    memberId: '1',
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Smith',
    dob: '1950-03-15',
    dod: '2020-08-22',
    status: 'Dead',
    x: 500,
    y: 50,
    children: [
      {
        memberId: '1.1',
        firstName: 'Michael',
        middleName: 'Robert',
        lastName: 'Smith',
        dob: '1975-06-10',
        status: 'Alive',
        parentId: '1',
        x: 300,
        y: 250,
        children: [
          {
            memberId: '1.1.1',
            firstName: 'Emily',
            middleName: 'Grace',
            lastName: 'Smith',
            dob: '2000-12-05',
            status: 'Alive',
            parentId: '1.1',
            x: 200,
            y: 450,
          },
          {
            memberId: '1.1.2',
            firstName: 'Daniel',
            middleName: 'James',
            lastName: 'Smith',
            dob: '2003-08-18',
            status: 'Alive',
            parentId: '1.1',
            x: 400,
            y: 450,
          },
        ],
      },
      {
        memberId: '1.2',
        firstName: 'Sarah',
        middleName: 'Robert',
        lastName: 'Smith',
        dob: '1978-09-22',
        status: 'Alive',
        parentId: '1',
        x: 700,
        y: 250,
        children: [
          {
            memberId: '1.2.1',
            firstName: 'Olivia',
            middleName: 'Rose',
            lastName: 'Smith',
            dob: '2005-04-14',
            status: 'Alive',
            parentId: '1.2',
            x: 700,
            y: 450,
          },
        ],
      },
    ],
  },
];

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>(initialFamilyTree);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIdsState] = useState<string[]>([]);

  const addMember = useCallback(
    (data: Omit<FamilyMember, 'memberId' | 'children' | 'x' | 'y'>, parentId?: string | null) => {
      const parentNode = parentId ? treeUtils.dfsFindNodeById(familyTree, parentId) : null;

      const candidateSiblings = parentNode?.children ?? familyTree;
      const memberId = treeUtils.generateMemberId(parentNode, candidateSiblings);

      const newMember: FamilyMember = {
        ...data,
        memberId,
        parentId: parentId ?? undefined,
        children: [],
        x: parentNode ? (parentNode.x ?? 600) + 180 : 600,
        y: parentNode ? (parentNode.y ?? 100) + 200 : 100,
      };

      setFamilyTree((prev) => treeUtils.insertMember(prev, parentId ?? null, newMember));
    },
    [familyTree]
  );

  const updateMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    setFamilyTree((prev) => treeUtils.updateMember(prev, memberId, updates));
  }, []);

  const deleteMember = useCallback((memberId: string) => {
    setFamilyTree((prev) => treeUtils.deleteMember(prev, memberId));
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
    }
  }, [selectedMemberId]);

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
      setSelectedMemberId,
      addMember,
      updateMember,
      deleteMember,
      searchMembers,
      filterSubtreeByQuery,
      clearHighlights,
      setHighlightedIds,
    }),
    [familyTree, selectedMemberId, highlightedIds, addMember, updateMember, deleteMember, searchMembers, filterSubtreeByQuery, clearHighlights, setHighlightedIds]
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
