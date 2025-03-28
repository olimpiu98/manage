"use client"

import { useDrag } from "react-dnd"
import { Lock, Shield, Sword, Heart } from "lucide-react"
import type { Member, Role } from "@/lib/types"
import type { JSX } from "react"

interface DraggableMemberProps {
  member: Member
  onRemove: (id: string) => void
  isAuthenticated: boolean
}

// Update the DraggableMember component to use icons
export function DraggableMember({ member, onRemove, isAuthenticated }: DraggableMemberProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MEMBER",
    item: { id: member.id, role: member.role },
    canDrag: isAuthenticated,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const roleIcons: Record<Role, JSX.Element> = {
    tank: <Shield className="h-4 w-4" />,
    dps: <Sword className="h-4 w-4" />,
    healer: <Heart className="h-4 w-4" />,
  }

  const roleColors: Record<Role, string> = {
    tank: "bg-purple-700",
    dps: "bg-red-700",
    healer: "bg-green-700",
  }

  return (
    <div
      ref={drag}
      className={`member-item ${isAuthenticated ? "cursor-move" : "cursor-not-allowed"} 
        ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div className="member-name">
        <div className={`member-role-icon flex items-center justify-center ${roleColors[member.role]}`}>
          {roleIcons[member.role]}
        </div>
        <span>{member.name}</span>
      </div>
      <div>
        {isAuthenticated ? (
          <button className="text-gray-400 hover:text-white" onClick={() => onRemove(member.id)}>
            ×
          </button>
        ) : (
          <Lock className="h-4 w-4 text-gray-500" />
        )}
      </div>
    </div>
  )
}

