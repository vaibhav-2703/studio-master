
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTA } from "@/components/home/CTA";
import AuthDialog from "@/components/shared/AuthDialog";

export default function Home() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // Make the openAuthDialog function globally available
    (window as Window & { openAuthDialog?: () => void }).openAuthDialog = () => {
      setIsAuthDialogOpen(true);
    };

    return () => {
      delete (window as Window & { openAuthDialog?: () => void }).openAuthDialog;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
      <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={setIsAuthDialogOpen} />
    </div>
  );
}
