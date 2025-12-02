"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LogoutButton } from "@/components/logout-button"

interface Subscription {
  id: number
  plan: string
  price: string
  status: "active" | "pending" | "inactive"
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
        const res = await fetch(`/api/subscriptions/user/${user.id}`, { credentials: "include" })
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

  // Determine subscription status label
  const getStatusLabel = () => {
    if (!subscription) return "Not Active"
    switch (subscription.status) {
      case "active":
        return "Active"
      case "pending":
        return "Pending"
      default:
        return "Not Active"
    }
  }

  const getStatusColor = () => {
    if (!subscription) return "text-gray-400"
    switch (subscription.status) {
      case "active":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground mb-6">Role: {user?.role}</p>

        <div className="p-4 bg-card rounded-lg shadow w-full max-w-md mb-6">
          <h3 className="text-xl font-bold mb-2">Membership Status</h3>
          <p className={getStatusColor()}>{getStatusLabel()}</p>
          {subscription && (
            <p className="text-muted-foreground text-sm mt-2">
              Plan: {subscription.plan} | Price: ${subscription.price}/month | Subscribed:{" "}
              {new Date(subscription.subscribedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div>
          <LogoutButton />
        </div>
      </main>
    </div>
  )
}
