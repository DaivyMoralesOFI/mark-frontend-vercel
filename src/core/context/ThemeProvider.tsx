// theme-provider.tsx
//
// This file provides a ThemeProvider context and hook for managing and accessing the application's color theme (light, dark, or system).
// It supports persisting the user's theme preference in localStorage and applies the theme to the document root.

import { createContext, useContext, useEffect, useState } from "react"

// Theme type: 'dark', 'light', or 'system' (follows OS preference)
type Theme = "dark" | "light" | "system"

// Props for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

// State and context value for the ThemeProvider
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * ThemeProvider
 *
 * Provides a context for managing the application's color theme (light, dark, or system).
 * Persists the theme in localStorage and applies it to the document root.
 *
 * @param children React children to render
 * @param defaultTheme Default theme if none is set (default: 'system')
 * @param storageKey Key for localStorage (default: 'vite-ui-theme')
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // State for the current theme
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove any existing theme classes
    root.classList.remove("light", "dark")

    if (theme === "system") {
      // Detect system theme preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    // Apply the selected theme
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * useTheme
 *
 * Custom hook to access the current theme and setTheme function from ThemeProvider context.
 * Throws an error if used outside of ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
