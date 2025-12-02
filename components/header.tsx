"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (data.loggedIn) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      }
    }

    checkSession()
  }, [])

  const handleLogoClick = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-background">
      {/* Left side: Logo / RCG Fitness */}
      <h1
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={handleLogoClick}
      >
        RCG Fitness
      </h1>

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
