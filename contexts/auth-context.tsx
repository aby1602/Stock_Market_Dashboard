"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, ActivityLog } from "@/types"
import { SimulatedDatabase } from "@/lib/database"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => Promise<boolean>
  logout: () => void
  updatePassword: (newPassword: string) => Promise<boolean>
  isAuthenticated: boolean
  activityLogs: ActivityLog[]
  addActivityLog: (action: string, details: string, category: ActivityLog["category"]) => void
  initializeDatabase: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const db = SimulatedDatabase.getInstance()

  const initializeDatabase = () => {
    console.log("Initializing database...")
    const users = db.forceInitializeUsers()
    console.log("Database initialized with users:", users)
  }

  useEffect(() => {
    // Load user from storage on mount
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        console.log("Loaded user from storage:", userData)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("current_user")
      }
    }

    // Initialize mock users if database is empty
    let existingUsers = db.getUsers()
    console.log("Existing users in database:", existingUsers)

    if (existingUsers.length === 0) {
      console.log("No users found, initializing...")
      existingUsers = db.forceInitializeUsers()
    }

    // Load activity logs
    const logs = db.getActivityLogs()
    setActivityLogs(logs)
  }, [])

  const addActivityLog = (action: string, details: string, category: ActivityLog["category"]) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.id || "system",
      action,
      details,
      timestamp: new Date(),
      category,
    }

    const updatedLogs = [newLog, ...activityLogs].slice(0, 1000) // Keep last 1000 logs
    setActivityLogs(updatedLogs)
    db.saveActivityLogs(updatedLogs)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("=== LOGIN ATTEMPT ===")
      console.log("Email:", email)
      console.log("Password:", password)

      const users = db.getUsers()
      console.log("All users in database:", users)

      // Convert stored dates back to Date objects for comparison
      const processedUsers = users.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        lastLogin: new Date(u.lastLogin),
      }))

      console.log("Processed users:", processedUsers)

      const foundUser = processedUsers.find((u: User) => {
        console.log(`Checking user: ${u.email} === ${email} && ${u.password} === ${password}`)
        return u.email === email && u.password === password
      })

      console.log("Found user:", foundUser)

      if (foundUser) {
        const updatedUser = { ...foundUser, lastLogin: new Date() }
        setUser(updatedUser)
        localStorage.setItem("current_user", JSON.stringify(updatedUser))

        // Update user in database
        const updatedUsers = users.map((u: User) => (u.id === foundUser.id ? updatedUser : u))
        db.saveUsers(updatedUsers)

        addActivityLog("User Login", `${foundUser.name} logged in`, "user")
        console.log("Login successful!")
        return true
      }

      console.log("Login failed - user not found or password incorrect")
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: Omit<User, "id" | "createdAt" | "lastLogin">): Promise<boolean> => {
    const users = db.getUsers()

    // Check if email already exists
    if (users.find((u: User) => u.email === userData.email)) {
      return false
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      lastLogin: new Date(),
      username: `@${userData.name.toLowerCase().replace(/\s+/g, "_")}_stocksim`,
    }

    const updatedUsers = [...users, newUser]
    db.saveUsers(updatedUsers)

    addActivityLog("User Registration", `New user ${newUser.name} registered`, "user")
    return true
  }

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false

    const users = db.getUsers()
    const updatedUser = { ...user, password: newPassword }
    const updatedUsers = users.map((u: User) => (u.id === user.id ? updatedUser : u))

    db.saveUsers(updatedUsers)
    setUser(updatedUser)
    localStorage.setItem("current_user", JSON.stringify(updatedUser))

    addActivityLog("Password Update", "User updated password", "user")
    return true
  }

  const logout = () => {
    if (user) {
      addActivityLog("User Logout", `${user.name} logged out`, "user")
    }
    setUser(null)
    localStorage.removeItem("current_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updatePassword,
        isAuthenticated: !!user,
        activityLogs,
        addActivityLog,
        initializeDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
