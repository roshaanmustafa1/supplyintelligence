"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MonogramLoader } from "@/components/common/MonogramLoader"

const SPEED = 0.6
// Base hold (2.6s) scaled to the playback speed so the full assembly always plays.
const MIN_VISIBLE_MS = 2600 / SPEED

export function SiteLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let loaded = document.readyState === "complete"
    let minElapsed = false
    const finish = () => {
      if (loaded && minElapsed) setVisible(false)
    }
    const timer = window.setTimeout(() => {
      minElapsed = true
      finish()
    }, MIN_VISIBLE_MS)
    const onLoad = () => {
      loaded = true
      finish()
    }
    if (!loaded) window.addEventListener("load", onLoad)
    else finish()
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-100 flex items-center justify-center bg-white will-change-transform"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 / SPEED, ease: "easeInOut" }}
        >
          <MonogramLoader speed={SPEED} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
