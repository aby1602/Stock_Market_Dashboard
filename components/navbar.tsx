"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Settings, Eye, EyeOff, Sparkles } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Navbar() {
  const { user, logout, updatePassword } = useAuth()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  if (!user) return null

  const handlePasswordUpdate = async () => {
    setPasswordError("")

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    const success = await updatePassword(newPassword)
    if (success) {
      setIsPasswordDialogOpen(false)
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setPasswordError("Failed to update password")
    }
  }

  const getNavLinks = () => {
    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/stocks", label: "Stocks" },
          { href: "/admin/news", label: "News" },
          { href: "/admin/participants", label: "Participants" },
          { href: "/admin/users", label: "Users" },
        ]
      case "employee":
        return [
          { href: "/employee", label: "Dashboard" },
          { href: "/employee/trades", label: "Trades" },
        ]
      case "participant":
        return [
          { href: "/participant", label: "Dashboard" },
          { href: "/participant/portfolio", label: "Portfolio" },
          { href: "/participant/trades", label: "Trade History" },
        ]
      default:
        return []
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "employee":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "participant":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center space-x-2"
            >
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span>StockSim Pro</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-purple-400">{user.username}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600"
                >
                  <User className="h-4 w-4 text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  <p className="text-xs text-purple-400">{user.username}</p>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />

                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-gray-300 hover:bg-gray-800">
                      <Settings className="mr-2 h-4 w-4" />
                      Change Password
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10 bg-gray-800 border-gray-600 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
                      <Button onClick={handlePasswordUpdate} className="w-full bg-purple-600 hover:bg-purple-700">
                        Update Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={logout} className="text-gray-300 hover:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
