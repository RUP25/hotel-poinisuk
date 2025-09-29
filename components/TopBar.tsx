// components/TopBar.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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

const TopBar: React.FC = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const isXs = useMediaQuery(theme.breakpoints.only("xs"), { noSsr: true });

  const [atTop, setAtTop] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY === 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Motion variants (don’t change layout between SSR/CSR)
  const barVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 },
      visible: reduceMotion
        ? { opacity: 1, transition: { duration: 0.001 } }
        : { y: 0, opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08, duration: 0.3 } },
    }),
    [reduceMotion]
  );
  const itemVariants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0 },
      visible: reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, transition: { duration: 0.25 } },
    }),
    [reduceMotion]
  );

  return (
    <AnimatePresence initial={false}>
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

            // ✅ Pure CSS responsive heights — identical SSR/CSR
            height: { xs: 70, sm: 80, md: 90, lg: 110 },
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
            {/* Left: Hamburger */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ gridColumn: 1, justifySelf: "start", display: "flex", alignItems: "center" }}
            >
              <HamburgerMenu open={drawerOpen} setOpen={setDrawerOpen} />
            </Box>

            {/* Center: Logo (click → Home) */}
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
                  // responsive box that controls logo size; CSS-only
                  height: { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 },
                  maxWidth: { xs: "46vw", sm: "40vw", md: "32vw", lg: "30vw", xl: "30vw" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component={Link}
                  href="/"
                  aria-label="Go to Home"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    pointerEvents: "auto",
                    "&:hover": { opacity: 0.92 },
                  }}
                >
                  <Image
                    src="/images/logo1.png"
                    alt="Hotel Poinisuk"
                    width={1200}
                    height={450}
                    priority
                    sizes="(max-width:600px) 46vw,
                           (max-width:900px) 40vw,
                           (max-width:1200px) 32vw,
                           (max-width:1536px) 30vw,
                           30vw"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      userSelect: "none",
                      display: "block",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Right: Book Now + Phone */}
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
                href="https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg="
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
                  (0364) 7100030
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
