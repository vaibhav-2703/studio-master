
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as any).openAuthDialog) {
      (window as any).openAuthDialog();
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-muted/40">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Access your dashboard to manage links, view analytics, and explore advanced features.
        </p>
        <div className="mt-8">
            <Button onClick={handleAuthClick} size="lg">
                Access Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </div>
    </section>
  );
}
