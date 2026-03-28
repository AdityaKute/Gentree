import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FamilyMember } from '../types/member';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMembers: FamilyMember[];
  onAdd: (data: Omit<FamilyMember, 'memberId' | 'children' | 'x' | 'y'>, parentId?: string | null) => void;
}

export function AddMemberModal({ isOpen, onClose, existingMembers, onAdd }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    dod: '',
    status: 'Alive' as 'Alive' | 'Dead',
    parentSearch: '',
  });

  const [selectedParent, setSelectedParent] = useState<FamilyMember | null>(null);

  // Filter parents based on middle + last name
  const suggestedParents = existingMembers.filter((member) => {
    const searchTerm = formData.parentSearch.toLowerCase();
    const memberName = `${member.middleName} ${member.lastName}`.toLowerCase();
    return searchTerm && memberName.includes(searchTerm);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.dob) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.status === 'Dead' && formData.dod && formData.dod < formData.dob) {
      toast.error('Date of death cannot be before date of birth');
      return;
    }

    onAdd({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dob: formData.dob,
      dod: formData.dod || undefined,
      status: formData.status,
      photoPath: undefined,
    }, selectedParent?.memberId ?? null);

    toast.success('Member added successfully!');

    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      dod: '',
      status: 'Alive',
      parentSearch: '',
    });
    setSelectedParent(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#FAF3E0] border-[#2D5A27]/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2D5A27]">Add Family Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new member to your family tree
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                placeholder="Robert"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dod">Date of Death</Label>
              <Input
                id="dod"
                type="date"
                value={formData.dod}
                onChange={(e) => setFormData({ ...formData, dod: e.target.value })}
                disabled={formData.status === 'Alive'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Alive' | 'Dead') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-[#ffffff]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#FAF3E0] border-[#2D5A27]/20">
                <SelectItem value="Alive">Alive</SelectItem>
                <SelectItem value="Dead">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo Upload</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full border-[#2D5A27]/20"
                onClick={() => document.getElementById('photo')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentSearch">Parent Selection</Label>
            <Input
              id="parentSearch"
              value={formData.parentSearch}
              onChange={(e) => setFormData({ ...formData, parentSearch: e.target.value })}
              placeholder="Search by middle name + last name"
            />
            {suggestedParents.length > 0 && (
              <div className="mt-2 border border-[#2D5A27]/20 rounded-lg bg-white max-h-40 overflow-y-auto">
                {suggestedParents.map((parent) => (
                  <button
                    key={parent.memberId}
                    type="button"
                    onClick={() => {
                      setSelectedParent(parent);
                      setFormData({
                        ...formData,
                        parentSearch: `${parent.middleName} ${parent.lastName}`,
                      });
                    }}
                    className="w-full p-3 hover:bg-[#2D5A27]/5 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C2A878] text-white flex items-center justify-center text-xs">
                      {parent.firstName[0]}{parent.lastName[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {parent.firstName} {parent.middleName} {parent.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">#{parent.memberId}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedParent && (
              <p className="text-sm text-[#2D5A27]">
                Selected: {selectedParent.firstName} {selectedParent.lastName} (#{selectedParent.memberId})
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2D5A27]/20"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2D5A27] hover:bg-[#4A7C59]">
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
