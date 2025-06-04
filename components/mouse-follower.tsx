"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
  delay: number
}

interface ClickEffect {
  id: number
  x: number
  y: number
  timestamp: number
}

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const particleIdRef = useRef(0)
  const clickIdRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Smooth mouse tracking with spring physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newX = e.clientX
      const newY = e.clientY

      setMousePosition({ x: newX, y: newY })
      mouseX.set(newX)
      mouseY.set(newY)
      setIsMoving(true)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set moving to false after mouse stops
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 150)

      // Create trailing particles
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: newX,
        y: newY,
        opacity: 1,
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 100,
      }

      setParticles((prev) => {
        const updated = [newParticle, ...prev.slice(0, 15)] // Keep last 15 particles
        return updated
      })
    }

    const handleClick = (e: MouseEvent) => {
      setIsClicking(true)

      // Create click effect
      const clickEffect: ClickEffect = {
        id: clickIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }

      setClickEffects((prev) => [...prev, clickEffect])

      // Reset clicking state
      setTimeout(() => setIsClicking(false), 200)

      // Create burst of particles on click
      const burstParticles: Particle[] = []
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const distance = 20 + Math.random() * 30
        burstParticles.push({
          id: particleIdRef.current++,
          x: e.clientX + Math.cos(angle) * distance,
          y: e.clientY + Math.sin(angle) * distance,
          opacity: 1,
          scale: 0.8 + Math.random() * 0.4,
          delay: i * 20,
        })
      }

      setParticles((prev) => [...burstParticles, ...prev.slice(0, 10)])
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("click", handleClick)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [mouseX, mouseY])

  // Fade out particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            opacity: particle.opacity - 0.05,
            scale: particle.scale * 0.98,
          }))
          .filter((particle) => particle.opacity > 0),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Clean up old click effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setClickEffects((prev) => prev.filter((effect) => now - effect.timestamp < 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Main cursor with glow effect */}
      <motion.div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-50"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: isMoving ? [1, 1.5, 1] : isClicking ? [1, 2, 1] : 1,
            opacity: isMoving ? [0.3, 0.6, 0.3] : isClicking ? [0.6, 1, 0.6] : 0.2,
          }}
          transition={{
            duration: isClicking ? 0.3 : 0.6,
            repeat: isMoving && !isClicking ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-1 rounded-full bg-primary/20 backdrop-blur-sm"
          animate={{
            scale: isMoving ? [1, 1.2, 1] : isClicking ? [1, 1.5, 1] : 1,
            opacity: isMoving ? [0.4, 0.8, 0.4] : isClicking ? [0.8, 1, 0.8] : 0.3,
          }}
          transition={{
            duration: isClicking ? 0.2 : 0.4,
            repeat: isMoving && !isClicking ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-blue-500 shadow-lg shadow-primary/50"
          animate={{
            scale: isMoving ? [1, 1.1, 1] : isClicking ? [1, 0.8, 1.2] : 1,
            boxShadow: isMoving
              ? [
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.8)",
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                ]
              : isClicking
                ? [
                    "0 0 15px rgba(59, 130, 246, 0.8)",
                    "0 0 30px rgba(59, 130, 246, 1)",
                    "0 0 15px rgba(59, 130, 246, 0.8)",
                  ]
                : "0 0 5px rgba(59, 130, 246, 0.3)",
          }}
          transition={{
            duration: isClicking ? 0.2 : 0.3,
            repeat: isMoving && !isClicking ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        />

        {/* Scanning lines */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{
            rotate: isMoving ? 360 : 0,
            scale: isClicking ? [1, 1.3, 1] : 1,
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: isMoving ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            },
            scale: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
        >
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent transform -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-y-1/2" />
        </motion.div>
      </motion.div>

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <div key={effect.id}>
          {/* Expanding ring */}
          <motion.div
            className="fixed w-4 h-4 rounded-full border-2 border-primary pointer-events-none"
            style={{
              left: effect.x - 8,
              top: effect.y - 8,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Inner flash */}
          <motion.div
            className="fixed w-2 h-2 rounded-full bg-primary pointer-events-none"
            style={{
              left: effect.x - 4,
              top: effect.y - 4,
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Spark lines */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const length = 15 + Math.random() * 10
            return (
              <motion.div
                key={i}
                className="fixed w-0.5 bg-gradient-to-t from-primary to-cyan-400 pointer-events-none origin-bottom"
                style={{
                  left: effect.x,
                  top: effect.y,
                  height: length,
                  transformOrigin: "bottom center",
                  rotate: `${(angle * 180) / Math.PI}deg`,
                }}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: 1, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: i * 0.02,
                }}
              />
            )
          })}
        </div>
      ))}

      {/* Trailing particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="fixed w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: particle.x - 4,
            top: particle.y - 4,
            opacity: particle.opacity,
            scale: particle.scale,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: particle.opacity,
            scale: particle.scale,
          }}
          transition={{
            duration: 0.3,
            delay: particle.delay / 1000,
          }}
        >
          <div
            className="w-full h-full rounded-full bg-gradient-to-r from-primary/60 to-cyan-400/60 blur-sm"
            style={{
              boxShadow: `0 0 ${4 + index}px rgba(59, 130, 246, ${0.3 + index * 0.05})`,
            }}
          />
        </motion.div>
      ))}

      {/* Geometric trail elements */}
      {isMoving && (
        <>
          <motion.div
            className="fixed w-8 h-8 pointer-events-none"
            style={{
              left: mousePosition.x - 16,
              top: mousePosition.y - 16,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            <div className="w-full h-full border border-cyan-400/50 transform rotate-45" />
          </motion.div>

          <motion.div
            className="fixed w-12 h-12 pointer-events-none"
            style={{
              left: mousePosition.x - 24,
              top: mousePosition.y - 24,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: 0.1,
            }}
          >
            <div className="w-full h-full rounded-full border border-primary/30" />
          </motion.div>
        </>
      )}

      {/* Energy waves */}
      {(isMoving || isClicking) && (
        <motion.div
          className="fixed pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(isClicking ? 5 : 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 rounded-full border border-primary/20"
              style={{
                left: -32,
                top: -32,
              }}
              animate={{
                scale: [0, isClicking ? 3 : 2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: isClicking ? 0.8 : 1,
                repeat: isMoving && !isClicking ? Number.POSITIVE_INFINITY : 0,
                delay: i * (isClicking ? 0.1 : 0.2),
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
