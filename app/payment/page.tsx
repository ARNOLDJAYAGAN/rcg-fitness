"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import Image from "next/image"
import { API_BASE } from "@/lib/api"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState("")

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

  const handlePaymentComplete = async () => {
    if (!user) return

    if (!phoneNumber.trim() || !location.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/subscriptions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          plan,
          price,
          phoneNumber,
          location,
          status: "pending",
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message || "Failed to save subscription")

      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      console.error(err)
      alert(err.message)
      setLoading(false)
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
              <p className="text-muted-foreground">You're subscribing to the {plan} membership plan.</p>
            </CardContent>
          </Card>

          {/* GCash QR Code */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle>Scan GCash QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-8 rounded-lg mb-6">
                <Image src="/gcash-qr-code.jpg" alt="GCash QR Code" width={300} height={300} className="rounded-lg" />
              </div>
              <p className="text-muted-foreground text-center mb-6">
                Scan this QR code with your GCash app to complete the payment of ${price}
              </p>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <Button
                onClick={handlePaymentComplete}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I've Completed the Payment
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
