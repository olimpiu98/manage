"use client"

import React, { useState, useMemo } from "react"
import { Shield, Sword, Heart, Check, Loader2 } from "lucide-react"
import type { Member, Event, EventParticipant, Role } from "@/lib/types"

interface AddEventParticipantsModalProps {
  event: Event
  members: Member[]
  onAddParticipants: (eventId: string, participants: EventParticipant[]) => Promise<void>
  onClose: () => void
}

export const AddEventParticipantsModal = React.memo(function AddEventParticipantsModal({
  event,
  members,
  onAddParticipants,
  onClose,
}: AddEventParticipantsModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Get existing participant names
  const existingParticipantNames = useMemo(() => {
    return event.participants.map((participant) => {
      if (typeof participant === "string") {
        return participant
      }
      return participant.name
    })
  }, [event.participants])

  // Filter out members who are already participants
  const availableMembers = useMemo(() => {
    return members.filter((member) => !existingParticipantNames.includes(member.name))
  }, [members, existingParticipantNames])

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId)
      } else {
        return [...prev, memberId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === availableMembers.length) {
      // If all are selected, deselect all
      setSelectedMembers([])
    } else {
      // Otherwise select all
      setSelectedMembers(availableMembers.map((m) => m.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (selectedMembers.length === 0) {
      setError("Please select at least one member")
      return
    }

    setIsSubmitting(true)
    try {
      // Create participant objects for selected members
      const participants: EventParticipant[] = selectedMembers.map((memberId) => {
        const member = members.find((m) => m.id === memberId)
        return {
          name: member?.name || "Unknown",
          joinedAt: new Date().toISOString(),
        }
      })

      await onAddParticipants(event.id, participants)
      setSuccess(`Successfully added ${participants.length} participants`)

      // Close after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error adding participants:", error)
      setError("Failed to add participants. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "tank":
        return <Shield className="h-4 w-4" />
      case "dps":
        return <Sword className="h-4 w-4" />
      case "healer":
        return <Heart className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "tank":
        return "bg-purple-700"
      case "dps":
        return "bg-red-700"
      case "healer":
        return "bg-green-700"
    }
  }

  return (
    <div className="modal">
      <div className="modal-content max-w-2xl">
        <div className="modal-header">
          <h3 className="modal-title">Add Participants to: {event.title}</h3>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-4">
              <p className="text-sm opacity-70">Select members who participated in this event:</p>
            </div>

            {availableMembers.length === 0 ? (
              <div className="text-center py-6 bg-[#0a0a12]/50 rounded-lg">
                <p className="opacity-70">No available members to add</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    {selectedMembers.length} of {availableMembers.length} selected
                  </span>
                  <button type="button" className="text-sm text-[#e8deb3] hover:underline" onClick={handleSelectAll}>
                    {selectedMembers.length === availableMembers.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2">
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`
                        flex items-center justify-between p-2 rounded cursor-pointer
                        ${
                          selectedMembers.includes(member.id)
                            ? "bg-[#e8deb3]/20 border border-[#e8deb3]/40"
                            : "bg-[#0a0a12]/50 border border-[#0a0a12]/50 hover:border-[#e8deb3]/20"
                        }
                      `}
                      onClick={() => handleToggleMember(member.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full ${getRoleColor(member.role)} flex items-center justify-center`}
                        >
                          {getRoleIcon(member.role)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                      {selectedMembers.includes(member.id) && <Check className="h-4 w-4 text-[#e8deb3]" />}
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 p-2 bg-red-900/20 border border-red-900/30 rounded text-red-400">{error}</div>
            )}

            {success && (
              <div className="mt-4 p-2 bg-green-900/20 border border-green-900/30 rounded text-green-400">
                {success}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="button flex items-center gap-2"
              disabled={isSubmitting || selectedMembers.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>Add Selected</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

