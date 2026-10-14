// components/TopBar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "./HamburgerMenu";
import {
  RESERVATION_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PURPLE,
  PURPLE_HOVER,
  LAVENDER,
  SANS_UI,
  HEADER_LOGO_ON_DARK_SRC,
  HEADER_LOGO_W,
  HEADER_LOGO_H,
  STICKY_LOGO_SIZES,
  stickyLogoWrapperSx,
} from "@/lib/luxury-chrome";

const utilityLinkSx = {
  color: "rgba(255,255,255,0.92)",
  fontFamily: SANS_UI,
  fontWeight: 500,
  fontSize: { xs: "0.68rem", sm: "0.72rem", md: "0.78rem" },
  letterSpacing: { xs: "0.14em", md: "0.18em" },
  textTransform: "uppercase" as const,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
  transition: "color 220ms ease, opacity 220ms ease",
  "&:hover": { color: LAVENDER, opacity: 1 },
};

const TopBar: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [atTop, setAtTop] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY === 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {atTop && (
        <Box
          component={motion.header}
          ref={headerRef as React.Ref<HTMLElement>}
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar + 2,
            pt: "env(safe-area-inset-top, 0px)",
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            pointerEvents: "none",
            "& a, & button": { pointerEvents: "auto" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1440,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1.5, md: 2 },
              py: { xs: 0.75, md: 1 },
              minHeight: { xs: 56, sm: 60, md: 64 },
            }}
          >
            {/* Left: logo */}
            <Box
              component={Link}
              href="/"
              aria-label="Go to Home"
              sx={{
                flex: "0 1 auto",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "opacity 180ms ease",
                "&:hover": { opacity: 0.88 },
              }}
            >
              <Box sx={stickyLogoWrapperSx}>
                <Image
                  src={HEADER_LOGO_ON_DARK_SRC}
                  alt="Hotel Poinisuk"
                  width={HEADER_LOGO_W}
                  height={HEADER_LOGO_H}
                  priority
                  sizes={STICKY_LOGO_SIZES}
                />
              </Box>
            </Box>

            {/* Right: utility row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
                flexShrink: 0,
              }}
            >
              <Box
                component="a"
                href={PHONE_HREF}
                aria-label={`Call Hotel Poinisuk at ${PHONE_DISPLAY}`}
                sx={{
                  ...utilityLinkSx,
                  display: { xs: "none", md: "inline" },
                }}
              >
                {PHONE_DISPLAY}
              </Box>

              <Box
                component={Link}
                href="/booking"
                sx={{
                  ...utilityLinkSx,
                  display: { xs: "none", sm: "inline" },
                }}
              >
                My Booking
              </Box>

              <Button
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book your stay at Hotel Poinisuk"
                sx={{
                  bgcolor: PURPLE,
                  color: "#fff",
                  fontFamily: SANS_UI,
                  fontWeight: 600,
                  fontSize: { xs: "0.68rem", sm: "0.72rem", md: "0.78rem" },
                  letterSpacing: { xs: "0.16em", md: "0.2em" },
                  textTransform: "uppercase",
                  lineHeight: 1,
                  px: { xs: 1.6, sm: 2, md: 2.5 },
                  py: { xs: 1, md: 1.1 },
                  borderRadius: 0,
                  minWidth: 0,
                  boxShadow: "none",
                  transition: "background-color 220ms ease",
                  "&:hover": {
                    bgcolor: PURPLE_HOVER,
                    boxShadow: "none",
                  },
                }}
              >
                Book
              </Button>

              <HamburgerMenu open={drawerOpen} setOpen={setDrawerOpen} />
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default TopBar;
