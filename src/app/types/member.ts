export interface FamilyMember {
  memberId: string; // Hierarchical ID like "1.2.3"
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  dod?: string;
  status: 'Alive' | 'Dead';
  photoPath?: string;
  parentId?: string;
  children?: FamilyMember[];
  x?: number; // Position for rendering
  y?: number; // Position for rendering
}
