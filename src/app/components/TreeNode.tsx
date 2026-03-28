import React from 'react';
import { FamilyMember } from '../types/member';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { User } from 'lucide-react';

interface TreeNodeProps {
  member: FamilyMember;
  onClick?: () => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

function TreeNodeComponent({ member, onClick, isHighlighted, isDimmed }: TreeNodeProps) {
  const isAlive = member.status === 'Alive';
  const fullName = `${member.firstName} ${member.middleName} ${member.lastName}`.trim();
  const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer group transition-all duration-200
        ${isDimmed ? 'opacity-30' : 'opacity-100'}
      `}
      style={{
        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div
        className={`
          w-48 rounded-xl p-4 border-2 shadow-md transition-all duration-200
          ${isAlive
            ? 'bg-[#6BA368]/5 border-[#6BA368] hover:shadow-lg'
            : 'bg-gray-100 border-[#6C757D] opacity-90 hover:shadow-lg'
          }
          ${isHighlighted ? 'ring-4 ring-[#C2A878] shadow-xl' : ''}
          hover:-translate-y-1
        `}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-16 h-16 border-2 border-white shadow-md">
            <AvatarImage src={member.photoPath} alt={fullName} />
            <AvatarFallback className={isAlive ? 'bg-[#6BA368] text-white' : 'bg-[#6C757D] text-white'}>
              {member.photoPath ? <User className="w-8 h-8" /> : initials}
            </AvatarFallback>
          </Avatar>

          {/* Member Info */}
          <div className="text-center w-full">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 break-words">
              {fullName}
            </h4>
            <p className="text-xs text-muted-foreground font-mono">
              #{member.memberId}
            </p>
          </div>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={`text-xs ${
              isAlive
                ? 'border-[#6BA368] text-[#6BA368] bg-[#6BA368]/10'
                : 'border-[#6C757D] text-[#6C757D] bg-[#6C757D]/10'
            }`}
          >
            {member.status}
          </Badge>

          {/* DOB/DOD */}
          <div className="text-xs text-muted-foreground text-center space-y-0.5">
            <p>Born: {member.dob}</p>
            {member.dod && <p>Died: {member.dod}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export const TreeNode = React.memo(TreeNodeComponent);
