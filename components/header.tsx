"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/api"

interface HeaderProps {
  redirectTo?: string
}

export function Header({ redirectTo = "/" }: HeaderProps) {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/check_session.php`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (data.loggedIn) {
          setUser(data.user)
        }
      } catch (err) {
        setUser(null)
      }
    }

    checkSession()
  }, [])

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-background">
      {/* Left side: Logo / RCG Fitness */}
      <Link href={redirectTo} className="text-2xl font-bold text-primary">
        RCG Fitness
      </Link>

      {/* Right side: Dashboard or Start Journey */}
      <nav>
        {user ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Start Your Journey
          </Link>
        )}
      </nav>
    </header>
  )
}
