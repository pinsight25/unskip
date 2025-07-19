import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < MOBILE_BREAKPOINT)

  React.useEffect(() => {
    let timeout: any;
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    const debouncedResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleResize, 100)
    }
    window.addEventListener("resize", debouncedResize)
    return () => window.removeEventListener("resize", debouncedResize)
  }, [])

  return isMobile
}
