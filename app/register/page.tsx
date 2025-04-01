"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Sword, Heart } from "lucide-react"
import { addMember } from "@/lib/firebase-service"
import type { Role } from "@/lib/types"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [role, setRole] = useState<Role | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Store registered names in localStorage to prevent duplicates
  const registeredNames =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("registeredNames") || "[]") : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !pin || !role) {
      setError("Please fill in all fields")
      return
    }

    // Check if name is already registered
    if (registeredNames.includes(name)) {
      setError("This name is already registered")
      return
    }

    // Simple PIN validation - must be 4 digits
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be 4 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addMember(name, role as Role, pin)

      if (result.success) {
        // Store name in localStorage
        localStorage.setItem("registeredNames", JSON.stringify([...registeredNames, name]))
        setSuccess(true)
        setName("")
        setPin("")
        setRole("")
      } else {
        setError(result.message || "Failed to register. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "40px auto" }}>
      <div className="card">
        <h1 className="title">Join Anatolion Guild</h1>

        {success ? (
          <div>
            <p className="text">Thank you for registering! Your character has been added.</p>
            <div className="mt-4">
              <Link href="/parties" className="button">
                View Parties
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Character Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pin" className="form-label">
                PIN (4 digits)
              </label>
              <input
                type="password"
                id="pin"
                className="form-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                pattern="\d{4}"
                required
              />
              <p className="text-sm opacity-70 mt-1">Create a 4-digit PIN to manage your character later</p>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <div className="role-options">
                <div className={`role-option ${role === "tank" ? "selected" : ""}`} onClick={() => setRole("tank")}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span>Tank</span>
                  </div>
                </div>
                <div className={`role-option ${role === "dps" ? "selected" : ""}`} onClick={() => setRole("dps")}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center">
                      <Sword className="h-4 w-4 text-white" />
                    </div>
                    <span>DPS</span>
                  </div>
                </div>
                <div className={`role-option ${role === "healer" ? "selected" : ""}`} onClick={() => setRole("healer")}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span>Healer</span>
                  </div>
                </div>
              </div>
            </div>

            {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Character"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

