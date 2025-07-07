"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
      return
    }
  }, [isAuthenticated, user, allowedRoles, router])

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
