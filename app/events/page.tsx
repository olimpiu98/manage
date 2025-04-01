"use client"

// Add React.memo import
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Shield,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  AlertTriangle,
  UserPlus,
} from "lucide-react"
import {
  subscribeToEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  initializeDefaultEvents,
  addEventParticipants,
} from "@/lib/events-service"
import { subscribeToMembers } from "@/lib/firebase-service"
import { subscribeToAuthChanges } from "@/lib/auth-service"
import { EventForm } from "@/components/event-form"
import type { Event, EventType, Member, EventParticipant } from "@/lib/types"
import { AuthButton } from "@/components/auth-button"
import { AddEventParticipantsModal } from "@/components/add-event-participants-modal"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [filterType, setFilterType] = useState<"all" | EventType>("all")
  const [view, setView] = useState<"list" | "calendar">("list")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddParticipantsOpen, setIsAddParticipantsOpen] = useState(false)

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<{ [key: string]: Event[] }>({})

  useEffect(() => {
    // Initialize default events if needed
    const initialize = async () => {
      await initializeDefaultEvents()
    }

    initialize()

    // Subscribe to auth changes
    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user)
    })

    // Subscribe to events changes
    const unsubscribeEvents = subscribeToEvents((eventsData) => {
      setEvents(eventsData)

      // Group events by date for calendar view
      const eventsByDate: { [key: string]: Event[] } = {}
      eventsData.forEach((event) => {
        const dateKey = new Date(event.date).toISOString().split("T")[0]
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = []
        }
        eventsByDate[dateKey].push(event)
      })
      setCalendarEvents(eventsByDate)

      setIsLoading(false)
    })

    // Subscribe to members changes
    const unsubscribeMembers = subscribeToMembers((membersData) => {
      setMembers(membersData)
    })

    return () => {
      unsubscribeAuth()
      unsubscribeEvents()
      unsubscribeMembers()
    }
  }, [])

  // Handle event creation
  const handleCreateEvent = useCallback(async (eventData: Omit<Event, "id" | "createdAt">) => {
    setIsSubmitting(true)
    try {
      await addEvent(eventData)
      setIsAddEventOpen(false)
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  // Handle event update
  const handleUpdateEvent = useCallback(
    async (eventData: Omit<Event, "id" | "createdAt">) => {
      if (!currentEvent) return

      setIsSubmitting(true)
      try {
        await updateEvent(currentEvent.id, eventData)
        setIsEditEventOpen(false)
        setCurrentEvent(null)
      } catch (error) {
        console.error("Error updating event:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentEvent],
  )

  // Handle event deletion
  const handleDeleteEvent = useCallback(async () => {
    if (!currentEvent) return

    setIsSubmitting(true)
    try {
      await deleteEvent(currentEvent.id)
      setIsDeleteConfirmOpen(false)
      setCurrentEvent(null)
    } catch (error) {
      console.error("Error deleting event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [currentEvent])

  // Update the handleAddParticipants function to correctly handle adding participants
  const handleAddParticipants = useCallback(
    async (eventId: string, participants: EventParticipant[]) => {
      if (!isAuthenticated) {
        console.error("User is not authenticated")
        return
      }

      try {
        setIsSubmitting(true)
        console.log(`Adding ${participants.length} participants to event ${eventId}`)

        await addEventParticipants(eventId, participants)

        // Show success message
        alert(`Successfully added ${participants.length} participants to the event`)
      } catch (error) {
        console.error("Error adding participants:", error)
        // Show error message to user
        alert(`Error adding participants: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsSubmitting(false)
      }
    },
    [isAuthenticated],
  )

  const filteredEvents = useMemo(() => {
    return filterType === "all" ? events : events.filter((event) => event.type === filterType)
  }, [events, filterType])

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date().toISOString()
    return {
      upcomingEvents: filteredEvents.filter((event) => event.date >= now),
      pastEvents: filteredEvents.filter((event) => event.date < now),
    }
  }, [filteredEvents])

  // Helper function to format date
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Helper function to format time
  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Helper function to get event type icon
  function getEventTypeIcon(type: EventType) {
    switch (type) {
      case "raid":
        return <Shield className="h-5 w-5" />
      case "pvp":
        return <Trophy className="h-5 w-5" />
      case "social":
        return <Users className="h-5 w-5" />
      case "dungeon":
        return <Shield className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  // Helper function to get event type color
  function getEventTypeColor(type: EventType) {
    switch (type) {
      case "raid":
        return "bg-purple-700"
      case "pvp":
        return "bg-red-700"
      case "social":
        return "bg-blue-700"
      case "dungeon":
        return "bg-green-700"
      default:
        return "bg-gray-700"
    }
  }

  // Optimize the getParticipantName and getParticipantJoinDate functions with useMemo
  const getParticipantName = useCallback((participant: string | EventParticipant): string => {
    if (typeof participant === "string") {
      return participant
    }
    return participant.name
  }, [])

  const getParticipantJoinDate = useCallback((participant: string | EventParticipant): string | null => {
    if (typeof participant === "string") {
      return null
    }
    return participant.joinedAt
  }, [])

  // Calendar functions
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const prevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const days = daysInMonth(year, month)
    const firstDay = firstDayOfMonth(year, month)

    const monthName = currentDate.toLocaleString("default", { month: "long" })

    // Create calendar grid
    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-[#e8deb3]/10 bg-[#0a0a12]/30"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= days; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = calendarEvents[dateKey] || []
      const isToday = new Date().toISOString().split("T")[0] === dateKey

      calendarDays.push(
        <div
          key={day}
          className={`h-24 border border-[#e8deb3]/10 p-1 overflow-hidden relative ${
            isToday ? "bg-[#e8deb3]/5" : "bg-[#0a0a12]/30"
          }`}
        >
          <div className="text-right mb-1">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                isToday ? "bg-[#e8deb3] text-[#0a0a12]" : "text-[#e8deb3]/70"
              }`}
            >
              {day}
            </span>
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs truncate px-1 py-0.5 rounded ${getEventTypeColor(event.type)} bg-opacity-30`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-center text-[#e8deb3]/50">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>,
      )
    }

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <button className="p-2 rounded hover:bg-[#e8deb3]/10" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-medium">
            {monthName} {year}
          </h3>
          <button className="p-2 rounded hover:bg-[#e8deb3]/10" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-sm font-medium text-[#e8deb3]/70">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">{calendarDays}</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 300px)" }}>
        <div className="text-xl font-bold">Loading Events...</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 anatolion-title">Guild Events</h1>
          <div className="w-24 h-1 bg-[#e8deb3]/30 mx-auto"></div>
          <p className="mt-6 max-w-3xl mx-auto opacity-90 text-lg">
            Join us for regular raids, PvP battles, and social gatherings
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded ${view === "list" ? "bg-[#e8deb3]/20" : "bg-[#0a0a12]/50"}`}
              onClick={() => setView("list")}
            >
              List View
            </button>
            <button
              className={`px-4 py-2 rounded ${view === "calendar" ? "bg-[#e8deb3]/20" : "bg-[#0a0a12]/50"}`}
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
          </div>

          <div className="flex gap-2">
            <AuthButton isAuthenticated={isAuthenticated} />

            {isAuthenticated && (
              <button className="button flex items-center justify-center gap-2" onClick={() => setIsAddEventOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            )}
          </div>
        </div>

        {view === "list" ? (
          <>
            {/* Upcoming Events */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 border-b border-[#e8deb3]/20 pb-2">Upcoming Events</h2>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-10 bg-[#0a0a12]/50 rounded-lg border border-[#e8deb3]/10">
                  <p className="text-lg opacity-70">No upcoming events found</p>
                  {isAuthenticated && (
                    <button className="mt-4 button" onClick={() => setIsAddEventOpen(true)}>
                      Create an Event
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="anatolion-card p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="md:w-16 flex flex-col items-center justify-center">
                          <div
                            className={`w-12 h-12 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center`}
                          >
                            {getEventTypeIcon(event.type)}
                          </div>
                          <span className="text-xs mt-2 capitalize">{event.type}</span>
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                          <p className="opacity-90 mb-4">{event.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 opacity-70" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 opacity-70" />
                              <span>{formatTime(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 opacity-70" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 opacity-70" />
                              <span>
                                {event.participants.length}/{event.maxParticipants} Participants
                              </span>
                            </div>
                          </div>

                          {/* Participants List */}
                          {event.participants.length > 0 && (
                            <div className="mt-4 border-t border-[#e8deb3]/10 pt-4">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <UserPlus className="h-4 w-4" /> Participants
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {event.participants.map((participant, index) => (
                                  <div
                                    key={index}
                                    className="text-sm bg-[#0a0a12]/50 px-2 py-1 rounded"
                                    title={
                                      getParticipantJoinDate(participant)
                                        ? `Joined on ${new Date(getParticipantJoinDate(participant)!).toLocaleString()}`
                                        : undefined
                                    }
                                  >
                                    {getParticipantName(participant)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="md:w-32 flex flex-col gap-2">
                          {isAuthenticated && (
                            <>
                              <button
                                className="button w-full flex items-center justify-center gap-2"
                                onClick={() => {
                                  setCurrentEvent(event)
                                  setIsAddParticipantsOpen(true)
                                }}
                              >
                                <UserPlus className="h-4 w-4" />
                                <span>Add Participants</span>
                              </button>
                              <button
                                className="secondary-button w-full flex items-center justify-center gap-2"
                                onClick={() => {
                                  setCurrentEvent(event)
                                  setIsEditEventOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="secondary-button w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                                onClick={() => {
                                  setCurrentEvent(event)
                                  setIsDeleteConfirmOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Events */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 border-b border-[#e8deb3]/20 pb-2">Past Events</h2>

              {pastEvents.length === 0 ? (
                <div className="text-center py-10 bg-[#0a0a12]/50 rounded-lg border border-[#e8deb3]/10">
                  <p className="text-lg opacity-70">No past events found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      className="anatolion-card p-4 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center`}
                        >
                          {getEventTypeIcon(event.type)}
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 opacity-70" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 opacity-70" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 opacity-70" />
                              <span>{event.participants.length} participants</span>
                            </div>
                          </div>

                          {/* Participants List */}
                          {event.participants.length > 0 && (
                            <div className="mt-2 border-t border-[#e8deb3]/10 pt-2">
                              <h4 className="text-xs font-medium mb-1 flex items-center gap-1">
                                <UserPlus className="h-3 w-3" /> Participants
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {event.participants.map((participant, index) => (
                                  <div key={index} className="text-xs bg-[#0a0a12]/50 px-1.5 py-0.5 rounded">
                                    {getParticipantName(participant)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {isAuthenticated && (
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              setCurrentEvent(event)
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          // Calendar View
          <div className="anatolion-card p-6 rounded-lg">{renderCalendar()}</div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="modal">
          <div className="modal-content max-w-3xl">
            <div className="modal-header">
              <h3 className="modal-title">Create New Event</h3>
              <button className="modal-close" onClick={() => setIsAddEventOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <EventForm
                onSubmit={handleCreateEvent}
                onCancel={() => setIsAddEventOpen(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditEventOpen && currentEvent && (
        <div className="modal">
          <div className="modal-content max-w-3xl">
            <div className="modal-header">
              <h3 className="modal-title">Edit Event</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsEditEventOpen(false)
                  setCurrentEvent(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <EventForm
                event={currentEvent}
                onSubmit={handleUpdateEvent}
                onCancel={() => {
                  setIsEditEventOpen(false)
                  setCurrentEvent(null)
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && currentEvent && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delete Event</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsDeleteConfirmOpen(false)
                  setCurrentEvent(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-700/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Are you sure you want to delete this event?</h4>
                  <p className="text-sm opacity-70">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-[#0a0a12]/50 p-4 rounded-lg mb-4">
                <h5 className="font-medium">{currentEvent.title}</h5>
                <p className="text-sm opacity-70">
                  {formatDate(currentEvent.date)} at {formatTime(currentEvent.date)}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false)
                  setCurrentEvent(null)
                }}
              >
                Cancel
              </button>
              <button
                className="button bg-red-700 hover:bg-red-600"
                onClick={handleDeleteEvent}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participants Modal */}
      {isAddParticipantsOpen && currentEvent && (
        <AddEventParticipantsModal
          event={currentEvent}
          members={members}
          onAddParticipants={handleAddParticipants}
          onClose={() => {
            setIsAddParticipantsOpen(false)
            setCurrentEvent(null)
          }}
        />
      )}
    </div>
  )
}

