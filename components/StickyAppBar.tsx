// components/StickyAppBar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "./HamburgerMenu";
import {
  RESERVATION_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PURPLE,
  PURPLE_DEEP,
  PURPLE_HOVER,
  LAVENDER_GLASS,
  LAVENDER_GLASS_BORDER,
  SANS_UI,
  HEADER_LOGO_SRC,
  HEADER_LOGO_W,
  HEADER_LOGO_H,
  STICKY_LOGO_SIZES,
  stickyLogoWrapperSx,
} from "@/lib/luxury-chrome";

const utilityLinkSx = {
  color: "rgba(50, 9, 83, 0.92)",
  fontFamily: SANS_UI,
  fontWeight: 500,
  fontSize: { xs: "0.68rem", sm: "0.72rem", md: "0.78rem" },
  letterSpacing: { xs: "0.14em", md: "0.18em" },
  textTransform: "uppercase" as const,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
  transition: "color 220ms ease",
  "&:hover": { color: PURPLE },
};

const StickyAppBar: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {scrolled && (
        <Box
          component={motion.div}
          ref={headerRef as React.Ref<HTMLElement>}
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.28 }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar + 1,
          }}
        >
          <AppBar
            color="transparent"
            elevation={0}
            sx={{
              backgroundColor: LAVENDER_GLASS,
              backdropFilter: "saturate(160%) blur(14px)",
              WebkitBackdropFilter: "saturate(160%) blur(14px)",
              boxShadow: `0 1px 0 ${LAVENDER_GLASS_BORDER}`,
              pt: "env(safe-area-inset-top, 0px)",
              px: { xs: 2, sm: 3, md: 4, lg: 5 },
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                minHeight: { xs: 56, sm: 60, md: 64 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                py: { xs: 0.75, md: 1 },
                width: "100%",
                maxWidth: 1440,
                mx: "auto",
              }}
            >
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
                    src={HEADER_LOGO_SRC}
                    alt="Hotel Poinisuk"
                    width={HEADER_LOGO_W}
                    height={HEADER_LOGO_H}
                    priority
                    sizes={STICKY_LOGO_SIZES}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  flexShrink: 0,
                }}
              >
                <Box
                  component="a"
                  href={PHONE_HREF}
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
                  sx={{
                    bgcolor: PURPLE,
                    color: "#fff",
                    fontFamily: SANS_UI,
                    fontWeight: 600,
                    fontSize: { xs: "0.68rem", md: "0.78rem" },
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    px: { xs: 1.6, md: 2.5 },
                    py: { xs: 0.9, md: 1.1 },
                    borderRadius: 0,
                    boxShadow: "none",
                    "&:hover": { bgcolor: PURPLE_HOVER, boxShadow: "none" },
                  }}
                >
                  Book
                </Button>

                <Box
                  sx={{
                    "& .MuiIconButton-root": {
                      color: PURPLE_DEEP,
                      "&:hover": { color: PURPLE },
                    },
                  }}
                >
                  <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default StickyAppBar;
