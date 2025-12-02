"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"

interface Subscription {
  id: number
  plan: string
  price: string
  status: string
  subscribedAt: string
}

interface User {
  id: number
  email: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (!data.loggedIn) {
          router.push("/auth")
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error(err)
        router.push("/auth")
      }
    }
    fetchUser()
  }, [router])

  // Fetch user's subscription
  useEffect(() => {
    if (!user) return
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/subscriptions/user/${user.id}`)
        const data = await res.json()
        if (data.success) setSubscription(data.subscription)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscription()
  }, [user])

  if (loading) return <p className="text-center py-20">Loading...</p>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-black text-white shadow">
        <h1
          className="text-3xl font-bold cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          RCG Fitness
        </h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Dashboard</span>
          <LogoutButton />
        </div>
      </header>

      {/* Main */}
      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground mb-6">Role: {user?.role}</p>

        <div className="p-4 bg-card rounded-lg shadow w-full max-w-md mb-6">
          <h3 className="text-xl font-bold mb-2">Membership Status</h3>
          {subscription ? (
            <p>
              {subscription.status === "active" && (
                <span className="text-green-500 font-semibold">Active</span>
              )}
              {subscription.status === "pending" && (
                <span className="text-yellow-500 font-semibold">Pending</span>
              )}
              {subscription.status === "inactive" && (
                <span className="text-red-500 font-semibold">Not Active</span>
              )}
            </p>
          ) : (
            <p className="text-gray-400">No membership yet</p>
          )}
        </div>
      </main>
    </div>
  )
}
