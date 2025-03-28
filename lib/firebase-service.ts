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
  writeBatch,
  getDoc,
  where,
} from "firebase/firestore"
import type { Party, Member, Role } from "./types"

// Collection references
const partiesCollection = collection(db, "parties")
const membersCollection = collection(db, "members")

// Get all parties
export async function getParties(): Promise<Party[]> {
  const partiesQuery = query(partiesCollection, orderBy("order", "asc"))
  const snapshot = await getDocs(partiesQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Party)
}

// Get all members
export async function getMembers(): Promise<Member[]> {
  const snapshot = await getDocs(membersCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Member)
}

// Subscribe to parties changes
export function subscribeToParties(callback: (parties: Party[]) => void) {
  const partiesQuery = query(partiesCollection, orderBy("order", "asc"))
  return onSnapshot(partiesQuery, (snapshot) => {
    const parties = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Party)
    callback(parties)
  })
}

// Subscribe to members changes
export function subscribeToMembers(callback: (members: Member[]) => void) {
  return onSnapshot(membersCollection, (snapshot) => {
    const members = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Member)
    callback(members)
  })
}

// Add a new party
export async function addParty(name: string): Promise<string> {
  // Get the highest order value
  const partiesQuery = query(partiesCollection, orderBy("order", "desc"))
  const snapshot = await getDocs(partiesQuery)
  const parties = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Party)

  const highestOrder = parties.length > 0 ? parties[0].order : 0

  const docRef = await addDoc(partiesCollection, {
    name,
    order: highestOrder + 1,
    previousOrder: highestOrder + 1, // Add previousOrder field
  })

  return docRef.id
}

// Update a party
export async function updateParty(id: string, data: Partial<Party>): Promise<void> {
  await updateDoc(doc(partiesCollection, id), data)
}

// Delete a party
export async function deleteParty(id: string): Promise<void> {
  // Get the party to delete
  const partyDoc = await getDoc(doc(partiesCollection, id))
  if (!partyDoc.exists()) return

  const partyData = partyDoc.data() as Party
  const deletedOrder = partyData.order

  // Get all parties
  const partiesQuery = query(partiesCollection, orderBy("order", "asc"))
  const snapshot = await getDocs(partiesQuery)
  const parties = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Party)

  // Create a batch to update orders
  const batch = writeBatch(db)

  // Update orders for all parties with higher order
  parties.forEach((party) => {
    if (party.order > deletedOrder) {
      batch.update(doc(partiesCollection, party.id), {
        order: party.order - 1,
        previousOrder: party.order, // Update previousOrder
      })
    }
  })

  // Delete the party
  batch.delete(doc(partiesCollection, id))

  // Commit the batch
  await batch.commit()
}

// Reorder parties - completely revised implementation for replacing positions
export async function reorderParties(draggedPartyId: string, targetOrder: number): Promise<void> {
  // Get all parties ordered by their current order
  const partiesQuery = query(partiesCollection, orderBy("order", "asc"))
  const snapshot = await getDocs(partiesQuery)
  const parties = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    ref: doc.ref,
  })) as (Party & { ref: any })[]

  // Find the dragged party
  const draggedParty = parties.find((p) => p.id === draggedPartyId)
  if (!draggedParty) return

  const sourceOrder = draggedParty.order

  // If the order is the same, do nothing
  if (sourceOrder === targetOrder) return

  // Create a batch for all updates
  const batch = writeBatch(db)

  // Store the previous order for the dragged party
  batch.update(draggedParty.ref, {
    order: targetOrder,
    previousOrder: sourceOrder,
  })

  // If moving down (higher order number)
  if (sourceOrder < targetOrder) {
    // Shift all parties between source and target down by 1
    parties.forEach((party) => {
      if (party.id !== draggedPartyId && party.order > sourceOrder && party.order <= targetOrder) {
        batch.update(party.ref, {
          order: party.order - 1,
          previousOrder: party.order,
        })
      }
    })
  }
  // If moving up (lower order number)
  else {
    // Shift all parties between target and source up by 1
    parties.forEach((party) => {
      if (party.id !== draggedPartyId && party.order >= targetOrder && party.order < sourceOrder) {
        batch.update(party.ref, {
          order: party.order + 1,
          previousOrder: party.order,
        })
      }
    })
  }

  // Commit all changes
  await batch.commit()
}

// Add a new member with unique name check
export async function addMember(
  name: string,
  role: Role,
): Promise<{ success: boolean; message?: string; id?: string }> {
  // Check if a member with this name already exists
  const membersQuery = query(membersCollection, where("name", "==", name))
  const snapshot = await getDocs(membersQuery)

  if (!snapshot.empty) {
    return {
      success: false,
      message: `A member named "${name}" already exists. Please use a different name.`,
    }
  }

  // If name is unique, add the member
  const docRef = await addDoc(membersCollection, {
    name,
    role,
    partyId: null,
  })

  return {
    success: true,
    id: docRef.id,
  }
}

// Update a member
export async function updateMember(id: string, data: Partial<Member>): Promise<void> {
  await updateDoc(doc(membersCollection, id), data)
}

// Delete a member
export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(membersCollection, id))
}

// Move a member to a party
export async function moveMemberToParty(memberId: string, partyId: string | null): Promise<void> {
  // If moving to unassigned (null), just update the member
  if (partyId === null) {
    await updateDoc(doc(membersCollection, memberId), { partyId })
    return
  }

  // Get the member being moved
  const memberDoc = await getDoc(doc(membersCollection, memberId))
  if (!memberDoc.exists()) return
  const memberData = memberDoc.data() as Member

  // Get all members in the target party to determine order
  const membersQuery = query(membersCollection, where("partyId", "==", partyId))
  const snapshot = await getDocs(membersQuery)
  const partyMembers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Member)

  // Sort members by role priority (tank > healer > dps)
  const getRolePriority = (role: Role): number => {
    switch (role) {
      case "tank":
        return 1
      case "healer":
        return 2
      case "dps":
        return 3
      default:
        return 4
    }
  }

  // Update the member's partyId
  await updateDoc(doc(membersCollection, memberId), { partyId })
}

// Initialize default data if collections are empty
export async function initializeDefaultData(): Promise<void> {
  const partiesSnapshot = await getDocs(partiesCollection)
  const membersSnapshot = await getDocs(membersCollection)

  // If parties collection is empty, add default parties
  if (partiesSnapshot.empty) {
    const defaultParties = Array.from({ length: 8 }, (_, i) => ({
      name: `Party ${i + 1}`,
      order: i + 1,
      previousOrder: i + 1, // Add previousOrder field
    }))

    for (const party of defaultParties) {
      await addDoc(partiesCollection, party)
    }
  } else {
    // Update existing parties to add previousOrder if it doesn't exist
    const parties = partiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    for (const party of parties) {
      if (party.previousOrder === undefined) {
        await updateDoc(doc(partiesCollection, party.id), {
          previousOrder: party.order,
        })
      }
    }
  }

  // If members collection is empty, add a default member
  if (membersSnapshot.empty) {
    await addDoc(membersCollection, {
      name: "Olof",
      role: "dps",
      partyId: null,
    })
  }
}

