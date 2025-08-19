// components/NavBar.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Box, Link as MuiLink, Divider } from "@mui/material";

const navItems = [
  { label: "Rooms", href: "/rooms" },
  { label: "Dine", href: "/dine" },
  { label: "Bar", href: "/klong" },
  { label: "Banquet Hall", href: "#banquet" },
  { label: "Guest Services", href: "#guest-services" },
  { label: "Contact", href: "#contact-section" },
];

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll with dynamic offset for sticky height (supports wrapping)
  const handleNavClick = useCallback((e: React.MouseEvent<any>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    const headerH = navRef.current?.offsetHeight ?? 60;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - headerH - 8;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  }, []);

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Primary"
      ref={navRef}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (t) => t.zIndex.appBar + 1,

        width: "100%",
        height: "auto",                               // allow wrapping to increase height
        minHeight: { xs: 56, sm: 60, md: 72, lg: 80 },// baseline heights

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // Transparent over hero; subtle shadow after scroll
        bgcolor: "transparent",
        backdropFilter: "blur(4px)",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
        transition: "background-color .25s ease, box-shadow .25s ease",

        // Safe-area
        pl: { xs: "calc(env(safe-area-inset-left, 0px) + 8px)", md: 2 },
        pr: { xs: "calc(env(safe-area-inset-right, 0px) + 8px)", md: 2 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1240,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "center" },

          // ✅ Wrap on small screens so all items show; no horizontal scroll needed
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: 1, sm: 1.25, md: 2, lg: 2 },    // column gap
          rowGap: { xs: 0.75, sm: 0.75 },            // row gap when wrapped

          px: { xs: 0.5, sm: 1 },
          mt: { xs: 5, md: 3, lg: 3 },

          // No overflow scrolling; we want wrapping instead
          overflow: "visible",
        }}
      >
        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <MuiLink
              component={NextLink}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              underline="none"
              sx={{
                color: "white",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: { xs: 0.4, sm: 0.5, md: 0.6 },
                fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
                lineHeight: 1.6,
                px: 0.5,
                py: 0.25,

                // ✅ Allow wrapping on small; keep single line on md+
                whiteSpace: { xs: "normal", md: "nowrap" },

                // Let items shrink if needed, but keep content width
                flex: "0 1 auto",
                display: "inline-flex",

                "&:hover": { color: "#5f02ab" },
                transition: "color .2s ease",
              }}
            >
              {item.label}
            </MuiLink>

            {/* Dividers only from lg+ to avoid clutter when wrapped */}
            {index < navItems.length - 1 && (
              <Divider
                orientation="vertical"
                sx={{
                  display: { xs: "none", lg: "block" },
                  mx: { lg: 1, xl: 1.25 },
                  height: 20,
                  borderColor: "rgba(255,255,255,0.35)",
                  alignSelf: "center",
                  flex: "0 0 auto",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default NavBar;
