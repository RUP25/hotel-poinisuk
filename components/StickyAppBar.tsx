// components/StickyAppBar.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "./HamburgerMenu";

/* -------------------- sizing -------------------- */
const BAR_HEIGHT   = { xs: 64, sm: 72, md: 140, lg: 128, xl: 136 };
const LOGO_HEIGHT  = { xs: 110, sm: 130, md: 140, lg: 160, xl: 180 };
const LOGO_MAX_W   = { xs: "60vw", sm: "36vw", md: "36vw", lg: "36vw", xl: "32vw" };

/* ---------- tweak these offsets to move the logo ---------- */
/* Positive X moves right; positive Y moves down (in pixels). */
const LOGO_SHIFT_X = { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 };
const LOGO_SHIFT_Y = { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 };

const StickyAppBar: React.FC = () => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"), { noSsr: true });
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const barHeight = useMemo(() => {
    if (isXlUp) return BAR_HEIGHT.xl;
    if (isLgUp) return BAR_HEIGHT.lg;
    if (isMdUp) return BAR_HEIGHT.md;
    if (isSmUp) return BAR_HEIGHT.sm;
    return BAR_HEIGHT.xs;
  }, [isSmUp, isMdUp, isLgUp, isXlUp]);

  const barVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -barHeight, opacity: 0 },
      visible: reduceMotion
        ? { opacity: 1, transition: { duration: 0.001 } }
        : { y: 0, opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08, duration: 0.3 } },
    }),
    [barHeight, reduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0 },
      visible: reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, transition: { duration: 0.25 } },
    }),
    [reduceMotion]
  );

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: "fixed",
            top: "env(safe-area-inset-top)",
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar + 1,
          }}
        >
          <AppBar
            color="transparent"
            elevation={4}
            sx={{
              height: barHeight,
              backgroundColor: "rgba(16,16,20,0.55)",
              backdropFilter: "saturate(120%) blur(8px)",
              WebkitBackdropFilter: "saturate(120%) blur(8px)",
              boxShadow: "0 2px 10px rgba(172, 161, 161, 0.18)",
              px: { xs: 1.25, sm: 2, md: 3, lg: 4 },
              pl: { xs: "calc(env(safe-area-inset-left, 0px) + 10px)", md: 3 },
              pr: { xs: "calc(env(safe-area-inset-right, 0px) + 10px)", md: 3 },
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                position: "relative",          // needed for absolute centering of logo
                minHeight: barHeight,
                height: barHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1, sm: 1.25, md: 1.5 },
              }}
            >
              {/* Left: Hamburger */}
              <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center" }}>
                <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
              </motion.div>

              {/* ABSOLUTE CENTERED LOGO */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  // center it and allow per-breakpoint nudges
                  left: {
                    xs: `calc(50% + ${LOGO_SHIFT_X.xs}px)`,
                    sm: `calc(50% + ${LOGO_SHIFT_X.sm}px)`,
                    md: `calc(50% + ${LOGO_SHIFT_X.md}px)`,
                    lg: `calc(50% + ${LOGO_SHIFT_X.lg}px)`,
                    xl: `calc(50% + ${LOGO_SHIFT_X.xl}px)`,
                  },
                  top: {
                    xs: `calc(50% + ${LOGO_SHIFT_Y.xs}px)`,
                    sm: `calc(50% + ${LOGO_SHIFT_Y.sm}px)`,
                    md: `calc(50% + ${LOGO_SHIFT_Y.md}px)`,
                    lg: `calc(50% + ${LOGO_SHIFT_Y.lg}px)`,
                    xl: `calc(50% + ${LOGO_SHIFT_Y.xl}px)`,
                  },
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",        // so it never blocks clicks under it
                  zIndex: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src="/images/logo1.png"
                  alt="Hotel Poinisuk"
                  sx={{
                    height: {
                      xs: LOGO_HEIGHT.xs,
                      sm: LOGO_HEIGHT.sm,
                      md: LOGO_HEIGHT.md,
                      lg: LOGO_HEIGHT.lg,
                      xl: LOGO_HEIGHT.xl,
                    },
                    maxWidth: LOGO_MAX_W,
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                    WebkitUserDrag: "none",
                    userSelect: "none",
                  }}
                />
              </Box>

              {/* Right: Book Now + Phone */}
              <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    fontWeight: 700,
                    textTransform: "none",
                    lineHeight: 1.25,
                    px: { xs: 1.75, md: 2.5 },
                    py: { xs: 0.6, md: 0.75 },
                    borderRadius: 0,
                    boxShadow: "none",
                  }}
                >
                  <>
                    Book
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {" "}Now
                    </Box>
                  </>
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.9)", mt: 0.5, gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1 }}>
                    (209) 379-2606
                  </Typography>
                </Box>
              </motion.div>
            </Toolbar>
          </AppBar>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAppBar;
