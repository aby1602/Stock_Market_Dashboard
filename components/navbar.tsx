"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getNavLinks = () => {
    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/stocks", label: "Stocks" },
          { href: "/admin/news", label: "News" },
          { href: "/admin/participants", label: "Participants" },
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

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Stock Market Sim
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 capitalize">
              {user.role} - {user.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
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
