
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthDialog({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const { login, signup } = useAuth();

  // Set up global function only once and clean up on unmount
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openAuthDialog = () => setIsOpen(true);
      
      // Cleanup function
      return () => {
        delete (window as any).openAuthDialog;
      };
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      setSuccessMessage("Welcome back!");
      setShowSuccess(true);
      
      // Close dialog after animation
      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
        // Reset form
        setLoginEmail("");
        setLoginPassword("");
      }, 2500);
    } else {
      setLoginError(result.error || "Login failed");
    }
    setLoginLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    
    if (!signupName.trim()) {
      setSignupError("Name is required");
      setSignupLoading(false);
      return;
    }
    
    const result = await signup(signupEmail, signupPassword, signupName);
    
    if (result.success) {
      setSuccessMessage("Account created!");
      setShowSuccess(true);
      
      // Close dialog after animation
      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
        // Reset form
        setSignupEmail("");
        setSignupPassword("");
        setSignupName("");
      }, 2500);
    } else {
      setSignupError(result.error || "Signup failed");
    }
    setSignupLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`sm:max-w-md ${showSuccess ? 'success-dialog border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0' : ''}`}>
        {showSuccess ? (
          // GPay/Paytm Style Success Animation
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative">
              {/* Animated Circle Background */}
              <div className="w-20 h-20 rounded-full border-2 border-green-200 dark:border-green-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-50 dark:bg-green-950 rounded-full scale-0 animate-[scale-up_0.3s_ease-out_forwards]"></div>
                {/* Animated Checkmark */}
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    className="animate-[draw-check_0.5s_ease-out_0.2s_forwards]"
                    style={{
                      strokeDasharray: '20',
                      strokeDashoffset: '20'
                    }}
                  />
                </svg>
              </div>
              {/* Success Ripple Effect */}
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-300 dark:bg-green-700 opacity-20 animate-[ripple_1s_ease-out_forwards]"></div>
            </div>
            <div className="text-center space-y-2 animate-[fade-up_0.4s_ease-out_0.4s_forwards] opacity-0">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Success!</h3>
              <p className="text-sm text-muted-foreground">{successMessage}</p>
            </div>
          </div>
        ) : (
          // Login/Signup Form
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl">Welcome</DialogTitle>
              <DialogDescription>
                Sign in or create an account to get started.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form className="space-y-4 py-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@domain.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      disabled={loginLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      disabled={loginLoading}
                    />
                  </div>
                  {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                  <Button className="w-full" type="submit" disabled={loginLoading}>
                    <Mail className="mr-2 h-4 w-4" /> {loginLoading ? "Logging in..." : "Login with Email"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form className="space-y-4 py-4" onSubmit={handleSignup}>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Full Name"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      disabled={signupLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@domain.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      disabled={signupLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      disabled={signupLoading}
                    />
                  </div>
                  {signupError && <div className="text-red-500 text-sm">{signupError}</div>}
                  <Button className="w-full" type="submit" disabled={signupLoading}>
                    <Mail className="mr-2 h-4 w-4" /> {signupLoading ? "Signing up..." : "Sign Up with Email"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
