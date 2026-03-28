import { FamilyMember } from '../types/member';

export function flattenTree(nodes: FamilyMember[]): FamilyMember[] {
  const result: FamilyMember[] = [];

  function visit(node: FamilyMember) {
    result.push(node);
    if (node.children?.length) {
      node.children.forEach(visit);
    }
  }

  nodes.forEach(visit);
  return result;
}

export function generateMemberId(
  parent: FamilyMember | null,
  siblings: FamilyMember[]
): string {
  const indexNumbers = siblings
    .map((sibling) => {
      const parts = sibling.memberId.split('.');
      return Number(parts[parts.length - 1]) || 0;
    })
    .filter((n) => !Number.isNaN(n));

  const nextIndex = Math.max(0, ...indexNumbers, 0) + 1;
  if (!parent) {
    return `${nextIndex}`;
  }

  return `${parent.memberId}.${nextIndex}`;
}

export function dfsFindNodeById(
  members: FamilyMember[],
  memberId: string
): FamilyMember | null {
  let found: FamilyMember | null = null;

  function walk(nodes: FamilyMember[]) {
    for (const node of nodes) {
      if (node.memberId === memberId) {
        found = node;
        return;
      }
      if (node.children?.length) {
        walk(node.children);
        if (found) return;
      }
    }
  }

  walk(members);
  return found;
}

export function searchMembersByMiddleLast(
  members: FamilyMember[],
  query: string
): FamilyMember[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return flattenTree(members).filter((member) => {
    const candidate = `${member.middleName ?? ''} ${member.lastName ?? ''}`
      .toLowerCase()
      .trim();
    return candidate.includes(normalized);
  });
}

export function filterSubtree(
  members: FamilyMember[],
  predicate: (member: FamilyMember) => boolean
): FamilyMember[] {
  const result: FamilyMember[] = [];

  function walk(node: FamilyMember): FamilyMember | null {
    const passes = predicate(node);
    const children = node.children
      ?.map((child) => walk(child))
      .filter((child): child is FamilyMember => Boolean(child));

    if (passes || (children && children.length > 0)) {
      return { ...node, children: children?.length ? children : undefined };
    }
    return null;
  }

  for (const member of members) {
    const candidate = walk(member);
    if (candidate) result.push(candidate);
  }

  return result;
}

export function insertMember(
  members: FamilyMember[],
  parentId: string | null,
  memberToInsert: FamilyMember
): FamilyMember[] {
  if (!parentId) {
    return [...members, memberToInsert];
  }

  function walk(nodes: FamilyMember[]): FamilyMember[] {
    return nodes.map((node) => {
      if (node.memberId === parentId) {
        const existingChildren = node.children ? [...node.children, memberToInsert] : [memberToInsert];
        return { ...node, children: existingChildren };
      }
      if (node.children?.length) {
        return { ...node, children: walk(node.children) };
      }
      return node;
    });
  }

  return walk(members);
}

export function updateMember(
  members: FamilyMember[],
  memberId: string,
  changes: Partial<FamilyMember>
): FamilyMember[] {
  function walk(nodes: FamilyMember[]): FamilyMember[] {
    return nodes.map((node) => {
      if (node.memberId === memberId) {
        return { ...node, ...changes };
      }
      if (node.children?.length) {
        return { ...node, children: walk(node.children) };
      }
      return node;
    });
  }

  return walk(members);
}

export function deleteMember(
  members: FamilyMember[],
  memberId: string
): FamilyMember[] {
  function walk(nodes: FamilyMember[]): FamilyMember[] {
    return nodes
      .filter((node) => node.memberId !== memberId)
      .map((node) => {
        if (node.children?.length) {
          return { ...node, children: walk(node.children) };
        }
        return node;
      });
  }

  return walk(members);
}

export function generateConnections(members: FamilyMember[]) {
  const connections: { parent: FamilyMember; child: FamilyMember }[] = [];

  function recurse(node: FamilyMember) {
    node.children?.forEach((child) => {
      connections.push({ parent: node, child });
      recurse(child);
    });
  }

  members.forEach(recurse);
  return connections;
}
