// components/TopBar.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "./HamburgerMenu";

const TOP_BAR_HEIGHT_MD = 82;

const TopBar: React.FC = () => {
  const theme = useTheme();

  // Breakpoints (client-only to avoid SSR mismatch)
  const isXs = useMediaQuery(theme.breakpoints.only("xs"), { noSsr: true });
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const isLandscape = useMediaQuery("(orientation: landscape)", { noSsr: true });

  const [atTop, setAtTop] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY === 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bar height per breakpoint/orientation
  const barHeight = useMemo(() => {
    if (isXs && isLandscape) return 65;
    if (isXs) return 70;
    if (!isMdUp) return 80;   // sm
    if (!isLgUp) return 90;  // md (laptop)
    return 110;               // lg+
  }, [isXs, isMdUp, isLgUp, isLandscape]);

  // Motion variants
  const barVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -TOP_BAR_HEIGHT_MD, opacity: 0 },
      visible: reduceMotion
        ? { opacity: 1, transition: { duration: 0.001 } }
        : {
            y: 0,
            opacity: 1,
            transition: { when: "beforeChildren", staggerChildren: 0.08, duration: 0.3 },
          },
    }),
    [reduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0 },
      visible: reduceMotion
        ? { opacity: 1, transition: { duration: 0.001 } }
        : { y: 0, opacity: 1, transition: { duration: 0.25 } },
    }),
    [reduceMotion]
  );

  return (
    <AnimatePresence>
      {atTop && (
        <Box
          component={motion.div}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          sx={{
            position: "fixed",
            top: { xs: "env(safe-area-inset-top)", md: 45 },
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar + 2,
            display: "flex",
            alignItems: "center",

            height: barHeight,
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 0.5, md: 0.5 },

            bgcolor: "transparent",
            backdropFilter: "blur(2px)",

            "& > .topbar-inner": {
              width: "100%",
              maxWidth: 1440,
              mx: "auto",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr", // left / center (logo) / right
              alignItems: "center",
              gap: { xs: 1.25, sm: 1.25, md: 1.5 },
              minWidth: 0,
            },

            pl: { xs: "calc(env(safe-area-inset-left, 0px) + 12px)", md: 3 },
            pr: { xs: "calc(env(safe-area-inset-right, 0px) + 12px)", md: 3 },
          }}
        >
          <Box className="topbar-inner">
            {/* Left: Hamburger (col 1) */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ gridColumn: 1, justifySelf: "start", display: "flex", alignItems: "center" }}
            >
              <HamburgerMenu open={drawerOpen} setOpen={setDrawerOpen} />
            </Box>

            {/* Center: Logo (col 2, perfectly centered) */}
            <Box
              sx={{
                gridColumn: 2,
                justifySelf: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{
                  // explicit heights per breakpoint — tweak these to resize
                  height: { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 },
                  maxWidth: { xs: "36vw", sm: "36vw", md: "30vw", lg: "30vw", xl: "36vw" },
                }}
              >
                <Box
                  component={motion.img}
                  src="/images/logo1.png"
                  alt="Hotel Poinisuk"
                  variants={itemVariants}
                  draggable={false}
                  sx={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                    mx: "auto",
                    WebkitUserDrag: "none",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </Box>

            {/* Right: Book Now + Phone (col 3) */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                gridColumn: 3,
                justifySelf: "end",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0.5,
                minWidth: 0,
              }}
            >
              <Button
                variant="outlined"
                href="#availability"
                aria-label="Jump to availability form"
                sx={{
                  color: "white",
                  borderColor: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 0,
                  whiteSpace: "nowrap",
                  minHeight: 40,
                  "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                {/* hydration-safe label */}
                <>
                  Book
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {" "}Now
                  </Box>
                </>
              </Button>

              <Box
                component="a"
                href="tel:2093792606"
                aria-label="Call Hotel Poinisuk"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  color: "white",
                  textDecoration: "none",
                  mt: 0.25,
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <PhoneIcon sx={{ fontSize: { xs: "1rem", sm: "1.15rem" } }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", sm: "1rem" },
                    lineHeight: 1,
                    maxWidth: 220,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  (209) 379-2606
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default TopBar;
