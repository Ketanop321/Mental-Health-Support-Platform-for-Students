import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindfulCampus - Student Mental Health Support",
  description: "A comprehensive mental health support platform for students",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} custom-cursor`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto py-4 px-4 md:px-6">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
