
"use client";

import { UrlShortenerForm } from "./UrlShortenerForm";
import { AnimatedDiv } from "@/components/shared/AnimatedDiv";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, BarChart3 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <Sparkles className="mr-2 h-4 w-4" />
                Simple URL Shortening
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                Shorten.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Share.
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Analyze.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create short, memorable links for your content with{" "}
              <span className="text-foreground font-semibold">detailed analytics</span>{" "}
              and professional link management features.
            </p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-border/50">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Secure Links</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-border/50">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Click Analytics</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-border/50">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Custom Aliases</span>
              </div>
            </motion.div>
          </AnimatedDiv>
        </div>

        {/* Form Section */}
        <AnimatedDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <UrlShortenerForm />
        </AnimatedDiv>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by developers and businesses worldwide
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-xs font-mono bg-background/60 px-3 py-1 rounded border">
              99.9% Uptime
            </div>
            <div className="text-xs font-mono bg-background/60 px-3 py-1 rounded border">
              1M+ Links Created
            </div>
            <div className="text-xs font-mono bg-background/60 px-3 py-1 rounded border">
              Enterprise Ready
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
