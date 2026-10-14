// pages/klong.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import EmojiFoodBeverageOutlinedIcon from "@mui/icons-material/EmojiFoodBeverageOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

function KlongPage() {
  const serif = "var(--font-cormorant), 'Playfair Display', 'Georgia', 'Times New Roman', serif";
  const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
  const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
  const script = "var(--font-allura), 'Great Vibes', 'Brush Script MT', cursive";

  const storyRef = useRef<HTMLDivElement | null>(null);
  const featureRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [storyInView, setStoryInView] = useState(false);
  const [featureInView, setFeatureInView] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const targets: Array<[
      React.RefObject<HTMLDivElement | null>,
      React.Dispatch<React.SetStateAction<boolean>>
    ]> = [
      [storyRef, setStoryInView],
      [featureRef, setFeatureInView],
      [galleryRef, setGalleryInView],
    ];

    const observers: IntersectionObserver[] = [];
    targets.forEach(([ref, setter]) => {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.18 }
      );
      observer.observe(node);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main>
      <Box
        sx={{
          bgcolor: "#faf6ef",
          "@keyframes glowDrift": {
            "0%": { transform: "translateX(-8%)", opacity: 0.22 },
            "50%": { transform: "translateX(10%)", opacity: 0.4 },
            "100%": { transform: "translateX(-8%)", opacity: 0.22 },
          },
          "@keyframes signSway": {
            "0%, 100%": { transform: "rotate(-2.4deg)" },
            "50%": { transform: "rotate(2.4deg)" },
          },
          "@keyframes signDrop": {
            "0%": { opacity: 0, transform: "translateY(-60px) rotate(-6deg) scale(0.9)" },
            "60%": { opacity: 1, transform: "translateY(8px) rotate(2deg) scale(1.02)" },
            "100%": { opacity: 1, transform: "translateY(0) rotate(-2.4deg) scale(1)" },
          },
          "@keyframes cormorantRise": {
            "0%": { opacity: 0, transform: "translateY(22px) scale(0.985)", filter: "blur(6px)" },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          },
          "@keyframes cinzelTrack": {
            "0%": { opacity: 0, letterSpacing: "0.05em", transform: "translateY(10px)" },
            "100%": { opacity: 1, letterSpacing: "0.32em", transform: "translateY(0)" },
          },
          "@keyframes dividerGrow": {
            "0%": { transform: "scaleX(0)", opacity: 0 },
            "100%": { transform: "scaleX(1)", opacity: 1 },
          },
          "@keyframes diamondPop": {
            "0%": { transform: "rotate(0deg) scale(0)", opacity: 0 },
            "70%": { transform: "rotate(45deg) scale(1.3)", opacity: 1 },
            "100%": { transform: "rotate(45deg) scale(1)", opacity: 1 },
          },
          "@keyframes letterRise": {
            "0%": { opacity: 0, transform: "translateY(14px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes scriptRise": {
            "0%": { opacity: 0, transform: "translateY(18px) rotate(-2deg)" },
            "100%": { opacity: 1, transform: "translateY(0) rotate(0deg)" },
          },
          "@keyframes pulseDot": {
            "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(95,2,171,0.55)" },
            "50%": { transform: "scale(1.18)", boxShadow: "0 0 0 10px rgba(95,2,171,0)" },
          },
          "@keyframes card3DHover": {
            "0%": { transform: "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)" },
            "50%": { transform: "perspective(1200px) rotateY(-3.2deg) rotateX(2deg) scale(1.02)" },
            "100%": { transform: "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)" },
          },
          "@keyframes cursiveShimmer": {
            "0%": { backgroundPosition: "200% 50%" },
            "100%": { backgroundPosition: "-200% 50%" },
          },
          "@keyframes bubbleFloat": {
            "0%": { transform: "translateY(0) scale(0.3)", opacity: 0 },
            "6%": { transform: "translateY(-12px) scale(1.5)", opacity: 1 },
            "14%": { transform: "translateY(-40px) scale(1)", opacity: 0.95 },
            "55%": { transform: "translateY(-180px) scale(1.05)", opacity: 0.75 },
            "100%": { transform: "translateY(-360px) scale(0.9)", opacity: 0 },
          },
          "@keyframes bubbleDrift": {
            "0%": { transform: "translate(0, 0) scale(0.3)", opacity: 0 },
            "8%": { transform: "translate(4px, -16px) scale(1.6)", opacity: 1 },
            "30%": { transform: "translate(-6px, -90px) scale(1)", opacity: 0.9 },
            "65%": { transform: "translate(8px, -210px) scale(1.05)", opacity: 0.65 },
            "100%": { transform: "translate(-2px, -380px) scale(0.85)", opacity: 0 },
          },
          "@keyframes tileShimmer": {
            "0%": { transform: "translateX(-120%) rotate(10deg)", opacity: 0 },
            "30%": { opacity: 0.7 },
            "100%": { transform: "translateX(120%) rotate(10deg)", opacity: 0 },
          },
        }}
      >
        {/* ───────────── HERO ───────────── */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "100vh", sm: "105vh", md: "115vh" },
            overflow: "hidden",
            bgcolor: "#05070b",
          }}
        >
          {/* Background photo — sharper, nighttime-graded */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/images/bar/masthead.jpeg"
              alt="Klong Lounge ambience"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                filter: "brightness(0.82) contrast(1.12) saturate(1.05) hue-rotate(-6deg)",
              }}
            />
          </Box>

          {/* Night-tone gradient: deep top, midnight-indigo bottom */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,11,0.50) 0%, rgba(8,6,18,0.32) 35%, rgba(20,8,40,0.38) 70%, rgba(5,4,16,0.60) 100%)",
            }}
          />

          {/* Vignette to push focus toward the center */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.40) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Subtle ambient glows (toned down so the night reads cleaner) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 22% 28%, rgba(202,166,255,0.18) 0%, rgba(202,166,255,0) 38%)",
              animation: "glowDrift 9s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 78% 72%, rgba(95,2,171,0.22) 0%, rgba(95,2,171,0) 44%)",
              animation: "glowDrift 12s ease-in-out infinite reverse",
              mixBlendMode: "screen",
            }}
          />

          {/* Floating particle field — popping & drifting lights */}
          {[
            { left: "4%",  size: 4, delay: 0.6, dur: 9,  hue: "lav", drift: false, tint: 0.85 },
            { left: "8%",  size: 6, delay: 2.2, dur: 11, hue: "lav", drift: true,  tint: 1.0 },
            { left: "12%", size: 3, delay: 4.1, dur: 8,  hue: "wht", drift: false, tint: 0.9 },
            { left: "16%", size: 7, delay: 0,   dur: 12, hue: "lav", drift: true,  tint: 1.0 },
            { left: "21%", size: 4, delay: 3.4, dur: 10, hue: "wht", drift: false, tint: 0.85 },
            { left: "26%", size: 5, delay: 1.5, dur: 13, hue: "lav", drift: true,  tint: 0.95 },
            { left: "31%", size: 3, delay: 5.2, dur: 9,  hue: "lav", drift: false, tint: 0.8 },
            { left: "37%", size: 8, delay: 2.8, dur: 14, hue: "vio", drift: true,  tint: 1.0 },
            { left: "42%", size: 4, delay: 0.3, dur: 10, hue: "wht", drift: false, tint: 0.9 },
            { left: "47%", size: 5, delay: 4.6, dur: 11, hue: "lav", drift: true,  tint: 1.0 },
            { left: "52%", size: 3, delay: 1.9, dur: 8,  hue: "lav", drift: false, tint: 0.8 },
            { left: "57%", size: 6, delay: 3.7, dur: 12, hue: "vio", drift: true,  tint: 0.95 },
            { left: "62%", size: 4, delay: 0.9, dur: 9,  hue: "wht", drift: false, tint: 0.9 },
            { left: "67%", size: 7, delay: 5.5, dur: 13, hue: "lav", drift: true,  tint: 1.0 },
            { left: "72%", size: 3, delay: 2.6, dur: 8,  hue: "lav", drift: false, tint: 0.85 },
            { left: "77%", size: 5, delay: 4.2, dur: 11, hue: "wht", drift: true,  tint: 0.95 },
            { left: "82%", size: 4, delay: 1.2, dur: 10, hue: "lav", drift: false, tint: 0.9 },
            { left: "86%", size: 6, delay: 3.1, dur: 12, hue: "vio", drift: true,  tint: 1.0 },
            { left: "90%", size: 3, delay: 5.0, dur: 9,  hue: "wht", drift: false, tint: 0.85 },
            { left: "94%", size: 5, delay: 0.4, dur: 11, hue: "lav", drift: true,  tint: 0.95 },
            { left: "97%", size: 4, delay: 2.4, dur: 10, hue: "lav", drift: false, tint: 0.9 },
          ].map((b, i) => {
            const palette =
              b.hue === "wht"
                ? { core: "rgba(255,253,255,_)", glow: "rgba(220,200,255,_)" }
                : b.hue === "vio"
                ? { core: "rgba(186,140,255,_)", glow: "rgba(140,80,220,_)" }
                : { core: "rgba(220,196,255,_)", glow: "rgba(202,166,255,_)" };
            const core = palette.core.replace("_", String(b.tint));
            const glow = palette.glow.replace("_", String(0.7 * b.tint));
            return (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  bottom: -20,
                  left: b.left,
                  width: b.size,
                  height: b.size,
                  borderRadius: "50%",
                  bgcolor: core,
                  boxShadow: `0 0 ${4 + b.size}px ${glow}, 0 0 ${10 + b.size * 2}px ${glow}`,
                  animation: `${b.drift ? "bubbleDrift" : "bubbleFloat"} ${b.dur}s ease-out ${b.delay}s infinite`,
                  willChange: "transform, opacity",
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                }}
              />
            );
          })}

          {/* Hero content */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "100vh", sm: "105vh", md: "115vh" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 6, md: 8 },
            }}
          >
            {/* Italic display title */}
            <Typography
              component="h1"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 500,
                color: "#fff",
                fontSize: {
                  xs: "2.6rem",
                  sm: "3.6rem",
                  md: "4.6rem",
                  lg: "5.4rem",
                },
                lineHeight: 1,
                letterSpacing: "0.005em",
                textShadow:
                  "0 4px 30px rgba(50,9,83,0.55), 0 2px 6px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 700ms both",
              }}
            >
                Klong Lounge
              </Typography>

            {/* Divider with diamond accent */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1.2, sm: 1.4, md: 1.6 },
                mt: { xs: 1.4, sm: 1.8, md: 2.4 },
                mb: { xs: 1.2, sm: 1.6, md: 2 },
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100, lg: 130 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)",
                  transformOrigin: "right center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 1100ms both",
                }}
              />
              <Box sx={{ position: "relative", width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 } }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "#caa6ff",
                    boxShadow: "0 0 14px rgba(202,166,255,0.85)",
                    animation:
                      "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1500ms both",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100, lg: 130 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
                  transformOrigin: "left center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 1100ms both",
                }}
              />
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: cinzel,
                fontWeight: 500,
                color: "#fff",
                fontSize: {
                  xs: "0.74rem",
                  sm: "0.95rem",
                  md: "1.2rem",
                  lg: "1.4rem",
                },
                lineHeight: 1,
                letterSpacing: { xs: "0.24em", sm: "0.28em", md: "0.32em" },
                pl: { xs: "0.24em", sm: "0.28em", md: "0.32em" },
                textTransform: "uppercase",
                textShadow:
                  "0 2px 14px rgba(50,9,83,0.45), 0 1px 4px rgba(0,0,0,0.3)",
                animation:
                  "cinzelTrack 1100ms cubic-bezier(.2,.7,.2,1) 1700ms both",
              }}
            >
              Bar &amp; Lounge
            </Typography>
          </Box>
        </Box>

        {/* ───────────── STORY (etymology) ───────────── */}
        <Box
          ref={storyRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2.4, md: 5 },
            textAlign: "center",
            bgcolor: "#faf6ef",
            overflow: "hidden",
          }}
        >
          {/* Soft purple ambient glow */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(202,166,255,0.18) 0%, rgba(202,166,255,0) 55%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", maxWidth: 880, mx: "auto" }}>
            {/* Hanging Klong sign — true cutout PNG (transparent background) */}
            <Box
              sx={{
                position: "relative",
                width: { xs: 240, sm: 320, md: 400, lg: 460 },
                height: { xs: 200, sm: 264, md: 332, lg: 380 },
                mx: "auto",
                mb: { xs: 2.4, sm: 3, md: 3.6 },
                transformOrigin: "50% 0%",
                opacity: storyInView ? 1 : 0,
                animation: storyInView
                  ? "signDrop 1100ms cubic-bezier(.2,.7,.2,1) 150ms both, signSway 6s ease-in-out 1350ms infinite"
                  : "none",
              }}
            >
              <Image
                src="/images/bar/klong-sign-cutout.png"
                alt="Klong — hanging gourd signboard"
                fill
                sizes="(max-width: 600px) 240px, (max-width: 900px) 320px, 460px"
                style={{ objectFit: "contain" }}
              />
        </Box>

            {/* Cursive accent */}
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                fontFamily: script,
                fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                lineHeight: 1,
                backgroundImage:
                  "linear-gradient(90deg, #320953 0%, #caa6ff 25%, #5f02ab 50%, #caa6ff 75%, #320953 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                opacity: storyInView ? 1 : 0,
                animation: storyInView
                  ? "scriptRise 800ms cubic-bezier(.2,.7,.2,1) both, cursiveShimmer 6s linear 800ms infinite"
                  : "none",
                mb: 0.5,
              }}
            >
              Um Klong
            </Typography>

            {/* Animated section title (letter rise) */}
            <Typography
              component="h2"
              sx={{
                fontFamily: cinzel,
                fontWeight: 700,
                color: "#320953",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "2.8rem" },
                letterSpacing: { xs: "0.10em", sm: "0.12em", md: "0.14em" },
                lineHeight: 1.05,
                mb: { xs: 1.6, md: 2.2 },
              }}
            >
              {"THE STORY BEHIND KLONG".split("").map((ch, i) => (
                <Box
                  key={i}
                  component="span"
                  sx={{
                    display: "inline-block",
                    whiteSpace: ch === " " ? "pre" : "normal",
                    opacity: storyInView ? 1 : 0,
                    animation: storyInView
                      ? `letterRise 600ms cubic-bezier(.2,.7,.2,1) ${200 + i * 38}ms both`
                      : "none",
                  }}
                >
                  {ch}
                </Box>
              ))}
            </Typography>

            {/* Divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, md: 1.2 },
                mb: { xs: 2.4, md: 3 },
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 48, sm: 80, md: 110 },
                  background: "linear-gradient(90deg, rgba(95,2,171,0) 0%, #5f02ab 100%)",
                  transformOrigin: "right center",
                  opacity: storyInView ? 1 : 0,
                  animation: storyInView
                    ? "dividerGrow 700ms cubic-bezier(.2,.7,.2,1) 900ms both"
                    : "none",
                }}
              />
              <Box sx={{ position: "relative", width: 10, height: 10 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 8,
                    height: 8,
                    bgcolor: "#5f02ab",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                    opacity: storyInView ? 1 : 0,
                    animation: storyInView
                      ? "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1300ms both"
                      : "none",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 48, sm: 80, md: 110 },
                  background: "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                  transformOrigin: "left center",
                  opacity: storyInView ? 1 : 0,
                  animation: storyInView
                    ? "dividerGrow 700ms cubic-bezier(.2,.7,.2,1) 900ms both"
                    : "none",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 500,
                color: "#320953",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                lineHeight: 1.45,
                mb: { xs: 1.6, md: 2 },
                opacity: storyInView ? 1 : 0,
                animation: storyInView
                  ? "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1100ms both"
                  : "none",
              }}
            >
              Rooted in Khasi tradition, reimagined for the modern bar
            </Typography>

            <Typography
              sx={{
                fontFamily: cormorant,
                fontWeight: 400,
                color: "#3f2a2a",
                fontSize: { xs: "1rem", sm: "1.08rem", md: "1.18rem" },
                lineHeight: { xs: 1.7, md: 1.85 },
                maxWidth: 760,
                mx: "auto",
                opacity: storyInView ? 1 : 0,
                animation: storyInView
                  ? "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1300ms both"
                  : "none",
              }}
            >
              In Khasi (Mawphor),{" "}
              <Box component="em" sx={{ fontStyle: "italic", color: "#5f02ab", fontWeight: 600 }}>
                Um&nbsp;Klong
              </Box>{" "}
              refers to a drink derived from the gourd or bottle gourd — often enriched with
              nutrients or sugar — known to be beneficial for health and recovery after exercise.
              At our Klong Bar, that spirit lives on through handcrafted mix cocktails and mocktail
              shooters, served with a sense of place.
            </Typography>
          </Box>
        </Box>

        {/* ───────────── COCKTAILS & MOCKTAIL SHOOTERS ───────────── */}
        <Box
          ref={featureRef}
          sx={{
            position: "relative",
            bgcolor: "#0e1116",
            overflow: "hidden",
            py: { xs: 6, md: 9 },
            px: { xs: 2, sm: 3, md: 6, lg: 8 },
          }}
        >
          {/* Ambient glows */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 18% 30%, rgba(202,166,255,0.18) 0%, rgba(202,166,255,0) 45%)",
              animation: "glowDrift 10s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 82% 70%, rgba(95,2,171,0.22) 0%, rgba(95,2,171,0) 48%)",
              animation: "glowDrift 13s ease-in-out infinite reverse",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              maxWidth: 1180,
              mx: "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "stretch",
            }}
          >
            {/* Image collage */}
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: 320, sm: 420, md: 540 },
                opacity: featureInView ? 1 : 0,
                transform: featureInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 900ms ease 100ms, transform 900ms ease 100ms",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: { xs: "84%", md: "82%" },
                  height: { xs: 240, sm: 340, md: 460 },
                  boxShadow:
                    "0 30px 44px rgba(50,9,83,0.45), 0 8px 16px rgba(50,9,83,0.3)",
                  animation: "card3DHover 6s ease-in-out infinite",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(130deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%)",
                    pointerEvents: "none",
                  },
                }}
              >
                <Image
                  src="/images/bar/bar2.jpg"
                  alt="Cocktail crafted at Klong Lounge"
                  fill
                  sizes="(max-width: 600px) 86vw, (max-width: 900px) 80vw, 44vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: 8, md: 0 },
                  bottom: { xs: 8, md: 0 },
                  width: { xs: 160, sm: 220, md: 280 },
                  height: { xs: 140, sm: 220, md: 290 },
                  border: { xs: "5px solid #faf6ef", md: "6px solid #faf6ef" },
                  boxShadow: "0 18px 28px rgba(50,9,83,0.45)",
                  zIndex: 3,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/bar/klongbar1.jpg"
                  alt="Klong Lounge bar interior"
                  fill
                  sizes="(max-width: 600px) 38vw, (max-width: 900px) 28vw, 280px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Box>

            {/* Text panel */}
            <Box
              sx={{
                position: "relative",
                bgcolor: "rgba(250,246,239,0.04)",
                border: "1px solid rgba(202,166,255,0.18)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                px: { xs: 2.4, sm: 3.4, md: 4.6 },
                py: { xs: 3.4, sm: 4, md: 5 },
                opacity: featureInView ? 1 : 0,
                transform: featureInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 900ms ease 250ms, transform 900ms ease 250ms",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: script,
                  fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem" },
                  lineHeight: 0.95,
                  backgroundImage:
                    "linear-gradient(90deg, #caa6ff 0%, #fff 35%, #caa6ff 65%, #5f02ab 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                  animation: "cursiveShimmer 6s linear infinite",
                }}
              >
                Mix &amp; Match
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: { xs: "1.5rem", sm: "1.9rem", md: "2.2rem" },
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                  mt: 0.6,
                  mb: 1.4,
                }}
              >
                COCKTAILS &amp; MOCKTAIL SHOOTERS
              </Typography>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2.4 }}>
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 36, md: 48 },
                    background:
                      "linear-gradient(90deg, #caa6ff 0%, rgba(202,166,255,0) 100%)",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: cinzel,
                    fontWeight: 500,
                    color: "#caa6ff",
                    letterSpacing: "0.22em",
                    fontSize: { xs: "0.66rem", sm: "0.74rem", md: "0.78rem" },
                    lineHeight: 1,
                  }}
                >
                  HAND-CRAFTED. FRESH. UNFORGETTABLE.
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: { xs: "1.08rem", sm: "1.22rem", md: "1.35rem" },
                  lineHeight: 1.4,
                  mb: 2,
                }}
              >
                Crafted drinks where premium spirits, fresh fruit and bold aromatics meet.
              </Typography>

              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: { xs: "0.98rem", sm: "1.06rem", md: "1.12rem" },
                  lineHeight: { xs: 1.65, md: 1.75 },
                  mb: 2.6,
                }}
              >
                Each pour is built fresh — balanced spirit, citrus, aroma and texture — alongside
                our quick-hit mocktail shooters for a lighter, lively round. Settle in for live
                music, karaoke nights, and the warm hum of conversation at Klong.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.2, md: 1.4 } }}>
                {[
                  { icon: <LocalBarOutlinedIcon sx={{ fontSize: { xs: 18, md: 20 }, color: "#caa6ff" }} />, text: "Signature mix cocktails crafted to order" },
                  { icon: <EmojiFoodBeverageOutlinedIcon sx={{ fontSize: { xs: 18, md: 20 }, color: "#caa6ff" }} />, text: "Fresh-fruit mocktail shooters" },
                  { icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: { xs: 18, md: 20 }, color: "#caa6ff" }} />, text: "Live music & karaoke nights" },
                ].map((item) => (
                  <Box
                    key={item.text}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.1, md: 1.4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: 30, md: 36 },
                        height: { xs: 30, md: 36 },
                        borderRadius: "50%",
                        bgcolor: "rgba(202,166,255,0.10)",
                        border: "1px solid rgba(202,166,255,0.28)",
                        flexShrink: 0,
                        transition:
                          "background-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
                        "&:hover": {
                          bgcolor: "rgba(202,166,255,0.20)",
                          transform: "scale(1.08)",
                          boxShadow: "0 0 12px rgba(202,166,255,0.45)",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: cormorant,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.92)",
                        fontSize: { xs: "0.96rem", sm: "1.02rem", md: "1.08rem" },
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Contact Us CTA — opens the same brand-styled popup that
                  submits to the same AWS endpoint as the main contact form.
                  Styled for the dark Klong palette: brand purple fill with a
                  subtle lavender border + glow on hover. */}
              <Box sx={{ mt: { xs: 2.5, sm: 3, md: 3.5 } }}>
                <Button
                  variant="contained"
                  onClick={() => setContactOpen(true)}
                  startIcon={<MailOutlineIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
                  sx={{
                    bgcolor: "#5f02ab",
                    color: "#fff",
                    fontFamily: cinzel,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.82rem" },
                    textTransform: "uppercase",
                    px: { xs: 2.5, sm: 3.2, md: 3.6 },
                    py: { xs: 1.05, sm: 1.15, md: 1.25 },
                    borderRadius: 1.1,
                    border: "1px solid rgba(202,166,255,0.35)",
                    boxShadow: "0 6px 20px rgba(50,9,83,0.45), 0 0 0 1px rgba(202,166,255,0.08)",
                    transition:
                      "background-color 240ms ease, transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
                    "&:hover": {
                      bgcolor: "#76046b",
                      transform: "translateY(-1px)",
                      borderColor: "rgba(202,166,255,0.65)",
                      boxShadow:
                        "0 10px 26px rgba(50,9,83,0.55), 0 0 18px rgba(202,166,255,0.35)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #caa6ff",
                      outlineOffset: 3,
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>

              {/* Pulsing accent dot */}
              <Box
                sx={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#caa6ff",
                  animation: "pulseDot 2.4s ease-out infinite",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ───────────── GALLERY ───────────── */}
        <Box
          ref={galleryRef}
          sx={{
            position: "relative",
            bgcolor: "#faf6ef",
            py: { xs: 5, md: 7 },
            px: { xs: 2, sm: 3, md: 6 },
          }}
        >
          <Box sx={{ maxWidth: 1340, mx: "auto" }}>
            <Box sx={{ textAlign: "center", mb: { xs: 2.4, md: 3 } }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                  lineHeight: 1,
                  display: "inline-block",
                  backgroundImage:
                    "linear-gradient(90deg, #320953 0%, #caa6ff 25%, #5f02ab 50%, #caa6ff 75%, #320953 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  opacity: galleryInView ? 1 : 0,
                  animation: galleryInView
                    ? "scriptRise 800ms cubic-bezier(.2,.7,.2,1) both, cursiveShimmer 6s linear 800ms infinite"
                    : "none",
                }}
              >
                Klong
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 700,
                  letterSpacing: { xs: "0.12em", md: "0.15em" },
                  color: "#320953",
                  fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.1rem" },
                  lineHeight: 1,
                  mt: 0.4,
                }}
              >
                {"GALLERY".split("").map((ch, i) => (
                  <Box
                    key={i}
                    component="span"
                    sx={{
                      display: "inline-block",
                      opacity: galleryInView ? 1 : 0,
                      animation: galleryInView
                        ? `letterRise 600ms cubic-bezier(.2,.7,.2,1) ${250 + i * 55}ms both`
                        : "none",
                    }}
                  >
                    {ch}
                  </Box>
                ))}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
                gap: { xs: 1, md: 1.4 },
              }}
            >
              {([
                { src: "/images/bar/gallery-cocktail-white.jpg", alt: "Signature cocktail at Klong Lounge", pos: "center", fit: "cover" },
                { src: "/images/bar/gallery-cocktail-red.jpg", alt: "Red cocktail at the Klong bar", pos: "center", fit: "cover" },
                { src: "/images/bar/gallery-backbar.jpg", alt: "Back bar and bottle display at Klong Lounge", pos: "center", fit: "cover" },
                { src: "/images/bar/gallery-bottles.jpg", alt: "Spirits lined up at Klong Lounge", pos: "center", fit: "cover" },
                { src: "/images/bar/gallery-sign.jpg", alt: "Klong sign above the bar", pos: "center", fit: "cover" },
                { src: "/images/bar/bar.jpg",        alt: "Klong Lounge bar setting",          pos: "center top",    fit: "cover"   },
                { src: "/images/bar/bar3.jpg",       alt: "Bar counter at Klong Lounge",       pos: "center top",    fit: "cover"   },
                { src: "/images/dine/dine10.jpeg",   alt: "Cocktail close-up at Klong Lounge", pos: "center",        fit: "contain" },
                { src: "/images/bar/klongbar.jpg",   alt: "Klong Lounge ambience",             pos: "center top",    fit: "cover"   },
                { src: "/images/bar/masthead1.jpeg", alt: "Klong Lounge atmosphere",           pos: "center top",    fit: "cover"   },
                { src: "/images/bar/masthead2.jpeg", alt: "Klong Lounge evening view",         pos: "center top",    fit: "contain" },
              ] as const).map((img, i) => (
                <Box
                  key={img.src}
                  sx={{
                    position: "relative",
                    minHeight: { xs: 160, sm: 220, md: 280 },
                    overflow: "hidden",
                    cursor: "pointer",
                    opacity: galleryInView ? 1 : 0,
                    transform: galleryInView ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 800ms ease ${300 + i * 120}ms, transform 800ms ease ${300 + i * 120}ms`,
                    "& > img, & img": {
                      transition: "transform 700ms cubic-bezier(.2,.7,.2,1)",
                    },
                    "&:hover > img, &:hover img": {
                      transform: "scale(1.08)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "60%",
                      height: "100%",
                      background:
                        "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                      transform: "translateX(-120%) rotate(10deg)",
                      pointerEvents: "none",
                    },
                    "&:hover::after": {
                      animation: "tileShimmer 1100ms ease-out forwards",
                    },
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: img.fit, objectPosition: img.pos }}
                  />
            </Box>
          ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />

      {/* Mounted at the page root so the popup overlays everything. Submits
          to the same AWS endpoint as the main contact form (lib/contact.ts). */}
      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        source="hotelpoinisuk.com / klong-page"
        title="Reach the Klong Lounge"
        subtitle="Reservations, private events, or a question about a particular cocktail — leave us a note and our team will get back to you shortly."
      />
    </main>
  );
}

(KlongPage as NextPageWithSeo).seo = {
  title: "Klong Lounge",
  description:
    "Klong Lounge at Hotel Poinisuk, Shillong — handcrafted mix cocktails and mocktail shooters inspired by the Khasi tradition of Um Klong. Live music, karaoke and a relaxed atmosphere.",
  keywords:
    "bar Shillong, lounge Shillong, cocktails Shillong, mocktail shooters Shillong, karaoke Shillong, live music Shillong, Klong Lounge, Um Klong",
  ogImage: "/images/og/klong.jpg",
};

export default KlongPage;
