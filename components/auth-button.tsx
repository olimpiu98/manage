"use client"

import { useState } from "react"
import { LogIn, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-service"
import { AuthDialog } from "@/components/auth-dialog"

interface AuthButtonProps {
  isAuthenticated: boolean
  onAuthSuccess?: () => void
  className?: string
}

export function AuthButton({ isAuthenticated, onAuthSuccess, className = "" }: AuthButtonProps) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess()
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <button
          className={`flex items-center gap-2 px-4 py-2 bg-[#0a0a12]/50 hover:bg-[#0a0a12]/70 rounded ${className}`}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      ) : (
        <button
          className={`flex items-center gap-2 px-4 py-2 bg-[#0a0a12]/50 hover:bg-[#0a0a12]/70 rounded ${className}`}
          onClick={() => setIsAuthDialogOpen(true)}
        >
          <LogIn className="h-4 w-4" />
          <span>Login as Admin</span>
        </button>
      )}

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

