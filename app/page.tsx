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
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Our <span className="text-primary">Facilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-secondary border-border hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Dumbbell className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Strength Training</h3>
                <p className="text-muted-foreground">
                  State-of-the-art equipment for all your strength training needs
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-border hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Group Classes</h3>
                <p className="text-muted-foreground">
                  Dynamic group sessions led by certified instructors
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-border hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">24/7 Access</h3>
                <p className="text-muted-foreground">
                  Train on your schedule with round-the-clock facility access
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-border hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Personal Training</h3>
                <p className="text-muted-foreground">
                  One-on-one coaching tailored to your fitness goals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 px-4">
        <div className="container mx-auto">
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
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Gym access during peak hours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Locker room access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Free fitness assessment</span>
                  </li>
                </ul>
                <Link href="/payment?plan=Basic&price=29">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-card border-primary border-2 hover:scale-105 transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Premium</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">$59</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>24/7 gym access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>All group classes included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Guest privileges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Nutrition consultation</span>
                  </li>
                </ul>
                <Link href="/payment?plan=Premium&price=59">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-card border-border hover:border-primary transition-all hover:scale-105">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Elite</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Personal training sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Spa & sauna access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Priority booking</span>
                  </li>
                </ul>
                <Link href="/payment?plan=Elite&price=99">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Member <span className="text-primary">Reviews</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-secondary border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  "RCG Fitness has completely transformed my life. The trainers are amazing and the facilities are
                  top-notch!"
                </p>
                <p className="font-semibold text-primary">- Sarah Johnson</p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  "Best gym I've ever been to. The 24/7 access is perfect for my schedule, and the community is
                  incredibly supportive."
                </p>
                <p className="font-semibold text-primary">- Mike Chen</p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  "I've achieved goals I never thought possible. The personal training program is worth every penny!"
                </p>
                <p className="font-semibold text-primary">- Emily Rodriguez</p>
              </CardContent>
            </Card>
          </div>
        </div>
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
