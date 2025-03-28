"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  isAuthenticated: boolean
}

export function SignOutButton({ isAuthenticated }: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      const result = await signOut()

      if (result.success) {
        toast({
          title: "Success",
          description: "Signed out successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      className="flex items-center gap-2 border-blue-900/50 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </Button>
  )
}

