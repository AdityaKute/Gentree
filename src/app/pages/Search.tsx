import { useMemo, useState } from 'react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search as SearchIcon, User } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const { familyTree, searchMembers } = useTreeStore();

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) {
      return familyTree.length > 0 ? familyTree : [];
    }
    return searchMembers(searchTerm);
  }, [familyTree, searchMembers, searchTerm]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#2D5A27] mb-2">Search Family Members</h1>
        <p className="text-muted-foreground">
          Find family members by middle name or last name
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-[#2D5A27]/20">
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by middle name or last name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {searchTerm ? 'Search Results' : 'All Members'}
          </h3>
          <span className="text-sm text-muted-foreground">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const fullName = `${member.firstName} ${member.middleName} ${member.lastName}`.trim();
            const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();
            const isAlive = member.status === 'Alive';

            // Highlight matched text
            const highlightText = (text: string) => {
              if (!searchTerm) return text;
              const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
              return parts.map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() ? (
                  <mark key={index} className="bg-[#C2A878]/30 px-1 rounded">
                    {part}
                  </mark>
                ) : (
                  part
                )
              );
            };

            return (
              <Card
                key={member.memberId}
                className={`border-[#2D5A27]/20 hover:shadow-md transition-all cursor-pointer ${
                  searchTerm && !isAlive ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarImage src={member.photoPath} alt={fullName} />
                      <AvatarFallback className={isAlive ? 'bg-[#6BA368] text-white' : 'bg-[#6C757D] text-white'}>
                        {member.photoPath ? <User className="w-6 h-6" /> : initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight break-words">
                          {member.firstName}{' '}
                          <span>{highlightText(member.middleName)}</span>{' '}
                          <span>{highlightText(member.lastName)}</span>
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs flex-shrink-0 ${
                            isAlive
                              ? 'border-[#6BA368] text-[#6BA368] bg-[#6BA368]/10'
                              : 'border-[#6C757D] text-[#6C757D] bg-[#6C757D]/10'
                          }`}
                        >
                          {member.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground font-mono mb-2">
                        #{member.memberId}
                      </p>

                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>Born: {member.dob}</p>
                        {member.dod && <p>Died: {member.dod}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="border-[#2D5A27]/20">
            <CardContent className="p-12 text-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search term
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
