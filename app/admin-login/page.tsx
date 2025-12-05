"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: redirect if already logged in
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/admin-check", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) {
          router.replace("/admin"); // already logged in
        }
      } catch (err) {
        console.error("Check admin login error:", err);
      }
    };
    checkAdmin();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        credentials: "include", // Required to receive cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin");

    } catch (err) {
      console.error(err);
      alert("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded"
        />

        <Button
          onClick={handleLogin}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
