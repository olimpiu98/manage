export type Role = "tank" | "dps" | "healer"

export interface Member {
  id: string
  name: string
  role: Role
  partyId: string | null
}

export interface Party {
  id: string
  name: string
  order: number
  previousOrder?: number // Add previousOrder field
}

