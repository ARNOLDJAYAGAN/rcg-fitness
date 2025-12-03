"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"

interface Subscription {
  id: number
  email: string
  plan: string
  price: number
  status: string
  subscribedAt: string
}

export default function AdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Fetch all pending subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions/pending")
      const data = await res.json()
      if (data.success) setSubscriptions(data.subscriptions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  // Approve subscription
  const approveSubscription = async (id: number) => {
    setProcessingId(id)
    try {
      const res = await fetch("/api/subscriptions/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        setSubscriptions(subs => subs.filter(s => s.id !== id))
        alert("Subscription approved successfully!")
      } else {
        alert(data.message || "Failed to approve subscription")
      }
    } catch (err) {
      console.error(err)
      alert("Error approving subscription")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6">Pending Subscriptions</h1>
      {subscriptions.length === 0 && <p>No pending subscriptions.</p>}

      <div className="grid gap-4">
        {subscriptions.map(sub => (
          <div key={sub.id} className="border rounded-lg p-4 bg-card flex justify-between items-center">
            <div>
              <p className="font-semibold">{sub.email}</p>
              <p>Plan: {sub.plan}</p>
              <p>Price: ${sub.price}</p>
              <p>Status: 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-medium ${
                  sub.status === "active" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                }`}>
                  {sub.status}
                </span>
              </p>
              <p>Subscribed At: {new Date(sub.subscribedAt).toLocaleDateString()}</p>
            </div>

            {sub.status === "pending" && (
              <Button
                size="sm"
                className="bg-primary text-white flex items-center gap-2"
                disabled={processingId === sub.id}
                onClick={() => approveSubscription(sub.id)}
              >
                {processingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Approve
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
