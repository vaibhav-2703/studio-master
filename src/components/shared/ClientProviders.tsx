
"use client";

import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/useAuth';

export function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AuthProvider>
        <ThemeProvider
          defaultTheme="dark"
        >
          <div className="relative isolate min-h-screen">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
              <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>
            <div className="absolute top-0 left-0 right-0 -z-10">
              <div className="animate-blob absolute top-0 right-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="animate-blob animation-delay-2000 absolute top-0 left-1/4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="animate-blob animation-delay-4000 absolute top-40 left-1/2 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
            </div>
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
  </AuthProvider>
  );
}
