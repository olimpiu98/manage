import { db } from "./firebase"
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore"
import type { Event, EventType, EventParticipant } from "./types"

// Collection reference
const eventsCollection = collection(db, "events")

// Get all events
export async function getEvents(): Promise<Event[]> {
  const eventsQuery = query(eventsCollection, orderBy("date", "asc"))
  const snapshot = await getDocs(eventsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Event)
}

// Get upcoming events
export async function getUpcomingEvents(): Promise<Event[]> {
  const now = new Date().toISOString()
  const eventsQuery = query(eventsCollection, where("date", ">=", now), orderBy("date", "asc"))
  const snapshot = await getDocs(eventsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Event)
}

// Get past events
export async function getPastEvents(): Promise<Event[]> {
  const now = new Date().toISOString()
  const eventsQuery = query(eventsCollection, where("date", "<", now), orderBy("date", "desc"))
  const snapshot = await getDocs(eventsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Event)
}

// Subscribe to events
export function subscribeToEvents(callback: (events: Event[]) => void) {
  const eventsQuery = query(eventsCollection, orderBy("date", "asc"))
  return onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Event)
    callback(events)
  })
}

// Add a new event
export async function addEvent(eventData: Omit<Event, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(eventsCollection, {
    ...eventData,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

// Update an event
export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
  await updateDoc(doc(eventsCollection, id), data)
}

// Delete an event
export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(eventsCollection, id))
}

// Add multiple participants at once
export async function addEventParticipants(eventId: string, participants: EventParticipant[]): Promise<void> {
  if (participants.length === 0) return

  try {
    const eventRef = doc(eventsCollection, eventId)

    // Get current event data
    const eventDoc = await getDoc(eventRef)
    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const event = eventDoc.data() as Event
    const currentParticipants = event.participants || []

    // Check for duplicates to avoid adding the same participant twice
    const existingNames = currentParticipants.map((p) => (typeof p === "string" ? p : p.name))

    // Filter out any participants that already exist
    const newParticipants = participants.filter((p) => !existingNames.includes(p.name))

    if (newParticipants.length === 0) {
      return // No new participants to add
    }

    // Add new participants
    await updateDoc(eventRef, {
      participants: [...currentParticipants, ...newParticipants],
    })

    console.log(`Successfully added ${newParticipants.length} participants to event ${eventId}`)
  } catch (error) {
    console.error("Error in addEventParticipants:", error)
    throw error
  }
}

// Get events by month
export async function getEventsByMonth(year: number, month: number): Promise<Event[]> {
  // Create start and end dates for the month
  const startDate = new Date(year, month, 1).toISOString()
  const endDate = new Date(year, month + 1, 0).toISOString()

  const eventsQuery = query(
    eventsCollection,
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "asc"),
  )

  const snapshot = await getDocs(eventsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Event)
}

// Initialize default events if collection is empty
export async function initializeDefaultEvents(): Promise<void> {
  const eventsSnapshot = await getDocs(eventsCollection)

  if (eventsSnapshot.empty) {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const defaultEvents = [
      {
        title: "Weekly Raid: Throne of Shadows",
        description:
          "Our weekly raid to conquer the Throne of Shadows. Bring your best gear and be prepared for a challenging encounter.",
        date: tomorrow.toISOString(),
        location: "Shadowkeep Dungeon",
        type: "raid" as EventType,
        participants: [],
        maxParticipants: 30,
        createdAt: now.toISOString(),
      },
      {
        title: "Guild Meeting",
        description: "Monthly guild meeting to discuss upcoming events, strategies, and address member concerns.",
        date: nextWeek.toISOString(),
        location: "Guild Hall",
        type: "social" as EventType,
        participants: [],
        maxParticipants: 100,
        createdAt: now.toISOString(),
      },
    ]

    for (const event of defaultEvents) {
      await addDoc(eventsCollection, event)
    }
  }
}

