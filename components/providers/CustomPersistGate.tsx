"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { persistor } from "@/lib/store" // Import the persistor instance

interface CustomPersistGateProps {
  children: React.ReactNode
  loading: React.ReactNode // Can be null or a loading spinner
}

export function CustomPersistGate({ children, loading }: CustomPersistGateProps) {
  const [rehydrated, setRehydrated] = useState(false)

  useEffect(() => {
    // Check if persistor is already bootstrapped (e.g., on subsequent renders)
    if (persistor.getState().bootstrapped) {
      setRehydrated(true)
      return // No need to subscribe if already rehydrated
    }

    // Subscribe to persistor state changes to detect when rehydration is complete
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setRehydrated(true)
        unsubscribe() // Unsubscribe once rehydrated
      }
    })

    // Cleanup function to unsubscribe if the component unmounts before rehydration
    return () => {
      if (!rehydrated) {
        // Only unsubscribe if not already rehydrated
        unsubscribe()
      }
    }
  }, [rehydrated]) // Depend on rehydrated state to avoid re-subscribing unnecessarily

  if (!rehydrated) {
    return loading // Show loading state until rehydration is complete
  }

  return <>{children}</> // Render children once rehydrated
}
