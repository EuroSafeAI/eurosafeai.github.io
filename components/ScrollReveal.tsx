'use client'

import { motion } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** translateY offset in pixels for the slide-up effect */
  distance?: number
}

/**
 * Fades + slides content into view when it enters the viewport.
 * Uses Motion's whileInView so the animation fires only once (once: true).
 * Automatically respects prefers-reduced-motion via the global CSS rule.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
