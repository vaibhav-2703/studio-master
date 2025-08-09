
"use client"

import { motion, type TargetAndTransition, type VariantLabels, type Transition } from "framer-motion"
import React from "react"

interface AnimatedDivProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: boolean | TargetAndTransition | VariantLabels;
  transition?: Transition;
  delay?: number;
  [key: string]: unknown;
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
  const MotionComponent = (motion as any)[tag] || motion.div;

  return (
    <MotionComponent
      initial={initial as any}
      animate={animateProps as any}
      transition={{ ...(transition as Transition), delay }}
      className={className} 
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
