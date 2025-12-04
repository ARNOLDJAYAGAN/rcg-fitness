"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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

  // Fetch subscription only when user is loaded
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

  // Loading screen
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

        {/* If subscription exists */}
        {subscription ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
            </CardHeader>

            <CardContent>
              <p><strong>Plan:</strong> {subscription.plan}</p>
              <p><strong>Price:</strong> ₱{subscription.price}/month</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    subscription.status === "active"
                      ? "text-green-500"
                      : subscription.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                >
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)}
                </span>
              </p>

              <p>
                <strong>Subscribed At:</strong>{" "}
                {new Date(subscription.subscribed_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-white">
            You have no subscriptions. Choose a membership to get started.
          </p>
        )}
      </main>
    </div>
  );
}
