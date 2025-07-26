
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatedDiv } from "./AnimatedDiv";
import { UserProfile } from "./UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function Header() {
  const { user, isAuthenticated } = useAuth();

  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as any).openAuthDialog) {
      (window as any).openAuthDialog();
    }
  }

  return (
    <>
      <AnimatedDiv
        tag="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
              <Package2 className="relative h-6 w-6 md:h-7 md:w-7 text-white p-1 bg-gradient-to-r from-primary to-primary/80 rounded-lg transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
              SnipURL
            </span>
          </Link>

          {/* Center Navigation - Removed search bar */}

          {/* Mobile Search Button - Removed */}

          {/* Right Navigation */}
          <nav className="flex items-center gap-1 md:gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1 md:gap-2">
                {/* User Profile with Dropdown */}
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center gap-1 md:gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                   Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAuthClick} 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25"
                >
                    Sign Up
                </Button>
              </div>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </AnimatedDiv>
    </>
  );
}
