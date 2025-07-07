import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AppProvider } from "@/contexts/app-context"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>{children}</main>
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
