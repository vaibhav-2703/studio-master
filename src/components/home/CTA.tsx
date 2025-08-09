
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {

  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as Window & { openAuthDialog?: () => void }).openAuthDialog) {
      (window as Window & { openAuthDialog?: () => void }).openAuthDialog!();
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-muted/40">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to supercharge your links?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          View all your links and track performance with built-in analytics.
        </p>
        <div className="mt-8">
            <Button onClick={handleAuthClick} size="lg">
                Go to All Links <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </div>
    </section>
  );
}
