"use client"

import { motion, MotionConfig, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

const EASE = [0.4, 0, 0.2, 1] as const

type Direction = "up" | "down" | "left" | "right" | "none"

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance }
    case "down":
      return { y: -distance }
    case "left":
      return { x: distance }
    case "right":
      return { x: -distance }
    default:
      return {}
  }
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  direction?: Direction
  /** Fraction of the element that must be visible before animating. */
  amount?: number
}

/** Fades and slides content in once it scrolls into view (or on load if already visible). */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 1.3,
  distance = 28,
  direction = "up",
  amount = 0.15,
}: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, ...offset(direction, distance) }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
}

/** Container that reveals its `StaggerItem` children one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.18,
  delay = 0,
  amount = 0.1,
}: StaggerProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
