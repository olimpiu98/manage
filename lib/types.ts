export type Role = "tank" | "dps" | "healer"

export interface Member {
  id: string
  name: string
  role: Role
  partyId: string | null
  pin?: string
  createdAt?: string
}

export interface Party {
  id: string
  name: string
  order: number
  previousOrder?: number
}

export type EventType = "raid" | "pvp" | "social" | "dungeon"

export interface EventParticipant {
  name: string
  joinedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO date string
  location: string
  type: EventType
  participants: (string | EventParticipant)[] // Array of player names or participant objects
  maxParticipants: number
  createdAt: string
}

