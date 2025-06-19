// useMobile.ts
//
// This file provides a custom React hook to detect if the current viewport is considered mobile based on a breakpoint.
// It listens for window resize events and updates the state accordingly.

import * as React from "react"

const MOBILE_BREAKPOINT = 768 // px

/**
 * useIsMobile
 *
 * Custom React hook to determine if the viewport width is below the mobile breakpoint.
 * Returns true if the device is mobile, false otherwise.
 *
 * @returns {boolean} Whether the current viewport is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list for the mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
