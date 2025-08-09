
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatedDiv } from "./AnimatedDiv";
import { UserProfile } from "./UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";


export function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as Window & { openAuthDialog?: () => void }).openAuthDialog) {
      (window as Window & { openAuthDialog?: () => void }).openAuthDialog!();
    }
  }

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow"
      >
        Skip to content
      </a>
      <AnimatedDiv
        tag="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
      >
        <div
          className="flex items-center justify-between mx-auto
                     px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
                     py-3
                     w-full
                     max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1440px]"
        >
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

                           {/* Center Navigation */}
                 {/* Center Navigation (currently empty) */}

          {/* Right Navigation */}
          <nav className="flex items-center gap-1 md:gap-2 shrink-0">
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
