"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_BASE } from "@/lib/api"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? "login.php" : "register.php"
      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for PHP sessions
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!data.success) throw new Error(data.message || "Authentication failed")

      alert(isLogin ? "Logged in successfully!" : "Registered successfully!")
      router.push("/dashboard") // redirect after login/register
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full py-6 px-8 bg-card shadow flex justify-start">
        <Link href="/" className="text-2xl font-bold text-primary">
          RCG FITNESS
        </Link>
      </header>

      {/* Auth Form Container */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow mt-10">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
