"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface User {
  id: number;
  email: string;
}

interface Subscription {
  id: number;
  plan: string;
  price: string;
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
        if (!data.loggedIn) router.push("/auth");
        else setUser(data.user);
      } catch {
        router.push("/auth");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch subscription for logged-in user
  useEffect(() => {
    if (!user) return;
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`${API_BASE}/subscriptions/${user.id}`);
        const data = await res.json();
        if (data.success) setSubscription(data.subscription);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Example Subscription Card */}
        {subscription ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Plan:</strong> {subscription.plan}
              </p>
              <p>
                <strong>Price:</strong> ₱{subscription.price}/month
              </p>
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
          <p>You have no active subscriptions.</p>
        )}

        {/* Other dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Profile</h3>
              <p className="text-muted-foreground">Manage your account information</p>
              <Button
                className="mt-4 w-full bg-primary text-white hover:bg-primary/90"
                onClick={() => router.push("/profile")}
              >
                Go to Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Membership</h3>
              <p className="text-muted-foreground">Choose or upgrade your plan</p>
              <Button
                className="mt-4 w-full bg-primary text-white hover:bg-primary/90"
                onClick={() => router.push("/payment")}
              >
                View Plans
              </Button>
            </CardContent>
          </Card>

          {/* Add more cards here as needed */}
        </div>
      </main>
    </div>
  );
}
