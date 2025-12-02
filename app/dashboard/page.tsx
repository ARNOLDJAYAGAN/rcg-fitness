"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LogoutButton } from "@/components/logout-button"

interface User {
  id: number
  email: string
  role: string
}

interface Subscription {
  id: number
  plan: string
  status: string
  subscribedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (!data.loggedIn) router.push("/auth")
        else setUser(data.user)
      } catch {
        router.push("/auth")
      }
    }
    fetchUser()
  }, [router])

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
      <Header />
      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground mb-6">Role: {user?.role}</p>

        <div className="p-4 bg-card rounded shadow w-full max-w-md mb-6">
          <h3 className="text-xl font-bold mb-2">Membership Status</h3>
          {subscription ? (
            <p>
              {subscription.status === "active" && <span className="text-green-500 font-semibold">Active</span>}
              {subscription.status === "pending" && <span className="text-yellow-500 font-semibold">Pending</span>}
              {!subscription.status && <span className="text-gray-400">No status</span>}
            </p>
          ) : (
            <p className="text-gray-400">No membership yet</p>
          )}
        </div>

        <LogoutButton />
      </main>
    </div>
  )
}
