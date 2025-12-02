"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

interface User {
  id: number;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.loggedIn) {
          router.push("/auth");
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center p-6 bg-black text-white shadow">
        <h1 className="text-3xl font-bold">RCG Fitness</h1>
        <LogoutButton />
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground mb-6">Role: {user?.role}</p>
      </main>
    </div>
  );
}
