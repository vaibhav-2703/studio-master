
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, LineChart, Package2, PanelLeftClose, PanelLeftOpen, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserProfile } from "@/components/shared/UserProfile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatedDiv } from "@/components/shared/AnimatedDiv";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navLinks = [
    { href: "/dashboard", label: "All Links", icon: Home },
    { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <div className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:w-64" : "md:w-20"
      )}>
        <div className="flex h-full max-h-screen flex-col border-r bg-background/80 backdrop-blur-lg">
          <div className={cn(
            "flex h-16 items-center border-b px-6 shrink-0",
            !isSidebarOpen && "justify-center px-2"
          )}>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <Package2 className="h-6 w-6 text-primary" />
              <span className={cn("transition-opacity", !isSidebarOpen && "sr-only")}>SnipURL</span>
            </Link>
          </div>
          <nav className={cn("flex flex-col gap-2 flex-1 p-4", !isSidebarOpen && "p-2 items-center")}>
            {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    !isSidebarOpen && "justify-center",
                    pathname === link.href && "bg-muted text-primary"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className={cn("transition-opacity", !isSidebarOpen && "sr-only")}>{link.label}</span>
                </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className={cn("flex flex-col transition-all duration-300 ease-in-out", isSidebarOpen ? "md:pl-64" : "md:pl-20")}>
        <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 md:px-6 sticky top-0 z-40">
          <Button variant="ghost" size="icon" className="hidden md:flex shrink-0" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package2 className="h-6 w-6" />
                  <span className="">SnipURL</span>
                </Link>
                {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                        pathname === link.href && "bg-muted text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <UserProfile />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <AnimatedDiv
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-1 flex-col gap-4"
            >
              {children}
            </AnimatedDiv>
        </main>
      </div>
    </div>
  );
}
