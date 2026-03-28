import { useMemo, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { TreeNode } from '../components/TreeNode';
import { Button } from '../components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Plus, Info, Search as SearchIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { AddMemberModal } from '../components/AddMemberModal';
import { MemberDetailsModal } from '../components/MemberDetailsModal';
import { useTreeStore } from '../store/useTreeStore';
import * as treeUtils from '../utils/treeUtils';

export function TreeCanvas() {
  const { familyTree, addMember, updateMember, deleteMember, searchMembers, setSelectedMemberId, selectedMemberId, highlightedIds, setHighlightedIds, clearHighlights } = useTreeStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const flatMembers = useMemo(() => treeUtils.flattenTree(familyTree), [familyTree]);
  const connections = useMemo(() => treeUtils.generateConnections(familyTree), [familyTree]);

  const selectedMember = useMemo(
    () => (selectedMemberId ? treeUtils.dfsFindNodeById(familyTree, selectedMemberId) : null),
    [familyTree, selectedMemberId]
  );

  const onSearch = (query: string) => {
    setSearchTerm(query);
    const matched = searchMembers(query).map((item) => item.memberId);
    setHighlightedIds(matched);
    if (!query.trim()) {
      clearHighlights();
    }
  };

  return (
    <div className="h-screen relative bg-[#FDF5E6]">
      {/* Top Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-[#FAF3E0] px-4 py-2 rounded-lg shadow-md border border-[#2D5A27]/15 items-center">
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="bg-[#2D5A27] hover:bg-[#4A7C59]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
        <Button
          onClick={() => setShowInfo(true)}
          size="sm"
          variant="outline"
          className="border-[#2D5A27]/20"
        >
          <Info className="w-4 h-4 mr-2" />
          Help
        </Button>

        <div className="relative ml-4">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search middle/last..."
            className="pl-10 pr-3 py-2 rounded-lg border border-[#2D5A27]/20 text-sm"
          />
        </div>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={2}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-20 right-4 z-20 flex flex-col gap-2 bg-[#FAF3E0] p-2 rounded-lg shadow-md border border-[#2D5A27]/15">
              <Button
                onClick={() => zoomIn()}
                size="icon"
                variant="ghost"
                className="hover:bg-[#2D5A27]/10"
              >
                <ZoomIn className="w-4 h-4 text-[#2D5A27]" />
              </Button>
              <Button
                onClick={() => zoomOut()}
                size="icon"
                variant="ghost"
                className="hover:bg-[#2D5A27]/10"
              >
                <ZoomOut className="w-4 h-4 text-[#2D5A27]" />
              </Button>
              <Button
                onClick={() => resetTransform()}
                size="icon"
                variant="ghost"
                className="hover:bg-[#2D5A27]/10"
              >
                <Maximize2 className="w-4 h-4 text-[#2D5A27]" />
              </Button>
            </div>

            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
              <div className="relative w-[1400px] h-[800px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#2D5A27" opacity="0.3" />
                    </marker>
                  </defs>
                  {connections.map(({ parent, child }, idx) => {
                    const startX = (parent.x || 0) + 96;
                    const startY = (parent.y || 0) + 180;
                    const endX = (child.x || 0) + 96;
                    const endY = (child.y || 0);

                    return (
                      <g key={`${parent.memberId}-${child.memberId}-${idx}`}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke="#2D5A27"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.3"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    );
                  })}
                </svg>

                {flatMembers.map((member) => (
                  <div
                    key={member.memberId}
                    className="absolute"
                    style={{
                      left: member.x || 0,
                      top: member.y || 0,
                    }}
                  >
                    <TreeNode
                      member={member}
                      onClick={() => setSelectedMemberId(member.memberId)}
                      isHighlighted={highlightedIds.includes(member.memberId)}
                      isDimmed={searchTerm ? !highlightedIds.includes(member.memberId) : false}
                    />
                  </div>
                ))}

                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="#2D5A27"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      <MemberDetailsModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMemberId(null)}
        onUpdate={(updates) => {
          if (!selectedMember) return;
          updateMember(selectedMember.memberId, updates);
          setSelectedMemberId(null);
        }}
        onDelete={(memberId) => {
          deleteMember(memberId);
          setSelectedMemberId(null);
        }}
      />

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        existingMembers={flatMembers}
        onAdd={(memberData, parentId) => {
          addMember(memberData, parentId);
          setShowAddModal(false);
        }}
      />

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-[#FAF3E0] border-[#2D5A27]/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#2D5A27]">How to Use GenTree</DialogTitle>
            <DialogDescription>
              Learn how to navigate and manage your family tree
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-[#2D5A27]">Navigation Controls</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Drag</strong> to move the canvas around</li>
                <li>• <strong>Scroll</strong> to zoom in and out</li>
                <li>• Use the <strong>zoom buttons</strong> on the right for precise control</li>
                <li>• Click <strong>Reset View</strong> to center the tree</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#2D5A27]">Managing Members</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Click a node</strong> to view member details</li>
                <li>• Use <strong>Add Member</strong> to add new family members</li>
                <li>• <strong>Edit</strong> member information in the details modal</li>
                <li>• <strong>Delete</strong> members (warning: removes entire subtree)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#2D5A27]">Search & Filter</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Use the <strong>Search</strong> bar for middle/last name matching</li>
                <li>• Matched nodes are highlighted in the tree</li>
                <li>• Non-matches are dimmed</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#2D5A27]">Node Colors</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <span className="text-[#6BA368] font-semibold">Green border</span> = Alive</li>
                <li>• <span className="text-[#6C757D] font-semibold">Gray border</span> = Deceased</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}