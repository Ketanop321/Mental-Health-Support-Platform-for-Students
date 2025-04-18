"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  MessageCircle,
  BookMarked,
  Menu,
  X,
  User,
  LogOut,
  Video,
  Gamepad2,
  Music,
  Users,
} from "lucide-react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
  { name: "Mood Tracker", href: "/mood-tracker", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
  { name: "Journal", href: "/journal", icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { name: "Videos", href: "/videos", icon: <Video className="h-4 w-4 mr-2" /> },
  { name: "Games", href: "/games", icon: <Gamepad2 className="h-4 w-4 mr-2" /> },
  { name: "Music", href: "/music", icon: <Music className="h-4 w-4 mr-2" /> },
  { name: "Chat Support", href: "/chat", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
  { name: "Community", href: "/community", icon: <Users className="h-4 w-4 mr-2" /> },
  { name: "Resources", href: "/resources", icon: <BookMarked className="h-4 w-4 mr-2" /> },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">MC</span>
            </span>
            <span className="font-bold text-xl hidden md:inline-block">MindfulCampus</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors flex items-center whitespace-nowrap",
                pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-6 space-y-4 border-t">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block py-2 text-base font-medium transition-colors flex items-center",
                pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
