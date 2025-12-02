"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, Clock, Award, Star } from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (data.loggedIn) setUser(data.user)
      } catch {
        setUser(null)
      }
    }
    checkSession()
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogoClick = () => {
    if (user) {
      window.location.href = "/dashboard"
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-8 py-4 border-b border-gray-200 bg-background">
        <h1
          className="text-3xl font-bold text-primary cursor-pointer"
          onClick={handleLogoClick}
        >
          RCG Fitness
        </h1>

        {/* Center nav */}
        <nav className="flex space-x-6 mt-4 md:mt-0 justify-center">
          <button
            onClick={() => scrollToSection("facilities")}
            className="text-primary font-semibold hover:underline"
          >
            Facilities
          </button>
          <button
            onClick={() => scrollToSection("membership")}
            className="text-primary font-semibold hover:underline"
          >
            Membership
          </button>
          <button
            onClick={() => scrollToSection("reviews")}
            className="text-primary font-semibold hover:underline"
          >
            Reviews
          </button>
        </nav>

        {/* Right side button */}
        <div className="mt-4 md:mt-0">
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Start Your Journey Today
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Transform Your Body, <span className="text-primary">Elevate Your Life</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join RCG Fitness and experience world-class training facilities, expert guidance, and a community
          that pushes you to achieve your fitness goals.
        </p>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 px-4 bg-card">
        {/* Your existing facilities content */}
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 px-4">
        {/* Your existing membership content */}
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 bg-card">
        {/* Your existing reviews content */}
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-primary">RCG</span>
            <span className="text-foreground"> FITNESS</span>
          </div>
          <p className="text-muted-foreground mb-4">Transform your body, elevate your life.</p>
          <p className="text-sm text-muted-foreground">© 2025 RCG Fitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
