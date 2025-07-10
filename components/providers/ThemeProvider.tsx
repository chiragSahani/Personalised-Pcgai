"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode)
  const theme = darkMode ? "dark" : "light"

  // This useEffect is a safeguard to ensure the theme is applied,
  // though next-themes usually handles this internally.
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  return (
    <NextThemesProvider {...props} theme={theme} enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}
