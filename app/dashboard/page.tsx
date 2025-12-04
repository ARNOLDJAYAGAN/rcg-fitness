"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const userRes = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const userData = await userRes.json();

        if (!userData.loggedIn) {
          router.push("/auth");
          return;
        }

        setUser(userData.user);

        const subRes = await fetch(`${API_BASE}/subscriptions/${userData.user.id}`);
        const subData = await subRes.json();

        if (subData.success && subData.subscription) {
          setSubscription(subData.subscription);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {subscription ? (
        <div className="p-6 border border-border rounded-lg">
          <p>
            <strong>Plan:</strong> {subscription.plan}
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
        </div>
      ) : (
        <p>No subscription found</p>
      )}
    </div>
  );
}
