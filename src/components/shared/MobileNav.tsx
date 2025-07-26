"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, BarChart3, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as any).openAuthDialog) {
      (window as any).openAuthDialog();
    }
    setIsOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    ...(isAuthenticated ? [
      { href: "/dashboard", label: "Dashboard", icon: User },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    ] : [])
  ]

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-l border-border z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-40">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-lg">Welcome to SnipURL</h3>
                      <p className="text-sm text-muted-foreground">Simple URL Shortening</p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link 
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                        >
                          <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border space-y-3">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={handleAuthClick}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-primary/80"
                        onClick={handleAuthClick}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
