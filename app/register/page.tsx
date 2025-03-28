"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { addMember } from "@/lib/firebase-service"
import type { Role } from "@/lib/types"
import { Shield, Sword, Heart } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Store registered emails in localStorage to prevent duplicates
  const registeredEmails =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("registeredEmails") || "[]") : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !role) {
      setError("Please fill in all fields")
      return
    }

    // Check if email is already registered
    if (registeredEmails.includes(email)) {
      setError("This email is already registered")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addMember(name, role as Role)

      if (result.success) {
        // Store email in localStorage
        localStorage.setItem("registeredEmails", JSON.stringify([...registeredEmails, email]))
        setSuccess(true)
        setName("")
        setEmail("")
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
            <p className="text">Thank you for registering! Your application has been submitted.</p>
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
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

