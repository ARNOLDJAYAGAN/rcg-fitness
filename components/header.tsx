"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface User {
  id: number
  email: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (data.loggedIn) setUser(data.user)
        else setUser(null)
      } catch {
        setUser(null)
      }
    }
    checkSession()
  }, [])

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-background">
      <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-primary">
        RCG Fitness
      </Link>

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
