
"use client";

import { Github, Send, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: "#" },
  { icon: <Github className="h-5 w-5" />, href: "#" },
];

type FooterLink = {
  label: string;
  href: string;
  onClick?: () => void;
};

const handleAuthClick = () => {
  if (typeof window !== 'undefined' && (window as Window & { openAuthDialog?: () => void }).openAuthDialog) {
    (window as Window & { openAuthDialog?: () => void }).openAuthDialog!();
  }
}

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { label: "Pricing", href: "#" },
    { label: "Login", href: "#", onClick: handleAuthClick },
    { label: "Sign Up", href: "#", onClick: handleAuthClick },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};


export function Footer() {
  const { toast } = useToast();

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Subscribed", description: "Thanks for joining our newsletter." });
  };
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-muted/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
                <h3 className="text-lg font-semibold">Join our newsletter</h3>
                <p className="text-muted-foreground mt-2 text-sm">Stay up to date with the latest features and releases.</p>
                <form className="mt-4 flex items-center gap-2" onSubmit={submitNewsletter}>
                  <Input placeholder="Enter your email" required type="email" className="max-w-xs" />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                {Object.entries(footerLinks).map(([title, links]) => (
                    <div key={title}>
                        <h4 className="font-semibold">{title}</h4>
                        <ul className="space-y-3 mt-4">
                            {links.map((link) => (
                                <li key={link.label}>
                                  {link.onClick ? (
                                    <button 
                                      onClick={link.onClick} 
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
                                    >
                                      {link.label}
                                    </button>
                                  ) : link.href.startsWith("#") ? (
                                    <a 
                                      href={link.href}
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                    >
                                      {link.label}
                                    </a>
                                  ) : (
                                    <Link 
                                      href={link.href}
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                    >
                                      {link.label}
                                    </Link>
                                  )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SnipURL. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {socialLinks.map((social, index) => (
                     <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {social.icon}
                     </Link>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
