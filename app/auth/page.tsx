import { AuthForm } from "@/components/auth-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2">
            <span className="text-primary">RCG</span>
            <span className="text-foreground"> FITNESS</span>
          </div>
          <p className="text-muted-foreground">Your fitness journey starts here</p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
