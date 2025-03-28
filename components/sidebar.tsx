"use client"

import { useState } from "react"
import { Shield, Sword, Heart, Lock, UserPlus } from "lucide-react"
import { DraggableMember } from "./draggable-member"
import type { Member, Role } from "@/lib/types"

interface SidebarProps {
  members: Member[]
  onAddMember: (name: string, role: Role) => Promise<boolean>
  onRemoveMember: (id: string) => void
  isAuthenticated: boolean
  requireAuth: () => void
}

export function Sidebar({ members, onAddMember, onRemoveMember, isAuthenticated, requireAuth }: SidebarProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<Role>("tank")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleAddMember = async () => {
    if (newMemberName.trim()) {
      setErrorMessage("")
      setIsAddingMember(true)

      try {
        const success = await onAddMember(newMemberName, newMemberRole)
        if (success) {
          setNewMemberName("")
          setIsAddMemberOpen(false)
        }
      } catch (error) {
        setErrorMessage("Failed to add member. Please try again.")
      } finally {
        setIsAddingMember(false)
      }
    }
  }

  const handleAddMemberClick = () => {
    if (!isAuthenticated) {
      requireAuth()
    } else {
      setNewMemberName("")
      setErrorMessage("")
      setIsAddMemberOpen(true)
    }
  }

  // Filter members by role and unassigned
  const tankMembers = members.filter((m) => m.role === "tank" && m.partyId === null)
  const dpsMembers = members.filter((m) => m.role === "dps" && m.partyId === null)
  const healerMembers = members.filter((m) => m.role === "healer" && m.partyId === null)

  // Count total members by role
  const totalTanks = members.filter((m) => m.role === "tank").length
  const totalDps = members.filter((m) => m.role === "dps").length
  const totalHealers = members.filter((m) => m.role === "healer").length

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Available Members</h2>
      <p className="text-sm opacity-70 mb-4">Drag members to assign them to parties</p>

      {/* Tanks Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">
          <div className="w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span>Tanks</span>
          <span className="text-sm opacity-70 ml-auto">{`${totalTanks - tankMembers.length}/${totalTanks}`}</span>
        </div>
        <div>
          {tankMembers.length > 0 ? (
            tankMembers.map((member) => (
              <DraggableMember
                key={member.id}
                member={member}
                onRemove={onRemoveMember}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : (
            <div className="text-sm opacity-70 text-center py-2">No tanks available</div>
          )}
        </div>
      </div>

      {/* DPS Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">
          <div className="w-5 h-5 rounded-full bg-red-700 flex items-center justify-center">
            <Sword className="h-3 w-3 text-white" />
          </div>
          <span>DPS</span>
          <span className="text-sm opacity-70 ml-auto">{`${totalDps - dpsMembers.length}/${totalDps}`}</span>
        </div>
        <div>
          {dpsMembers.length > 0 ? (
            dpsMembers.map((member) => (
              <DraggableMember
                key={member.id}
                member={member}
                onRemove={onRemoveMember}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : (
            <div className="text-sm opacity-70 text-center py-2">No DPS available</div>
          )}
        </div>
      </div>

      {/* Healers Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">
          <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center">
            <Heart className="h-3 w-3 text-white" />
          </div>
          <span>Healers</span>
          <span className="text-sm opacity-70 ml-auto">{`${totalHealers - healerMembers.length}/${totalHealers}`}</span>
        </div>
        <div>
          {healerMembers.length > 0 ? (
            healerMembers.map((member) => (
              <DraggableMember
                key={member.id}
                member={member}
                onRemove={onRemoveMember}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : (
            <div className="text-sm opacity-70 text-center py-2">No healers available</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button className="button w-full flex items-center justify-center gap-2" onClick={handleAddMemberClick}>
          {!isAuthenticated && <Lock className="h-4 w-4" />}
          {isAuthenticated && <UserPlus className="h-4 w-4" />}
          <span>Add Member</span>
        </button>
      </div>

      {isAddMemberOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Member</h3>
              <button className="modal-close" onClick={() => setIsAddMemberOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="memberName" className="form-label">
                  Member Name
                </label>
                <input
                  type="text"
                  id="memberName"
                  className="form-input"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter member name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select Role</label>
                <div className="role-options">
                  <div
                    className={`role-option ${newMemberRole === "tank" ? "selected" : ""}`}
                    onClick={() => setNewMemberRole("tank")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <span>Tank</span>
                    </div>
                  </div>
                  <div
                    className={`role-option ${newMemberRole === "dps" ? "selected" : ""}`}
                    onClick={() => setNewMemberRole("dps")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center">
                        <Sword className="h-4 w-4 text-white" />
                      </div>
                      <span>DPS</span>
                    </div>
                  </div>
                  <div
                    className={`role-option ${newMemberRole === "healer" ? "selected" : ""}`}
                    onClick={() => setNewMemberRole("healer")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <span>Healer</span>
                    </div>
                  </div>
                </div>
              </div>
              {errorMessage && <p style={{ color: "#f87171", marginBottom: "16px" }}>{errorMessage}</p>}
            </div>
            <div className="modal-footer">
              <button className="button" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </button>
              <button className="button" onClick={handleAddMember} disabled={isAddingMember}>
                {isAddingMember ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

