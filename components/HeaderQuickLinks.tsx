// components/HeaderQuickLinks.tsx
"use client";

import React, { useCallback } from "react";
import NextLink from "next/link";
import { Box, Link as MuiLink } from "@mui/material";

const navItems = [
  { label: "Rooms", href: "/rooms" },
  { label: "Dopwai", href: "/dine" },
  { label: "Klong", href: "/klong" },
  { label: "Live & Karaoke", href: "/karaoke" },
  { label: "Banquet Hall", href: "#banquet" },
  { label: "Guest Services", href: "#guest-services" },
  { label: "Contact Us", href: "#contact-section" },
];

interface HeaderQuickLinksProps {
  /**
   * Optional ref to the wrapping header element. Used to compute the smooth-scroll
   * offset for in-page hash anchors so the section lands cleanly below the header.
   */
  headerRef?: React.RefObject<HTMLElement | null>;
}

const HeaderQuickLinks: React.FC<HeaderQuickLinksProps> = ({ headerRef }) => {
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      const headerH = headerRef?.current?.offsetHeight ?? 140;
      const rect = el.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const top = rect.top + scrollTop - headerH - 8;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    },
    [headerRef]
  );

  return (
    <Box
      role="navigation"
      aria-label="Quick links"
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: "rgba(20,12,38,0.34)",
        backdropFilter: "blur(8px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        borderTop: "1px solid rgba(202,166,255,0.22)",
        borderBottom: "1px solid rgba(202,166,255,0.10)",
        // gap from the variable-height header row above (this is the only
        // breakpoint-keyed value that remains — it's positional, not sizing)
        mt: { xs: 10, sm: 5, md: 3 },
        // ── Identical bar size across all screens ─────────────────────────
        py: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // top-edge lavender highlight bar
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.55) 50%, rgba(202,166,255,0) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // single value — content wraps gracefully when it can't fit
          // horizontally, but the bar itself is the same size everywhere
          flexWrap: "wrap",
          columnGap: 1.5,
          rowGap: 0.5,
        }}
      >
        {navItems.map((item) => (
          <MuiLink
            key={item.label}
            component={NextLink}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            underline="none"
            sx={{
              position: "relative",
              color: "rgba(255,255,255,0.86)",
              fontFamily:
                "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.18em",
              fontSize: 12,
              lineHeight: 1.6,
              px: 0.8,
              py: 0.5,
              whiteSpace: "nowrap",
              transition: "color 250ms ease",
              // Hover underline grow-from-center
              "&::after": {
                content: '""',
                position: "absolute",
                left: "50%",
                bottom: 2,
                width: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.85) 50%, rgba(202,166,255,0) 100%)",
                transform: "translateX(-50%)",
                transition: "width 280ms cubic-bezier(.2,.7,.2,1)",
                pointerEvents: "none",
              },
              "&:hover": { color: "#caa6ff" },
              "&:hover::after": { width: "calc(100% - 8px)" },
              "&:focus-visible": {
                outline: "2px solid rgba(202,166,255,0.55)",
                outlineOffset: "2px",
              },
            }}
          >
            {item.label}
          </MuiLink>
        ))}
      </Box>
    </Box>
  );
};

export default HeaderQuickLinks;
