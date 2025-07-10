"use client"

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to clear the timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Only re-run if value or delay changes

  return debouncedValue
}
