"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { SimpleHeader } from "@/components/simple-header";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const plan = searchParams.get("plan") || "Premium";
  const price = searchParams.get("price") || "1499";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn) router.push("/auth");
        else setUser(data.user);
      } catch {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleDone = async () => {
    if (!user) return;
    if (!phone.trim() || !name.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/subscriptions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          plan,
          price,
          phone,
          name,
          status: "pending",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Subscription API error:", text);
        alert("Failed to create subscription");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loader2 className="animate-spin w-8 h-8 mx-auto my-20" />;

  if (success)
    return (
      <div className="text-center py-20">
        <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold mt-4">Subscription Pending!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container mx-auto px-4 py-24 max-w-lg">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected Plan: {plan}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary mb-4">₱{price}/month</p>
            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleDone} className="w-full bg-primary text-white py-3">
              Done
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
