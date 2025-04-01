"use client"

import type React from "react"

import { useState } from "react"
import { Users } from "lucide-react"
import type { Event } from "@/lib/types"

interface JoinEventModalProps {
  event: Event
  onJoin: (eventId: string, playerName: string) => Promise<void>
  onClose: () => void
}

export function JoinEventModal({ event, onJoin, onClose }: JoinEventModalProps) {
  const [playerName, setPlayerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!playerName.trim()) {
      setError("Please enter your in-game name")
      return
    }

    setIsSubmitting(true)
    try {
      await onJoin(event.id, playerName)
      onClose()
    } catch (error) {
      console.error("Error joining event:", error)
      setError("Failed to join event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Join Event: {event.title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="playerName" className="form-label">
                Your In-Game Name
              </label>
              <input
                type="text"
                id="playerName"
                className="form-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your character name"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm opacity-70">
              <Users className="h-4 w-4" />
              <span>
                {event.participants.length}/{event.maxParticipants} Participants
              </span>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

