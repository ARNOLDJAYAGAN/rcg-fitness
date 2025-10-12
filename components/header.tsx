"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl md:text-3xl font-bold">
              <span className="text-primary">RCG</span>
              <span className="text-foreground"> FITNESS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#facilities" className="text-foreground hover:text-primary transition-colors font-medium">
              Facilities
            </Link>
            <Link href="/#membership" className="text-foreground hover:text-primary transition-colors font-medium">
              Membership
            </Link>
            <Link href="/#reviews" className="text-foreground hover:text-primary transition-colors font-medium">
              Reviews
            </Link>
          </nav>

          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Start Your Journey
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/#facilities"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Facilities
              </Link>
              <Link
                href="/#membership"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                href="/#reviews"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Start Your Journey
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
