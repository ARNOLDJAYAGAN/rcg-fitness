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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await res.json();

        if (!data.loggedIn) {
          router.push("/auth");
        } else {
          setUser(data.user);
        }
      } catch {
        router.push("/auth");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch user subscription
  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`${API_BASE}/subscriptions/${user.id}`);
        const data = await res.json();

        if (data.success) {
          setSubscription(data.subscription);
        }
      } catch (err) {
        console.error("Dashboard fetch subscription error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>

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
                      ? "text-green-600"
                      : subscription.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </p>
              <p>
                <strong>Subscribed At:</strong>{" "}
                {new Date(subscription.subscribed_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-white">You have no subscriptions. Choose a membership to subscribe.</p>
        )}
      </main>
    </div>
  );
}
