// components/AppStartupSplash.tsx
// First-visit curtain. One load bar, then the panel lifts. No session replay.

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@mui/material";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import {
  HEADER_LOGO_ON_DARK_SRC,
  INK,
  LAVENDER,
  SANS_UI,
} from "@/lib/luxury-chrome";

const SESSION_KEY = "hotel-poinisuk-splash-seen";
const MIN_VISIBLE_MS = 1300;
const MAX_VISIBLE_MS = 2200;

const easeOut = [0.22, 1, 0.36, 1] as const;
const curtainEase = [0.76, 0, 0.24, 1] as const;

type Phase = "enter" | "exit" | "gone";

const AppStartupSplash: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("gone");
  const progress = useMotionValue(0);
  const barScale = useTransform(progress, (value) => Math.min(1, Math.max(0, value)));

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* private mode */
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      return;
    }

    setPhase("enter");

    let cancelled = false;
    let closed = false;
    const started = performance.now();

    const creep = animate(progress, [0, 0.12, 0.36, 0.58], {
      duration: 1.45,
      times: [0, 0.16, 0.48, 1],
      ease: [0.25, 0.1, 0.25, 1],
    });

    const close = async () => {
      if (cancelled || closed) return;
      closed = true;
      creep.stop();

      const remain = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
      if (remain) {
        await new Promise((resolve) => window.setTimeout(resolve, remain));
      }
      if (cancelled) return;

      await animate(progress, 1, { duration: 0.28, ease: easeOut });
      if (cancelled) return;
      setPhase("exit");
    };

    const onLoad = () => {
      void close();
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    const cap = window.setTimeout(onLoad, MAX_VISIBLE_MS);

    return () => {
      cancelled = true;
      creep.stop();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(cap);
    };
  }, [progress]);

  if (phase === "gone") return null;

  const leaving = phase === "exit";

  return (
    <Box
      component={motion.div}
      suppressHydrationWarning
      aria-hidden
      initial={false}
      animate={{ y: leaving ? "-100%" : "0%" }}
      transition={{
        duration: leaving ? 0.82 : 0,
        ease: curtainEase,
      }}
      onAnimationComplete={() => {
        if (!leaving) return;
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        setPhase("gone");
      }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: INK,
        pointerEvents: leaving ? "none" : "auto",
        willChange: "transform",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.06 }}
        sx={{
          position: "relative",
          width: { xs: 168, sm: 204 },
          height: { xs: 76, sm: 92 },
        }}
      >
        <Image
          src={HEADER_LOGO_ON_DARK_SRC}
          alt=""
          fill
          priority
          sizes="(max-width: 600px) 168px, 204px"
          style={{ objectFit: "contain" }}
        />
      </Box>

      <Box
        component={motion.div}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: easeOut, delay: 0.28 }}
        sx={{
          width: 56,
          height: "1px",
          mt: 2.25,
          bgcolor: LAVENDER,
          transformOrigin: "center",
        }}
      />

      <Box
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.42 }}
        sx={{
          m: 0,
          mt: 1.75,
          fontFamily: SANS_UI,
          fontWeight: 500,
          fontSize: "0.68rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(245, 240, 232, 0.72)",
          pl: "0.28em",
        }}
      >
        Laitumkhrah, Shillong
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          bgcolor: "rgba(255,255,255,0.14)",
        }}
      >
        <motion.div
          style={{
            scaleX: barScale,
            height: "100%",
            width: "100%",
            background: LAVENDER,
            transformOrigin: "left center",
          }}
        />
      </Box>
    </Box>
  );
};

export default AppStartupSplash;
