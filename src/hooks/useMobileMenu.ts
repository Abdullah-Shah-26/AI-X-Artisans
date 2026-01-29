"use client";

import { useState, useEffect } from "react";

/**
 * Hook for managing mobile menu state
 * Handles sidebar open/close state and body scroll locking
 */
export interface UseMobileMenuReturn {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export function useMobileMenu(): UseMobileMenuReturn {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when screen size changes to desktop (lg breakpoint: 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return {
    isMobileMenuOpen,
    openMobileMenu: () => setIsMobileMenuOpen(true),
    closeMobileMenu: () => setIsMobileMenuOpen(false),
    toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
  };
}
