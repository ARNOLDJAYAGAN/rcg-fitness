"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { API_BASE } from "@/lib/api"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const plan = searchParams.get("plan") || "Premium"
  const price = searchParams.get("price") || "59"

  // Fetch logged-in user from your API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" })
        const data = await res.json()
        if (!data.loggedIn) {
          router.push("/auth")
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error(err)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  // Stripe Checkout handler
  const handlePaymentComplete = async () => {
    if (!user) return

    try {
      const res = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plan, price }),
      })

      const data = await res.json()
      if (!data.url) throw new Error(data.error || "Failed to initiate payment")

      // Redirect user to Stripe Checkout
      window.location.href = data.url
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Subscription Successful!</h2>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Complete Your <span className="text-primary">Payment</span>
          </h1>

          {/* Plan Summary */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle>Selected Plan: {plan}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary mb-2">${price}/month</p>
              <p className="text-muted-foreground">
                You're subscribing to the {plan} membership plan.
              </p>
            </CardContent>
          </Card>

          {/* Stripe Payment Button */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Proceed to Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handlePaymentComplete}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6 flex items-center justify-center"
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
