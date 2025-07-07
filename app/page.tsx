"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case "admin":
        router.push("/admin")
        break
      case "employee":
        router.push("/employee")
        break
      case "participant":
        router.push("/participant")
        break
      default:
        router.push("/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Stock Market Simulation</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
