"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [membership, setMembership] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        const membershipRef = doc(db, "subscriptions", user.uid)
        const unsubscribeMembership = onSnapshot(membershipRef, (doc) => {
          if (doc.exists()) {
            setMembership(doc.data())
          } else {
            setMembership(null)
          }
          setLoading(false)
        })

        return () => unsubscribeMembership()
      } else {
        router.push("/auth")
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to Your <span className="text-primary">Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Email:</p>
              <p className="text-foreground font-medium break-all">{user?.email}</p>
              <p className="text-muted-foreground mb-2 mt-4">User ID:</p>
              <p className="text-foreground font-medium text-sm break-all">{user?.uid}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Membership Status</CardTitle>
            </CardHeader>
            <CardContent>
              {membership ? (
                <>
                  <p className="text-primary font-bold text-2xl">{membership.plan}</p>
                  <p className="text-muted-foreground text-sm mt-2">${membership.price}/month</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Subscribed: {new Date(membership.subscribedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        membership.status === "active"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {membership.status === "active" ? "Active" : "Pending Approval"}
                    </span>
                  </div>
                  {membership.status === "pending" && (
                    <p className="text-muted-foreground text-xs mt-2">
                      Your subscription is pending admin approval. You'll be notified once it's activated.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-muted-foreground font-bold text-2xl">No Active Plan</p>
                  <Link href="/#membership">
                    <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                      Choose a Plan
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Next Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">HIIT Training</p>
              <p className="text-muted-foreground text-sm mt-2">Tomorrow at 6:00 PM</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Welcome to RCG Fitness! Here's what you can do next:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Book your first class</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Schedule a fitness assessment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Meet with a personal trainer</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Explore our facilities</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
