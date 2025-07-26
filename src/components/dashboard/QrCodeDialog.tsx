
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QrCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  link: {
      id?: string;
      name?: string;
      shortUrl: string;
      alias?: string;
  }
}

export function QrCodeDialog({ isOpen, onOpenChange, link }: QrCodeDialogProps) {
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrApiUrl, setQrApiUrl] = useState("");

  useEffect(() => {
    if (link && typeof window !== 'undefined') {
        // Ensure shortUrl starts with '/'
        const shortUrl = link.shortUrl.startsWith('/') 
          ? link.shortUrl 
          : `/${link.shortUrl}`;
        
        const fullUrl = `${window.location.origin}${shortUrl}`;
        const colorParam = qrColor.substring(1);
        const bgColorParam = bgColor.substring(1);
        const newUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            fullUrl
        )}&color=${colorParam}&bgcolor=${bgColorParam}`;
        setQrApiUrl(newUrl);
    }
  }, [link, qrColor, bgColor]);
  
  if (!link) return null;

  // Ensure shortUrl starts with '/'
  const shortUrl = link.shortUrl.startsWith('/') 
    ? link.shortUrl 
    : `/${link.shortUrl}`;
  
  const fullShortUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${shortUrl}` 
    : shortUrl;
  
  const handleDownload = async () => {
    try {
        const response = await fetch(qrApiUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const safeName = link.name ? link.name.replace(/[^a-zA-Z0-9]/g, '-') : (link.alias || link.id);
        const filename = `qrcode-${safeName}.png`;
        
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download QR code:", error);
    }
  };

  const resetColors = () => {
    setQrColor("#000000");
    setBgColor("#ffffff");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your QR Code</DialogTitle>
          <DialogDescription>
            Customize and download the QR code for your link.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col items-center justify-center space-y-4 p-6 bg-secondary/50 rounded-lg">
          <div className="p-4 bg-white rounded-md shadow-md">
            {qrApiUrl && (
                <Image
                    src={qrApiUrl}
                    alt={`QR Code for ${fullShortUrl}`}
                    width={250}
                    height={250}
                    className="rounded-md"
                    data-ai-hint="qr code"
                    unoptimized // Required for dynamically generated images from external APIs
                />
            )}
          </div>
          <p className="text-sm text-center text-muted-foreground break-all">
            <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {fullShortUrl}
            </a>
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="qrColor">QR Color</Label>
                <Input id="qrColor" type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="p-1"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bgColor">Background</Label>
                <Input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1"/>
            </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" onClick={resetColors}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
