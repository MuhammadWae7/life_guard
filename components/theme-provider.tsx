"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Ensure we only render theme switching UI after hydration
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Force dark theme as default if not set
  React.useEffect(() => {
    const currentTheme = localStorage.getItem("theme")
    if (!currentTheme) {
      localStorage.setItem("theme", "dark")
    }
  }, [])

  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </NextThemesProvider>
  )
}
