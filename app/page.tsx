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
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-8 py-4 border-b border-gray-200 bg-background shadow">
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
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Our <span className="text-primary">Facilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Dumbbell className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Strength Training</h3>
              <p className="text-muted-foreground">State-of-the-art equipment for all your strength training needs</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Group Classes</h3>
              <p className="text-muted-foreground">Dynamic group sessions led by certified instructors</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Access</h3>
              <p className="text-muted-foreground">Train on your schedule with round-the-clock facility access</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Personal Training</h3>
              <p className="text-muted-foreground">One-on-one coaching tailored to your fitness goals</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Membership <span className="text-primary">Plans</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="bg-card border-border hover:border-primary transition-all hover:scale-105">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" />Gym access during peak hours</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" />Locker room access</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" />Free fitness assessment</li>
              </ul>
              <Link href="/payment?plan=Basic&price=29">
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          {/* Premium & Elite Plans similarly... */}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 bg-card">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Member <span className="text-primary">Reviews</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Example review cards */}
          {[1,2,3].map((i) => (
            <Card key={i} className="bg-secondary border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (<Star key={idx} className="w-5 h-5 fill-primary text-primary" />))}
                </div>
                <p className="text-foreground mb-4">"Amazing experience! Highly recommended."</p>
                <p className="font-semibold text-primary">- Member {i}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-primary">RCG</span> <span className="text-foreground">FITNESS</span>
          </div>
          <p className="text-muted-foreground mb-4">Transform your body, elevate your life.</p>
          <p className="text-sm text-muted-foreground">© 2025 RCG Fitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
