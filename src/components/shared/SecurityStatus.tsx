"use client";

import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SecurityStatusProps {
  url: string;
  onSecurityCheck?: (isSafe: boolean, threats: string[]) => void;
  className?: string;
}

export function SecurityStatus({ url, onSecurityCheck, className }: SecurityStatusProps) {
  const [status, setStatus] = useState<'checking' | 'safe' | 'unsafe' | 'idle'>('idle');
  const [threats, setThreats] = useState<string[]>([]);

  useEffect(() => {
    if (!url || !url.startsWith('http')) {
      setStatus('idle');
      return;
    }

    // Simple client-side heuristics for immediate feedback
    const runQuickCheck = () => {
      setStatus('checking');
      
      try {
        const parsedUrl = new URL(url);
        const quickThreats: string[] = [];
        
        // Check for suspicious TLDs
        const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.su', '.pw'];
        if (suspiciousTlds.some(tld => parsedUrl.hostname.endsWith(tld))) {
          quickThreats.push('Suspicious Domain');
        }
        
        // Check for IP addresses
        if (/^https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(url)) {
          quickThreats.push('Direct IP Access');
        }
        
        // Check for extremely long URLs
        if (url.length > 2000) {
          quickThreats.push('Suspicious Length');
        }
        
        // Check for non-ASCII characters (potential homograph attack)
        if (/[^\x00-\x7F]/.test(parsedUrl.hostname)) {
          quickThreats.push('Non-ASCII Characters');
        }
        
        setTimeout(() => {
          if (quickThreats.length > 0) {
            setStatus('unsafe');
            setThreats(quickThreats);
            onSecurityCheck?.(false, quickThreats);
          } else {
            setStatus('safe');
            setThreats([]);
            onSecurityCheck?.(true, []);
          }
        }, 800); // Simulate checking time
        
      } catch (error) {
        setStatus('safe');
        setThreats([]);
        onSecurityCheck?.(true, []);
      }
    };

    const debounceTimer = setTimeout(runQuickCheck, 500);
    return () => clearTimeout(debounceTimer);
  }, [url, onSecurityCheck]);

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {status === 'checking' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-muted-foreground">Checking security...</span>
        </>
      )}
      
      {status === 'safe' && (
        <>
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
            Secure URL
          </Badge>
        </>
      )}
      
      {status === 'unsafe' && (
        <>
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <div className="flex flex-wrap gap-1">
            {threats.map((threat, index) => (
              <Badge 
                key={index} 
                variant="destructive" 
                className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
              >
                {threat}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SecurityStatus;
