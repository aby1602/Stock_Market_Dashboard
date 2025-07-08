"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle, Sparkles, MessageCircle, RefreshCw, Database } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { login, initializeDatabase } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(""), 5000)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError("Invalid email or password. Please check your credentials and try again.")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleClearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleInitializeDB = () => {
    initializeDatabase()
    setError("")
    // Pre-fill admin credentials
    setEmail("admin@stocksim.com")
    setPassword("admin123")
  }

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    setError("")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>

      <Card className="w-full max-w-md shadow-2xl bg-gray-900/80 backdrop-blur-md border-gray-700 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400">Sign in to your Stock Market Simulation account</CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Account created successfully! Please sign in.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                Create one here
              </Link>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent text-xs"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                    Demo Accounts Available
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-300">Click on any account to auto-fill the login form:</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleQuickLogin("admin@stocksim.com", "admin123")}
                      className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-left"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        <span className="font-semibold text-red-400">Admin Account</span>
                      </div>
                      <p className="text-sm text-gray-300">Email: admin@stocksim.com</p>
                      <p className="text-sm text-gray-300">Password: admin123</p>
                      <p className="text-xs text-gray-400 mt-1">Full system access, user management, system controls</p>
                    </button>

                    <button
                      onClick={() => handleQuickLogin("employee@stocksim.com", "emp123")}
                      className="w-full p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors text-left"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        <span className="font-semibold text-blue-400">Employee Account</span>
                      </div>
                      <p className="text-sm text-gray-300">Email: employee@stocksim.com</p>
                      <p className="text-sm text-gray-300">Password: emp123</p>
                      <p className="text-xs text-gray-400 mt-1">Trade execution, market monitoring</p>
                    </button>

                    <button
                      onClick={() => handleQuickLogin("participant@stocksim.com", "part123")}
                      className="w-full p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors text-left"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="font-semibold text-green-400">Participant Account</span>
                      </div>
                      <p className="text-sm text-gray-300">Email: participant@stocksim.com</p>
                      <p className="text-sm text-gray-300">Password: part123</p>
                      <p className="text-xs text-gray-400 mt-1">Portfolio management, trading history</p>
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleClearStorage}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>

            <Button
              variant="outline"
              onClick={handleInitializeDB}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent text-xs"
            >
              <Database className="h-3 w-3 mr-1" />
              Init DB
            </Button>
          </div>

          <div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400 text-center">
              Having login issues? Try "Init DB" then use admin@stocksim.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
