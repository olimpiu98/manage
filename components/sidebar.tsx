"use client"

import React, { useState } from "react"
import { Shield, Sword, Heart, Lock, UserPlus, Filter } from "lucide-react"
import { DraggableMember } from "./draggable-member"
import type { Member, Role } from "@/lib/types"

interface SidebarProps {
  members: Member[]
  onAddMember: (name: string, role: Role) => Promise<boolean>
  onRemoveMember: (id: string) => void
  isAuthenticated: boolean
  requireAuth: () => void
}

export const Sidebar = React.memo(function Sidebar({
  members,
  onAddMember,
  onRemoveMember,
  isAuthenticated,
  requireAuth,
}: SidebarProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<Role>("tank")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "tank" | "healer" | "dps">("all")

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

  // Filter members by role
  const filterMembers = (members: Member[]) => {
    return members.filter((member) => {
      const matchesRole = filterRole === "all" || member.role === filterRole
      return matchesRole
    })
  }

  // Filter members by role and unassigned
  const tankMembers = filterMembers(members.filter((m) => m.role === "tank" && m.partyId === null))
  const dpsMembers = filterMembers(members.filter((m) => m.role === "dps" && m.partyId === null))
  const healerMembers = filterMembers(members.filter((m) => m.role === "healer" && m.partyId === null))

  // Count total members by role
  const totalTanks = members.filter((m) => m.role === "tank").length
  const totalDps = members.filter((m) => m.role === "dps").length
  const totalHealers = members.filter((m) => m.role === "healer").length

  // Count available members
  const availableMembers = members.filter((m) => m.partyId === null).length

  return (
    <div className="sidebar1">
    <div className="sidebar">
      <h2 className="sidebar-title">Available Members</h2>
      <p className="text-sm opacity-70 mb-4">Drag members to assign them to parties</p>

      <div className="mb-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#e8deb3]/50" />
          <select
            className="form-select pl-10 pr-4 py-2 appearance-none w-full"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
          >
            <option value="all">All Roles</option>
            <option value="tank">Tanks</option>
            <option value="healer">Healers</option>
            <option value="dps">DPS</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Available: {availableMembers}</span>
        <button
          className="text-xs px-3 py-1 bg-[#e8deb3]/10 hover:bg-[#e8deb3]/20 rounded"
          onClick={() => setFilterRole("all")}
        >
          Clear Filter
        </button>
      </div>

      {/* Tanks Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title flex items-center">
          <div className="w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span className="ml-2">Tanks</span>
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
            <div className="text-sm opacity-70 text-center py-2">
              {filterRole !== "all" && filterRole !== "tank" ? "No matching tanks" : "No tanks available"}
            </div>
          )}
        </div>
      </div>

      {/* DPS Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title flex items-center">
          <div className="w-5 h-5 rounded-full bg-red-700 flex items-center justify-center">
            <Sword className="h-3 w-3 text-white" />
          </div>
          <span className="ml-2">DPS</span>
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
            <div className="text-sm opacity-70 text-center py-2">
              {filterRole !== "all" && filterRole !== "dps" ? "No matching DPS" : "No DPS available"}
            </div>
          )}
        </div>
      </div>

      {/* Healers Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title flex items-center">
          <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center">
            <Heart className="h-3 w-3 text-white" />
          </div>
          <span className="ml-2">Healers</span>
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
            <div className="text-sm opacity-70 text-center py-2">
              {filterRole !== "all" && filterRole !== "healer" ? "No matching healers" : "No healers available"}
            </div>
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
    </div></div>
  )
})

