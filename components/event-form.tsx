"use client"

import React, { useState, useCallback } from "react"

import type { Event, EventType } from "@/lib/types"

import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface EventFormProps {
  event?: Event
  onSubmit: (eventData: Omit<Event, "id" | "createdAt">) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export const EventForm = React.memo(function EventForm({ event, onSubmit, onCancel, isSubmitting }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "")
  const [description, setDescription] = useState(event?.description || "")
  const [date, setDate] = useState(event ? new Date(event.date).toISOString().split("T")[0] : "")
  const [time, setTime] = useState(event ? new Date(event.date).toISOString().split("T")[1].substring(0, 5) : "")
  const [location, setLocation] = useState(event?.location || "")
  const [type, setType] = useState<EventType>(event?.type || "raid")
  const [maxParticipants, setMaxParticipants] = useState(event?.maxParticipants?.toString() || "30")
  const [error, setError] = useState("")

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      if (!title || !description || !date || !time || !location || !maxParticipants) {
        setError("Please fill in all required fields")
        return
      }

      try {
        // Combine date and time into ISO string
        const dateTime = new Date(`${date}T${time}:00`)

        await onSubmit({
          title,
          description,
          date: dateTime.toISOString(),
          location,
          type,
          maxParticipants: Number.parseInt(maxParticipants),
          participants: event?.participants || [],
        })
      } catch (error) {
        setError("Failed to save event. Please try again.")
      }
    },
    [title, description, date, time, location, type, maxParticipants, event, onSubmit],
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Event Title*
        </label>
        <input
          type="text"
          id="title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description*
        </label>
        <textarea
          id="description"
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="date" className="form-label flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date*</span>
          </label>
          <input
            type="date"
            id="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Time*</span>
          </label>
          <input
            type="time"
            id="time"
            className="form-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Location*</span>
        </label>
        <input
          type="text"
          id="location"
          className="form-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter event location"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Event Type*
          </label>
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            required
          >
            <option value="raid">Raid</option>
            <option value="pvp">PvP</option>
            <option value="dungeon">Dungeon</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxParticipants" className="form-label flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Max Participants*</span>
          </label>
          <input
            type="number"
            id="maxParticipants"
            className="form-input"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="Enter max participants"
            min="1"
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-4">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : event ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  )
})

