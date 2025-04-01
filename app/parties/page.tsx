"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
  subscribeToParties,
  subscribeToMembers,
  addParty,
  updateParty,
  deleteParty,
  addMember,
  deleteMember,
  moveMemberToParty,
  reorderParties,
  initializeDefaultData,
} from "@/lib/firebase-service"
import { subscribeToAuthChanges } from "@/lib/auth-service"
import type { Member, Party, Role } from "@/lib/types"
import { PartyGrid } from "@/components/party-grid"
import { Sidebar } from "@/components/sidebar"
import { AuthDialog } from "@/components/auth-dialog"
import { AuthButton } from "@/components/auth-button"

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // Initialize data and set up subscriptions
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true)
        await initializeDefaultData()
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()

    // Subscribe to auth changes
    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user)
    })

    // Subscribe to parties changes
    const unsubscribeParties = subscribeToParties((partiesData) => {
      setParties(partiesData)
    })

    // Subscribe to members changes
    const unsubscribeMembers = subscribeToMembers((membersData) => {
      setMembers(membersData)
    })

    return () => {
      unsubscribeAuth()
      unsubscribeParties()
      unsubscribeMembers()
    }
  }, [])

  // Authentication check
  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setPendingAction(() => action)
      setIsAuthDialogOpen(true)
    }
  }

  // Handle authentication success
  const handleAuthSuccess = () => {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  // Party management functions
  const handleAddParty = () => {
    requireAuth(async () => {
      try {
        const newPartyName = `Party ${parties.length + 1}`
        await addParty(newPartyName)
      } catch (error) {
        console.error("Error adding party:", error)
      }
    })
  }

  const handleRemoveParty = (partyId: string) => {
    requireAuth(async () => {
      try {
        // Move members from this party back to unassigned
        const membersInParty = members.filter((member) => member.partyId === partyId)

        for (const member of membersInParty) {
          await moveMemberToParty(member.id, null)
        }

        // Delete the party
        await deleteParty(partyId)
      } catch (error) {
        console.error("Error removing party:", error)
      }
    })
  }

  const handleRenameParty = (partyId: string, newName: string) => {
    requireAuth(async () => {
      try {
        await updateParty(partyId, { name: newName })
      } catch (error) {
        console.error("Error renaming party:", error)
      }
    })
  }

  const handleMoveParty = (partyId: string, newOrder: number) => {
    requireAuth(async () => {
      try {
        await reorderParties(partyId, newOrder)
      } catch (error) {
        console.error("Error moving party:", error)
      }
    })
  }

  // Member management functions
  const handleAddMember = async (name: string, role: Role): Promise<boolean> => {
    return new Promise((resolve) => {
      requireAuth(async () => {
        try {
          const result = await addMember(name, role)
          resolve(result.success)
        } catch (error) {
          console.error("Error adding member:", error)
          resolve(false)
        }
      })
    })
  }

  const handleRemoveMember = (memberId: string) => {
    requireAuth(async () => {
      try {
        await deleteMember(memberId)
      } catch (error) {
        console.error("Error removing member:", error)
      }
    })
  }

  const handleMoveMember = (memberId: string, targetPartyId: string | null) => {
    requireAuth(async () => {
      try {
        await moveMemberToParty(memberId, targetPartyId)
      } catch (error) {
        console.error("Error moving member:", error)
      }
    })
  }

  const totalAssignedMembers = members.filter((member) => member.partyId !== null).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 200px)" }}>
        <div className="text-xl font-bold">Loading Anatolion Party Manager...</div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-between">
        <div>
      <button
          className={`flex items-center gap-2 px-4 py-2 bg-[#0a0a12]/50 hover:bg-[#0a0a12]/70 rounded`}
        >
          {parties.length} Parties ({totalAssignedMembers} members)
        </button></div>
        <div>
        <AuthButton isAuthenticated={isAuthenticated} onAuthSuccess={handleAuthSuccess} /></div>
      </div>

      <div className="flex" style={{ minHeight: "calc(100vh - 300px)" }}>
        {isAuthenticated &&
          <Sidebar
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            isAuthenticated={isAuthenticated}
            requireAuth={() => setIsAuthDialogOpen(true)}
          />
        }
        <PartyGrid
          parties={parties}
          members={members}
          totalMembers={totalAssignedMembers}
          onAddParty={handleAddParty}
          onRemoveParty={handleRemoveParty}
          onRenameParty={handleRenameParty}
          onMemberMove={handleMoveMember}
          onPartyMove={handleMoveParty}
          isAuthenticated={isAuthenticated}
          requireAuth={() => setIsAuthDialogOpen(true)}
        />
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </DndProvider>
  )
}

