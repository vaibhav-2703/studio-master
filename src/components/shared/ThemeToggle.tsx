
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return <Button variant="outline" size="icon" disabled={true}></Button>;
  }

  const handleToggle = () => {
    // Get the currently applied theme from the documentElement
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleToggle}
    >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
