"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      })
      router.push("/auth")
    } catch (err) {
      console.error("Logout failed:", err)
      alert("Failed to logout. Please try again.")
    }
  }

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
      Logout
    </Button>
  )
}
