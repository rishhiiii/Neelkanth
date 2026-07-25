// Shared framer-motion variants so the whole site animates as one system.
// Each section picks a different entrance so scrolling feels varied & alive.

const EASE = [0.22, 1, 0.36, 1]

export const viewport = { once: true, amount: 0.2 }

// Parent that staggers its children as they reveal.
export const stagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } }
})

// Gentle rise.
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
}

// Rise while a blur clears — modern & soft.
export const blurUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } }
}

// Springy pop.
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.82 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 18 } }
}

// Subtle 3D tilt into place.
export const rotateIn = {
  hidden: { opacity: 0, y: 44, rotateX: -16, transformPerspective: 900 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } }
}

export const slideLeft = {
  hidden: { opacity: 0, x: -54 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
}

export const slideRight = {
  hidden: { opacity: 0, x: 54 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
}

// Wipe-up reveal for section titles.
export const headingReveal = {
  hidden: { opacity: 0, y: 26, clipPath: 'inset(0 0 100% 0)' },
  show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.75, ease: EASE } }
}

// Reusable spring for whileHover.
export const springHover = { type: 'spring', stiffness: 300, damping: 18 }
