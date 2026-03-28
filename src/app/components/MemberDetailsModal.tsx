import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FamilyMember } from '../types/member';
import { Pencil, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MemberDetailsModalProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<FamilyMember>) => void;
  onDelete: (id: string) => void;
}

export function MemberDetailsModal({ member, isOpen, onClose, onUpdate, onDelete }: MemberDetailsModalProps) {
  if (!member) {
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editData, setEditData] = useState(member);

  React.useEffect(() => {
    setEditData(member);
    setIsEditing(false);
  }, [member]);

  const fullName = `${member.firstName} ${member.middleName} ${member.lastName}`.trim();
  const isAlive = member.status === 'Alive';
  const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();

  const handleSave = () => {
    if (!editData.firstName || !editData.lastName || !editData.dob) {
      toast.error('First name, last name, and DOB are required');
      return;
    }

    if (editData.status === 'Dead' && editData.dod && editData.dod < editData.dob) {
      toast.error('Date of death cannot be before date of birth');
      return;
    }

    onUpdate(editData);
    toast.success('Member updated successfully!');
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(member.memberId);
    toast.success('Member deleted successfully!');
    setShowDeleteDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-[#FAF3E0] border-[#2D5A27]/20">
          <DialogHeader>
            <DialogTitle className="text-[#2D5A27] flex items-center justify-between">
              <span>{isEditing ? 'Edit Member' : 'Member Details'}</span>
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="hover:bg-[#2D5A27]/10"
                    >
                      <Pencil className="w-4 h-4 text-[#2D5A27]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowDeleteDialog(true)}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
            {!isEditing && (
              <DialogDescription>View family member information</DialogDescription>
            )}
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-middleName">Middle Name</Label>
                  <Input
                    id="edit-middleName"
                    value={editData.middleName}
                    onChange={(e) => setEditData({ ...editData, middleName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editData.dob}
                    onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dod">Date of Death</Label>
                  <Input
                    id="edit-dod"
                    type="date"
                    value={editData.dod || ''}
                    onChange={(e) => setEditData({ ...editData, dod: e.target.value })}
                    disabled={editData.status === 'Alive'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value: 'Alive' | 'Dead') =>
                    setEditData({ ...editData, status: value })
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

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(member);
                  }}
                  className="border-[#2D5A27]/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#2D5A27] hover:bg-[#4A7C59]"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={member.photoPath} alt={fullName} />
                  <AvatarFallback className={isAlive ? 'bg-[#6BA368] text-white text-2xl' : 'bg-[#6C757D] text-white text-2xl'}>
                    {member.photoPath ? <UserIcon className="w-12 h-12" /> : initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{fullName}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant="outline"
                      className={`${
                        isAlive
                          ? 'border-[#6BA368] text-[#6BA368] bg-[#6BA368]/10'
                          : 'border-[#6C757D] text-[#6C757D] bg-[#6C757D]/10'
                      }`}
                    >
                      {member.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                      Member ID: #{member.memberId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4 bg-white/50 rounded-lg p-4 border border-[#2D5A27]/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">First Name</Label>
                    <p className="font-medium mt-1">{member.firstName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Middle Name</Label>
                    <p className="font-medium mt-1">{member.middleName || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Last Name</Label>
                    <p className="font-medium mt-1">{member.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Member ID</Label>
                    <p className="font-medium mt-1 font-mono">#{member.memberId}</p>
                  </div>
                </div>

                <div className="border-t border-[#2D5A27]/10 pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-muted-foreground text-sm">Date of Birth</Label>
                      <p className="font-medium mt-1">{member.dob}</p>
                    </div>
                  </div>
                  {member.dod && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground text-sm">Date of Death</Label>
                        <p className="font-medium mt-1">{member.dod}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Children Info */}
              {member.children && member.children.length > 0 && (
                <div className="bg-white/50 rounded-lg p-4 border border-[#2D5A27]/10">
                  <Label className="text-muted-foreground text-sm mb-3 block">
                    Children ({member.children.length})
                  </Label>
                  <div className="space-y-2">
                    {member.children.map((child) => (
                      <div
                        key={child.memberId}
                        className="flex items-center gap-3 p-2 rounded bg-white/70"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#C2A878] text-white flex items-center justify-center text-xs">
                          {child.firstName[0]}{child.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {child.firstName} {child.middleName} {child.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">#{child.memberId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#FAF3E0] border-[#2D5A27]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete Family Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{fullName}</strong>?
              {member.children && member.children.length > 0 && (
                <span className="block mt-2 text-destructive">
                  ⚠️ Warning: This will also delete all {member.children.length} descendant(s) in the subtree.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2D5A27]/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
