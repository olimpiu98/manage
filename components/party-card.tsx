"use client"

import { useState, useRef } from "react"
import { useDrop, useDrag } from "react-dnd"
import { Edit, Lock, Shield, Sword, Heart, Trash2, ChevronUp, ChevronDown, Users } from "lucide-react"
import type { Member, Party, Role } from "@/lib/types"
import React from "react"

interface PartyCardProps {
  party: Party
  members: Member[]
  onRemove: (id: string) => void
  onRename: (id: string, newName: string) => void
  onMemberMove: (memberId: string, partyId: string | null) => void
  onPartyMove: (partyId: string, newOrder: number) => void
  isAuthenticated: boolean
  requireAuth: () => void
}

interface MemberInPartyProps {
  member: Member
  onRemove: (id: string, partyId: string | null) => void
  isAuthenticated: boolean
}

const MemberInParty = React.memo(function MemberInParty({ member, onRemove, isAuthenticated }: MemberInPartyProps) {
  // Make members in parties also draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MEMBER",
    item: { id: member.id, role: member.role },
    canDrag: isAuthenticated,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const roleIcons: Record<Role, React.JSX.Element> = {
    tank: <Shield className="h-4 w-4" />,
    dps: <Sword className="h-4 w-4" />,
    healer: <Heart className="h-4 w-4" />,
  }

  const roleColors: Record<Role, string> = {
    tank: "bg-purple-700",
    dps: "bg-red-700",
    healer: "bg-green-700",
  }

  return (
    <div
      ref={drag}
      className={`member-item ${isAuthenticated ? "cursor-move" : "cursor-not-allowed"}
      ${isDragging ? "opacity-50" : "opacity-100"}
    `}
    >
      <div className="member-name">
        <div className={`member-role-icon flex items-center justify-center ${roleColors[member.role]}`}>
          {roleIcons[member.role]}
        </div>
        <span>{member.name}</span>
      </div>
      {isAuthenticated && (
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => onRemove(member.id, null)}
          title="Remove from party"
        >
          ×
        </button>
      )}
      {!isAuthenticated && <Lock className="h-4 w-4 text-gray-500" />}
    </div>
  )
})

export const PartyCard = React.memo(function PartyCard({
  party,
  members,
  onRemove,
  onRename,
  onMemberMove,
  onPartyMove,
  isAuthenticated,
  requireAuth,
}: PartyCardProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newPartyName, setNewPartyName] = useState(party.name)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  // Drop configuration for members
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "MEMBER",
    drop: (item: { id: string }) => {
      if (isAuthenticated) {
        onMemberMove(item.id, party.id)
        return { moved: true }
      }
    },
    canDrop: () => isAuthenticated,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  // Drag configuration for party reordering
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PARTY",
    item: { id: party.id, order: party.order },
    canDrag: isAuthenticated,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // Drop configuration for party reordering
  const [{ isOverParty }, dropParty] = useDrop(() => ({
    accept: "PARTY",
    drop: (item: { id: string; order: number }) => {
      if (isAuthenticated && item.id !== party.id) {
        // When dropping, replace the position with the target party
        onPartyMove(item.id, party.order)
        return { moved: true }
      }
    },
    canDrop: (item: { id: string }) => isAuthenticated && item.id !== party.id,
    collect: (monitor) => ({
      isOverParty: !!monitor.isOver() && monitor.canDrop(),
    }),
  }))

  const handleRenameClick = () => {
    if (!isAuthenticated) {
      requireAuth()
    } else {
      setNewPartyName(party.name)
      setIsRenameDialogOpen(true)
    }
  }

  const handleRenameSubmit = () => {
    if (newPartyName.trim() && newPartyName !== party.name) {
      onRename(party.id, newPartyName)
    }
    setIsRenameDialogOpen(false)
  }

  const handleRemoveParty = () => {
    if (!isAuthenticated) {
      requireAuth()
    } else {
      onRemove(party.id)
    }
  }

  const roleIcons: Record<Role, React.JSX.Element> = {
    tank: <Shield className="h-4 w-4" />,
    dps: <Sword className="h-4 w-4" />,
    healer: <Heart className="h-4 w-4" />,
  }

  // Connect the drag ref to the header only
  React.useEffect(() => {
    if (headerRef.current) {
      drag(headerRef.current)
    }
  }, [drag, headerRef])

  // Count members by role
  const tankCount = members.filter((m) => m.role === "tank").length
  const healerCount = members.filter((m) => m.role === "healer").length
  const dpsCount = members.filter((m) => m.role === "dps").length

  // Sort members by role priority: tank > healer > dps
  const sortedMembers = [...members].sort((a, b) => {
    const getRolePriority = (role: Role): number => {
      switch (role) {
        case "tank":
          return 1
        case "healer":
          return 2
        case "dps":
          return 3
        default:
          return 4
      }
    }
    return getRolePriority(a.role) - getRolePriority(b.role)
  })

  return (
    <div
      ref={dropParty}
      className={`party-card ${isDragging ? "opacity-50" : "opacity-100"}
        ${isOverParty ? "border-yellow-500 bg-yellow-900/20" : ""}
        ${isOver && canDrop ? "border-blue-500 bg-blue-900/20" : ""}
        ${!isAuthenticated && isOver ? "border-red-500" : ""}
      `}
    >
      <div ref={headerRef} className={`party-header ${isAuthenticated ? "cursor-default" : "cursor-default"}`}>
        <div className="party-name">
          <span>{party.name}</span>
        </div>
        <div className="flex items-center">
          {isAuthenticated && (
            <div className="flex mr-2">
              <button
                className="text-blue-100 hover:text-white px-1"
                onClick={() => onPartyMove(party.id, Math.max(1, party.order - 1))}
                title="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                className="text-blue-100 hover:text-white px-1"
                onClick={() => onPartyMove(party.id, party.order + 1)}
                title="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
          <button className="text-blue-100 hover:text-white mr-2" onClick={handleRenameClick} title="Rename party">
            <Edit className="h-4 w-4" />
          </button>
          <button className="text-red-400 hover:text-red-300" onClick={handleRemoveParty} title="Delete party">
            {!isAuthenticated ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Party role summary */}
      <div className="flex justify-between px-3 py-2 bg-[#0a0a12]/50 border-b border-[#e8deb3]/10">
        <div className="flex items-center gap-1" title="Tanks">
          <div className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center">
            <Shield className="h-2 w-2 text-white" />
          </div>
          <span className="text-xs">{tankCount}</span>
        </div>
        <div className="flex items-center gap-1" title="Healers">
          <div className="w-4 h-4 rounded-full bg-green-700 flex items-center justify-center">
            <Heart className="h-2 w-2 text-white" />
          </div>
          <span className="text-xs">{healerCount}</span>
        </div>
        <div className="flex items-center gap-1" title="DPS">
          <div className="w-4 h-4 rounded-full bg-red-700 flex items-center justify-center">
            <Sword className="h-2 w-2 text-white" />
          </div>
          <span className="text-xs">{dpsCount}</span>
        </div>
        <button
          className="text-xs flex items-center gap-1 hover:opacity-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Users className="h-3 w-3 opacity-70" />
          <span>{members.length}</span>
          <span className="opacity-70">{isExpanded ? "▲" : "▼"}</span>
        </button>
      </div>

      {isExpanded && (
        <div ref={drop} className="party-content">
          {members.length > 0 ? (
            <div>
              {sortedMembers.map((member) => (
                <MemberInParty
                  key={member.id}
                  member={member}
                  onRemove={onMemberMove}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm opacity-70">
              {isAuthenticated ? "Drop members here" : "Login to add members"}
            </div>
          )}
        </div>
      )}

      {isRenameDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Rename Party</h3>
              <button className="modal-close" onClick={() => setIsRenameDialogOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Party Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="Enter new party name"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </button>
              <button className="button" onClick={handleRenameSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

