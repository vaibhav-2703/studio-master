"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createShortLink } from "@/lib/link-service";
import { cn } from "@/lib/utils";

interface ModernUrlShortenerProps {
  className?: string;
}

export function ModernUrlShortener({ className }: ModernUrlShortenerProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<{
    id: string;
    alias: string;
    shortUrl: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [domain, setDomain] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const result = await createShortLink({
        originalUrl: url,
        alias: alias.trim() || undefined,
      });

      setCreatedLink(result);
      setUrl("");
      setAlias("");
      
      toast({
        title: "Link Created!",
        description: "Your short link has been created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    
    try {
      await navigator.clipboard.writeText(`${domain}${createdLink.shortUrl}`);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard.",
      });
    }
  };

  const handleCreateAnother = () => {
    setCreatedLink(null);
    setIsCopied(false);
    inputRef.current?.focus();
  };

  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as Window & { openAuthDialog?: () => void }).openAuthDialog) {
      (window as Window & { openAuthDialog?: () => void }).openAuthDialog!();
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <AnimatePresence mode="wait">
        {!createdLink ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* URL Input */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    
                    <div className="relative">
                      <Input
                        ref={inputRef}
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter your long URL here..."
                        className="border-0 bg-background/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 text-lg py-6 px-4 rounded-xl"
                        disabled={loading}
                      />
                      
                      <AnimatePresence>
                        {url && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Alias Input */}
                  <div className="relative">
                    <Input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Custom alias (optional)"
                      className="border-0 bg-muted/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 py-4 px-4 rounded-xl"
                      disabled={loading}
                    />
                    {alias && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {domain}/{alias}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={!url.trim() || loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Link className="h-5 w-5" />
                            Create Short Link
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  {/* Auth CTA */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleAuthClick}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Sign up for analytics and more features
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="h-8 w-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Link Created Successfully!</h3>
                  <p className="text-muted-foreground">Your short link is ready to use</p>
                </div>

                {/* Short URL Display */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Short URL</span>
                    <Badge variant="outline" className="text-xs">
                      {createdLink.alias}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-background/80 rounded-lg border border-border/50">
                    <Link className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm flex-1">
                      {domain}{createdLink.shortUrl}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 w-8 p-0"
                    >
                      <AnimatePresence mode="wait">
                        {isCopied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                          >
                            <Copy className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCreateAnother}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Create Another
                  </Button>
                  <Button
                    onClick={() => window.open(`${domain}${createdLink.shortUrl}`, '_blank')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
