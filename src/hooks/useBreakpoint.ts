"use client";

import { useState, useEffect } from "react";

/**
 * Breakpoint types matching Tailwind CSS breakpoints
 * mobile: < 768px
 * tablet: 768px - 1023px
 * desktop: >= 1024px
 */
export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Hook for detecting current viewport breakpoint
 * Returns the current breakpoint based on window width
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
