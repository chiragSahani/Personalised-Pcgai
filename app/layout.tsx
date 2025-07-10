import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personalized Content Dashboard",
  description: "Your personalized hub for news, movies, music, and social posts.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning is used here because next-themes manipulates the `class` attribute on the `html` tag,
    // which can cause a hydration mismatch. It's safe to use here.
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class" // Apply dark mode by adding 'dark' class to html
            defaultTheme="system" // Fallback to system theme if no preference is set
            enableSystem={false} // Disable system theme detection, Redux will control it
            disableTransitionOnChange // Prevent flash of unstyled content
          >
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
