
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Copy, Link as LinkIcon, Loader2, PlusCircle, QrCode, RefreshCw, Check, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { createShortLink } from "@/lib/link-service";
import { EnhancedCopyButton } from "@/components/ui/enhanced-copy-button";
import Image from "next/image";
import Link from "next/link";

const FormSchema = z.object({
  originalUrl: z.string()
    .min(1, { message: "URL is required." })
    .max(2048, { message: "URL is too long (max 2048 characters)." })
    .url({ message: "Enter a valid URL." })
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          // Block dangerous protocols
          const allowedProtocols = ['http:', 'https:'];
          if (!allowedProtocols.includes(urlObj.protocol)) {
            return false;
          }
          // Block localhost and internal IPs in production
          if (process.env.NODE_ENV === 'production') {
            const hostname = urlObj.hostname.toLowerCase();
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
              return false;
            }
          }
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid or blocked URL." }
    ),
  alias: z.string()
    .optional()
    .refine(val => !val || (val.length >= 1 && val.length <= 50), {
      message: "Alias must be between 1 and 50 characters.",
    })
    .refine(val => !val || /^[a-zA-Z0-9_-]+$/.test(val), {
      message: "Alias can only contain letters, numbers, hyphens, and underscores.",
    })
    .refine(val => {
      if (!val) return true;
      const reservedWords = ['api', 'admin', 'dashboard', 'auth', 'login', 'signup', 'www', 'app', 'about'];
      return !reservedWords.includes(val.toLowerCase());
    }, {
      message: "This alias is reserved and cannot be used.",
    }),
});

type CreatedLinkState = {
  id: string;
  alias: string;
  shortUrl: string;
} | null;

export function UrlShortenerForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<CreatedLinkState>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainTextWidth, setDomainTextWidth] = useState(80); // Start with smaller default
  const domainTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  // Measure the actual width of the domain text
  useEffect(() => {
    if (domainTextRef.current) {
      const width = domainTextRef.current.offsetWidth;
      setDomainTextWidth(width + 24); // Add minimal padding (12px left + 12px spacing)
    }
  }, [domain, domainTextRef.current]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      originalUrl: "",
      alias: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const result = await createShortLink({
        originalUrl: values.originalUrl,
        alias: values.alias,
      });
      setCreatedLink(result);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not create the link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedLink(null);
    setIsCopied(false);
    form.reset();
  }

  const handleCopy = () => {
    if (typeof window === 'undefined' || !createdLink) return;
    
    // Ensure shortUrl starts with '/'
    const shortUrl = createdLink.shortUrl.startsWith('/') 
      ? createdLink.shortUrl 
      : `/${createdLink.shortUrl}`;
    
    const fullUrl = `${window.location.origin}${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast({
        title: "Copied!",
        description: "The link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleAuthClick = () => {
    if (typeof window !== 'undefined' && (window as any).openAuthDialog) {
      (window as any).openAuthDialog();
    }
  }

  if (createdLink) {
    // Ensure shortUrl starts with '/'
    const shortUrl = createdLink.shortUrl.startsWith('/') 
      ? createdLink.shortUrl 
      : `/${createdLink.shortUrl}`;
    
    const fullShortUrl = `${domain}${shortUrl}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullShortUrl)}&qzone=1`;

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl" />
          <Card className="relative bg-card/40 backdrop-blur-2xl border-border/50 shadow-2xl rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Link Created!
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Your short link is ready to share anywhere
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* QR Code Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl blur" />
                <div className="relative p-8 bg-secondary/30 rounded-xl flex flex-col items-center justify-center">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    <Image src={qrApiUrl} alt="QR Code" width={180} height={180} unoptimized />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Scan to share</p>
                </div>
              </div>

              {/* URL Display */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <Input
                    readOnly
                    value={fullShortUrl}
                    className="h-14 text-lg bg-background/60 border-border/60 rounded-xl font-mono flex-1"
                  />
                  <EnhancedCopyButton
                    textToCopy={fullShortUrl}
                    size="lg"
                    variant="outline"
                    showText={true}
                    successMessage="Short URL copied to clipboard!"
                    className="h-14 px-6"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Button 
                  onClick={handleCreateAnother} 
                  variant="outline" 
                  size="lg"
                  className="h-12 rounded-xl border-border/60 hover:border-primary/50 transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> 
                  Create Another
                </Button>
                <Button 
                  onClick={handleAuthClick} 
                  size="lg"
                  className="h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg transition-all duration-300"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> 
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Modern Card with Glassmorphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl" />
        <Card className="relative bg-card/40 backdrop-blur-2xl border-border/50 shadow-2xl rounded-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
                <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text mb-3">
                Shorten Your Link
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Transform long URLs into powerful, trackable short links
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Main URL Input */}
                <FormField
                  control={form.control}
                  name="originalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-center">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <Input
                              placeholder="Enter your long URL to shorten..."
                              className="pl-12 h-16 text-lg bg-background/60 border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300"
                              {...field}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Advanced Options */}
                <div className="w-full max-w-md mx-auto">
                  <FormField
                    control={form.control}
                    name="alias"
                    render={({ field }) => {
                      const domainText = domain ? `${new URL(domain).hostname}/` : 'localhost/';
                      
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <div className="relative flex items-center">
                                {/* Hidden span to measure text width */}
                                <span 
                                  ref={domainTextRef}
                                  className="absolute left-4 text-muted-foreground/80 text-sm whitespace-nowrap opacity-0 pointer-events-none"
                                  aria-hidden="true"
                                >
                                  {domainText}
                                </span>
                                {/* Visible domain text */}
                                <span className="absolute left-4 text-muted-foreground/80 text-sm whitespace-nowrap z-10 select-none group-hover:text-primary/80 transition-colors">
                                  {domainText}
                                </span>
                                <Input 
                                  placeholder="custom-name (optional)" 
                                  className="h-12 bg-background/60 border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300"
                                  style={{ 
                                    paddingLeft: `${domainTextWidth}px`
                                  }}
                                  {...field} 
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="group relative h-14 px-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/25 rounded-xl border-0 text-white overflow-hidden"
                  >
                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 -top-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-all duration-1000 opacity-0 group-hover:opacity-100 group-hover:translate-x-[200%]" />
                    
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Creating Link...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        Shorten Link
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
