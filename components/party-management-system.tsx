"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Sidebar } from "./sidebar"
import { PartyGrid } from "./party-grid"
import { AuthDialog } from "./auth-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { subscribeToAuthChanges } from "@/lib/auth-service"
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
import type { Member, Party, Role } from "@/lib/types"

export default function PartyManagementSystem() {
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
        toast({
          title: "Error",
          description: "Failed to initialize data",
          variant: "destructive",
        })
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
  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action()
      } else {
        setPendingAction(() => action)
        setIsAuthDialogOpen(true)
      }
    },
    [isAuthenticated],
  )

  // Handle authentication success
  const handleAuthSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }, [pendingAction])

  // Party management functions
  const handleAddParty = useCallback(() => {
    requireAuth(async () => {
      try {
        const newPartyName = `Party ${parties.length + 1}`
        await addParty(newPartyName)

        toast({
          title: "Success",
          description: "Party added successfully",
        })
      } catch (error) {
        console.error("Error adding party:", error)
        toast({
          title: "Error",
          description: "Failed to add party",
          variant: "destructive",
        })
      }
    })
  }, [parties.length, requireAuth])

  const handleRemoveParty = useCallback(
    (partyId: string) => {
      requireAuth(async () => {
        try {
          // Move members from this party back to unassigned
          const membersInParty = members.filter((member) => member.partyId === partyId)

          for (const member of membersInParty) {
            await moveMemberToParty(member.id, null)
          }

          // Delete the party
          await deleteParty(partyId)

          toast({
            title: "Success",
            description: "Party removed successfully",
          })
        } catch (error) {
          console.error("Error removing party:", error)
          toast({
            title: "Error",
            description: "Failed to remove party",
            variant: "destructive",
          })
        }
      })
    },
    [members, requireAuth],
  )

  const handleRenameParty = useCallback(
    (partyId: string, newName: string) => {
      requireAuth(async () => {
        try {
          await updateParty(partyId, { name: newName })

          toast({
            title: "Success",
            description: "Party renamed successfully",
          })
        } catch (error) {
          console.error("Error renaming party:", error)
          toast({
            title: "Error",
            description: "Failed to rename party",
            variant: "destructive",
          })
        }
      })
    },
    [requireAuth],
  )

  const handleMoveParty = useCallback(
    (partyId: string, newOrder: number) => {
      requireAuth(async () => {
        try {
          await reorderParties(partyId, newOrder)

          toast({
            title: "Success",
            description: "Parties swapped successfully",
          })
        } catch (error) {
          console.error("Error swapping parties:", error)
          toast({
            title: "Error",
            description: "Failed to swap parties",
            variant: "destructive",
          })
        }
      })
    },
    [requireAuth],
  )

  // Member management functions
  const handleAddMember = useCallback(
    async (name: string, role: Role): Promise<boolean> => {
      return new Promise((resolve) => {
        requireAuth(async () => {
          try {
            const result = await addMember(name, role)

            if (result.success) {
              toast({
                title: "Success",
                description: "Member added successfully",
              })
              resolve(true)
            } else {
              toast({
                title: "Error",
                description: result.message || "Failed to add member",
                variant: "destructive",
              })
              resolve(false)
            }
          } catch (error) {
            console.error("Error adding member:", error)
            toast({
              title: "Error",
              description: "Failed to add member",
              variant: "destructive",
            })
            resolve(false)
          }
        })
      })
    },
    [requireAuth],
  )

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      requireAuth(async () => {
        try {
          await deleteMember(memberId)

          toast({
            title: "Success",
            description: "Member removed successfully",
          })
        } catch (error) {
          console.error("Error removing member:", error)
          toast({
            title: "Error",
            description: "Failed to remove member",
            variant: "destructive",
          })
        }
      })
    },
    [requireAuth],
  )

  const handleMoveMember = useCallback(
    (memberId: string, targetPartyId: string | null) => {
      requireAuth(async () => {
        try {
          await moveMemberToParty(memberId, targetPartyId)

          toast({
            title: "Success",
            description: "Member moved successfully",
          })
        } catch (error) {
          console.error("Error moving member:", error)
          toast({
            title: "Error",
            description: "Failed to move member",
            variant: "destructive",
          })
        }
      })
    },
    [requireAuth],
  )

  const totalAssignedMembers = useMemo(() => members.filter((member) => member.partyId !== null).length, [members])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center anatolion-bg">
        <div className="text-xl text-blue-400 font-bold">Loading Anatolion Party Manager...</div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen anatolion-bg">
        <div className="anatolion-header fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Anatolion Party Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <span className="text-green-400 text-sm">Admin Mode Active</span>
            ) : (
              <button className="text-blue-300 hover:text-blue-100 text-sm" onClick={() => setIsAuthDialogOpen(true)}>
                Login as Admin
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full h-full pt-16">
          <Sidebar
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            isAuthenticated={isAuthenticated}
            requireAuth={() => setIsAuthDialogOpen(true)}
          />
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
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <Toaster />
    </DndProvider>
  )
}

