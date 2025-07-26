
"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  to: number;
  from?: number;
  className?: string;
}

export function AnimatedCounter({ to, from = 0, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          
          const duration = 1500; // 1.5 seconds
          const startTime = Date.now();
          
          const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.round(easeProgress * (to - from) + from);
            element.textContent = new Intl.NumberFormat('en-US').format(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };
          
          updateCounter();
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [to, from, hasAnimated]);

  return <span ref={ref} className={className || "text-2xl font-bold"}>{from}</span>;
}
