"use client"

import { Plus, Lock, MoveVertical } from "lucide-react"
import { PartyCard } from "./party-card"
import type { Member, Party } from "@/lib/types"

interface PartyGridProps {
  parties: Party[]
  members: Member[]
  totalMembers: number
  onAddParty: () => void
  onRemoveParty: (id: string) => void
  onRenameParty: (id: string, newName: string) => void
  onMemberMove: (memberId: string, partyId: string | null) => void
  onPartyMove: (partyId: string, newOrder: number) => void
  isAuthenticated: boolean
  requireAuth: () => void
}

export function PartyGrid({
  parties,
  members,
  totalMembers,
  onAddParty,
  onRemoveParty,
  onRenameParty,
  onMemberMove,
  onPartyMove,
  isAuthenticated,
  requireAuth,
}: PartyGridProps) {
  const handleAddParty = () => {
    if (!isAuthenticated) {
      requireAuth()
    } else {
      onAddParty()
    }
  }

  // Get members by party
  const getMembersByParty = (partyId: string) => {
    return members.filter((member) => member.partyId === partyId)
  }

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="title">
            {parties.length} Parties ({totalMembers} members)
          </h1>
          {isAuthenticated && (
            <div className="flex items-center gap-2 text-sm opacity-70 mt-1">
              <MoveVertical className="h-4 w-4" />
              <span>Use the up/down arrows to reorder parties</span>
            </div>
          )}
        </div>
      </div>

      <div className="party-grid">
        {parties.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            members={getMembersByParty(party.id)}
            onRemove={onRemoveParty}
            onRename={onRenameParty}
            onMemberMove={onMemberMove}
            onPartyMove={onPartyMove}
            isAuthenticated={isAuthenticated}
            requireAuth={requireAuth}
          />
        ))}

        <div className="party-card flex items-center justify-center" style={{ minHeight: "200px" }}>
          <button
            className="button flex flex-col items-center justify-center h-full w-full gap-2"
            onClick={handleAddParty}
          >
            <Plus className="h-6 w-6" />
            <span>Create Party</span>
            {!isAuthenticated && <Lock className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

