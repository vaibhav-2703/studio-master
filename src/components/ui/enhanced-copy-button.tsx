"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface EnhancedCopyButtonProps {
  textToCopy: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
  showText?: boolean
  successMessage?: string
}

export function EnhancedCopyButton({ 
  textToCopy, 
  className, 
  size = "default",
  variant = "ghost",
  showText = false,
  successMessage = "Copied to clipboard!"
}: EnhancedCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      
      toast({
        title: "Success!",
        description: successMessage,
        duration: 2000,
      })

      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        isCopied && "bg-green-500/10 border-green-500/20 text-green-600",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {showText && <span>Copied!</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {showText && <span>Copy</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success ripple effect */}
      {isCopied && (
        <motion.div
          className="absolute inset-0 bg-green-500/20 rounded-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </Button>
  )
}
