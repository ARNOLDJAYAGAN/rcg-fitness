"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { SimpleHeader } from "@/components/simple-header";

interface User {
  id: number;
  email: string;
  name: string;
}

interface Subscription {
  id: number;
  plan: string;
  price: number;
  status: string;
  subscribed_at: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showDetails, setShowDetails] = useState(false); // NEW

  // Fetch user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/auth");
          return;
        }

        const data = await res.json();

        if (!data.loggedIn) {
          router.push("/auth");
          return;
        }

        setUser(data.user);
      } catch {
        router.push("/auth");
      }
    };

    getUser();
  }, [router]);

  // Fetch subscription
  useEffect(() => {
    if (!user) return;

    const getSubscription = async () => {
      try {
        const res = await fetch(`${API_BASE}/subscription/${user.id}`);

        if (!res.ok) {
          setSubscription(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success) {
          setSubscription(data.subscription);
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    getSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>

        {subscription ? (
          <>
            {/* STATUS OUTSIDE THE BOX */}
            <div className="mb-4">
              <p className="text-white text-lg">
                <strong>Status: </strong>
                <span
                  className={
                    subscription.status === "active"
                      ? "text-green-400"
                      : subscription.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)}
                </span>
              </p>
            </div>

            {/* Toggle Button */}
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="mb-4 flex items-center gap-2"
            >
              {showDetails ? "Hide Subscription Details" : "View Subscription Details"}
              {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            {/* COLLAPSIBLE BOX */}
            {showDetails && (
              <Card className="border border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle>Subscription Information</CardTitle>
                </CardHeader>

                <CardContent>
                  <p><strong>Plan:</strong> {subscription.plan}</p>
                  <p><strong>Price:</strong> ₱{subscription.price}/month</p>
                  <p><strong>Subscribed At:</strong> {new Date(subscription.subscribed_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <p className="text-white">You have no subscriptions. Choose a membership to get started.</p>
        )}
      </main>
    </div>
  );
}
