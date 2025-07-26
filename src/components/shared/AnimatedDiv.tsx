
"use client"

import { motion } from "framer-motion"
import React from "react"

interface AnimatedDivProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  delay?: number;
}

export const AnimatedDiv: React.FC<AnimatedDivProps> = ({ 
  children, 
  className, 
  tag = "div",
  initial = { opacity: 0, y: 20 },
  animate: animateProps = { opacity: 1, y: 0 },
  transition = { duration: 0.5, ease: "easeInOut" },
  delay = 0,
  ...props
}) => {
  const MotionComponent = motion[tag as keyof typeof motion] as any;

  return (
    <MotionComponent 
      initial={initial}
      animate={animateProps}
      transition={{ ...transition, delay }}
      className={className} 
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
