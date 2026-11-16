"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MonogramLoader } from "@/components/common/MonogramLoader"

// The full sequence (monogram assembly + wordmark reveal) takes about 4.7s at speed 1.
const SPEED = 1.4
const MIN_VISIBLE_MS = 4700 / SPEED
// Never hold the screen longer than this, even if the page is still loading.
const MAX_VISIBLE_MS = 4000

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
    const maxTimer = window.setTimeout(() => setVisible(false), MAX_VISIBLE_MS)
    const onLoad = () => {
      loaded = true
      finish()
    }
    if (!loaded) window.addEventListener("load", onLoad)
    else finish()
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(maxTimer)
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
