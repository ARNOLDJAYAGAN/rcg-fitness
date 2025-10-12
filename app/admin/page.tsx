"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Subscription {
  userId: string
  email: string
  plan: string
  price: string
  phoneNumber: string
  location: string
  subscribedAt: string
  status: string
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)
  const router = useRouter()

  const fetchSubscriptions = async () => {
    try {
      const q = query(collection(db, "subscriptions"), orderBy("subscribedAt", "desc"))
      const querySnapshot = await getDocs(q)
      const subs: Subscription[] = []
      querySnapshot.forEach((doc) => {
        subs.push(doc.data() as Subscription)
      })
      setSubscriptions(subs)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        await fetchSubscriptions()
        setLoading(false)
      } else {
        router.push("/auth")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleApprove = async (userId: string) => {
    setProcessingId(userId)
    try {
      await updateDoc(doc(db, "subscriptions", userId), {
        status: "active",
        updatedAt: new Date().toISOString(),
      })

      // Reload subscriptions
      await fetchSubscriptions()
      alert("Subscription approved successfully!")
    } catch (error) {
      console.error("Error approving subscription:", error)
      alert("Error approving subscription. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

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
          Subscription <span className="text-primary">Management</span>
        </h1>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All User Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No subscriptions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-foreground">Email</TableHead>
                      <TableHead className="text-foreground">Plan</TableHead>
                      <TableHead className="text-foreground">Price</TableHead>
                      <TableHead className="text-foreground">Phone</TableHead>
                      <TableHead className="text-foreground">Location</TableHead>
                      <TableHead className="text-foreground">Subscribed Date</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub, index) => (
                      <TableRow key={index} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-medium">{sub.email}</TableCell>
                        <TableCell>
                          <span className="text-primary font-semibold">{sub.plan}</span>
                        </TableCell>
                        <TableCell>${sub.price}/mo</TableCell>
                        <TableCell>{sub.phoneNumber}</TableCell>
                        <TableCell>{sub.location}</TableCell>
                        <TableCell>{new Date(sub.subscribedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sub.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {sub.status === "pending" && (
                            <Button
                              onClick={() => handleApprove(sub.userId)}
                              disabled={processingId === sub.userId}
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              {processingId === sub.userId ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                          )}
                          {sub.status === "active" && (
                            <span className="text-green-500 text-sm font-medium">Approved</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Admin Page URL:</strong>{" "}
            {typeof window !== "undefined" ? window.location.origin : ""}/admin
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This page displays all user subscriptions stored in Firebase Firestore. Approve pending subscriptions to
            activate user memberships.
          </p>
        </div>
      </main>
    </div>
  )
}
