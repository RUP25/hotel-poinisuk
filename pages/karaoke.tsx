// pages/karaoke.tsx
//
// Hotel Poinisuk — Karaoke & Live Events landing page.
//
// Visual language mirrors `pages/klong.tsx` and `pages/dine.tsx`:
//   - Cormorant italic + Cinzel display + Allura script.
//   - Brand palette: deep purple / lavender on cream and on near-black.
//   - Animated hero with drifting light particles and a stage-spotlight glow.
//   - Cinematic in-view animations (cormorantRise, cinzelTrack, dividerGrow…)
//
// What's dynamic:
//   - "Upcoming Nights" loads from the AWS events API at mount. While
//     fetching, skeleton cards show; if the API fails, an empty-state runs
//     without breaking the page.
//
// Lineup edits happen via /admin — no redeploy needed.

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import MicExternalOnOutlinedIcon from "@mui/icons-material/MicExternalOnOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import KaraokeEventCard from "@/components/karaoke/KaraokeEventCard";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";
import { fetchPublicEvents } from "@/lib/events";
import type { EventRecord } from "@/types/events";

// -----------------------------------------------------------------------------
// Brand tokens — kept local so this file is self-contained.
// -----------------------------------------------------------------------------

const BRAND_DEEP = "#320953";
const BRAND_PURPLE = "#5f02ab";
const BRAND_LAVENDER = "#caa6ff";
const BRAND_CREAM = "#faf6ef";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns true if the event is today or in the future.
 * We compare local Shillong dates to avoid UTC drift.
 */
function isUpcoming(iso: string): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return iso >= today;
}

// =============================================================================
// Page
// =============================================================================

const KaraokePage: NextPageWithSeo = () => {
  const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
  const cinzel =
    "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
  const script =
    "var(--font-allura), 'Great Vibes', 'Brush Script MT', cursive";
  const montserrat =
    "var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif";

  // Section refs for IntersectionObserver-driven entry animations.
  const storyRef = useRef<HTMLDivElement | null>(null);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [storyInView, setStoryInView] = useState(false);
  const [eventsInView, setEventsInView] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);

  const [contactOpen, setContactOpen] = useState(false);

  // Dynamic events.
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchPublicEvents();
      if (cancelled) return;
      setEvents(list);
      setEventsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // In-view triggers for each section.
  useEffect(() => {
    const targets: Array<[
      React.RefObject<HTMLDivElement | null>,
      React.Dispatch<React.SetStateAction<boolean>>
    ]> = [
      [storyRef, setStoryInView],
      [eventsRef, setEventsInView],
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

  // Sort: highlighted first, then by date ascending. Filter out past events.
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((e) => isUpcoming(e.date))
      .sort((a, b) => {
        if (a.isHighlighted !== b.isHighlighted) {
          return a.isHighlighted ? -1 : 1;
        }
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.startTime || "").localeCompare(b.startTime || "");
      });
  }, [events]);

  return (
    <main>
      <Box
        sx={{
          bgcolor: BRAND_CREAM,
          // ─── Page-wide keyframes (mirror klong.tsx / dine.tsx vocabulary) ───
          "@keyframes glowDrift": {
            "0%": { transform: "translateX(-8%)", opacity: 0.22 },
            "50%": { transform: "translateX(10%)", opacity: 0.4 },
            "100%": { transform: "translateX(-8%)", opacity: 0.22 },
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
          "@keyframes cursiveShimmer": {
            "0%": { backgroundPosition: "200% 50%" },
            "100%": { backgroundPosition: "-200% 50%" },
          },
          // Stage-mic spotlight: a soft halo that gently pulses behind the title.
          "@keyframes spotlightPulse": {
            "0%, 100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 0.55 },
            "50%": { transform: "translate(-50%, -50%) scale(1.12)", opacity: 0.85 },
          },
          // Audio-equaliser bars at the bottom of the hero.
          "@keyframes eqBar": {
            "0%, 100%": { transform: "scaleY(0.35)" },
            "50%":      { transform: "scaleY(1)" },
          },
          // Sound-wave concentric rings around the mic icon.
          "@keyframes ripple": {
            "0%":   { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0.6 },
            "100%": { transform: "translate(-50%, -50%) scale(1.8)", opacity: 0 },
          },
          // Card hover lift.
          "@keyframes cardLift": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%":      { transform: "translateY(-4px)" },
          },
          "@keyframes tileShimmer": {
            "0%": { transform: "translateX(-120%) rotate(10deg)", opacity: 0 },
            "30%": { opacity: 0.7 },
            "100%": { transform: "translateX(120%) rotate(10deg)", opacity: 0 },
          },
          // Floating note particles in the hero.
          "@keyframes noteFloat": {
            "0%":   { transform: "translateY(0) rotate(0deg)",   opacity: 0 },
            "10%":  { opacity: 0.95 },
            "90%":  { opacity: 0.7 },
            "100%": { transform: "translateY(-180px) rotate(14deg)", opacity: 0 },
          },
        }}
      >
        {/* ────────────────────────── HERO ────────────────────────── */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "100vh", sm: "105vh", md: "115vh" },
            overflow: "hidden",
            bgcolor: "#05070b",
          }}
        >
          {/* Background photo — sits behind everything; we re-use a Klong/dine
              image until a karaoke-specific hero is shot. The user can drop
              a new photo in /public/images/karaoke/ and update the src. */}
          <Box sx={{ position: "absolute", inset: 0 }}>
            <Image
              src="/images/dine/dine11.jpeg"
              alt="Live karaoke night at Hotel Poinisuk"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                filter:
                  "brightness(1.05) contrast(1.05) saturate(1.08) hue-rotate(-6deg)",
              }}
            />
          </Box>

          {/* Night gradient + vignette (lifted from klong.tsx for consistency). */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,11,0.24) 0%, rgba(8,6,18,0.14) 35%, rgba(20,8,40,0.20) 70%, rgba(5,4,16,0.34) 100%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.16) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Spotlight halo behind the centre — animated pulse. */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: { xs: "44%", md: "46%" },
              width: { xs: 460, sm: 620, md: 820, lg: 1000 },
              height: { xs: 460, sm: 620, md: 820, lg: 1000 },
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(202,166,255,0.32) 0%, rgba(95,2,171,0.18) 30%, rgba(95,2,171,0) 65%)",
              filter: "blur(18px)",
              animation: "spotlightPulse 6s ease-in-out infinite",
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />

          {/* Floating music notes */}
          {[
            { left: "10%", delay: 0,   dur: 11, size: 22 },
            { left: "20%", delay: 2.4, dur: 13, size: 16 },
            { left: "30%", delay: 5.1, dur: 12, size: 26 },
            { left: "45%", delay: 1.6, dur: 14, size: 20 },
            { left: "60%", delay: 3.8, dur: 11, size: 18 },
            { left: "75%", delay: 0.8, dur: 13, size: 24 },
            { left: "88%", delay: 4.2, dur: 12, size: 20 },
          ].map((n, i) => (
            <Box
              key={`note-${i}`}
              sx={{
                position: "absolute",
                bottom: -40,
                left: n.left,
                color: "rgba(202,166,255,0.85)",
                animation: `noteFloat ${n.dur}s ease-in-out ${n.delay}s infinite`,
                pointerEvents: "none",
                filter: "drop-shadow(0 0 8px rgba(202,166,255,0.55))",
                mixBlendMode: "screen",
              }}
            >
              <MusicNoteOutlinedIcon sx={{ fontSize: n.size }} />
            </Box>
          ))}

          {/* ─────── Hero content ─────── */}
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
              zIndex: 2,
            }}
          >
            {/* Mic icon with concentric ripples */}
            <Box
              sx={{
                position: "relative",
                width: { xs: 80, sm: 96, md: 112 },
                height: { xs: 80, sm: 96, md: 112 },
                mb: { xs: 2, sm: 2.4, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                animation: "cormorantRise 900ms cubic-bezier(.2,.7,.2,1) 200ms both",
              }}
            >
              {[0, 0.6, 1.2].map((delay, i) => (
                <Box
                  key={`ripple-${i}`}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "1px solid rgba(202,166,255,0.55)",
                    animation: `ripple 2.6s ease-out ${delay}s infinite`,
                  }}
                />
              ))}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "radial-gradient(circle, rgba(202,166,255,0.3) 0%, rgba(95,2,171,0.18) 60%, rgba(95,2,171,0) 100%)",
                }}
              >
                <MicExternalOnOutlinedIcon
                  sx={{
                    fontSize: { xs: 44, sm: 52, md: 60 },
                    color: "#fff",
                    filter: "drop-shadow(0 0 16px rgba(202,166,255,0.85))",
                  }}
                />
              </Box>
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 500,
                color: "#fff",
                fontSize: {
                  xs: "2.8rem",
                  sm: "4rem",
                  md: "5.4rem",
                  lg: "6.4rem",
                  xl: "7rem",
                },
                lineHeight: 1,
                letterSpacing: "0.005em",
                textShadow:
                  "0 4px 30px rgba(50,9,83,0.55), 0 2px 6px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 500ms both",
              }}
            >
              Live &amp; Karaoke
            </Typography>

            {/* Divider w/ diamond */}
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
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 1000ms both",
                }}
              />
              <Box sx={{ position: "relative", width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 } }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: BRAND_LAVENDER,
                    boxShadow: "0 0 14px rgba(202,166,255,0.85)",
                    animation:
                      "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1300ms both",
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
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 1000ms both",
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
                  "cinzelTrack 1100ms cubic-bezier(.2,.7,.2,1) 1500ms both",
              }}
            >
              At Klong Lounge &amp; Dopwái
            </Typography>

            {/* Audio EQ bars at the bottom */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: { xs: 0.6, md: 0.8 },
                height: { xs: 40, md: 56 },
                mt: { xs: 4, md: 5 },
                opacity: 0,
                animation: "cormorantRise 900ms cubic-bezier(.2,.7,.2,1) 1900ms both",
              }}
            >
              {[0.2, 0.6, 1.0, 0.8, 0.4, 0.9, 0.5, 1.0, 0.7, 0.3, 0.85, 0.55].map(
                (h, i) => (
                  <Box
                    key={`bar-${i}`}
                    sx={{
                      width: { xs: 3, md: 4 },
                      height: `${h * 100}%`,
                      bgcolor: BRAND_LAVENDER,
                      borderRadius: 1,
                      transformOrigin: "bottom",
                      animation: `eqBar ${0.7 + (i % 4) * 0.15}s ease-in-out ${i * 0.07}s infinite`,
                      boxShadow: "0 0 8px rgba(202,166,255,0.65)",
                    }}
                  />
                )
              )}
            </Box>
          </Box>
        </Box>

        {/* ────────────────────────── STORY ────────────────────────── */}
        <Box
          ref={storyRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2.4, md: 5 },
            textAlign: "center",
            bgcolor: BRAND_CREAM,
            overflow: "hidden",
          }}
        >
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
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                fontFamily: script,
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
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
              Where the city sings
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: cinzel,
                fontWeight: 700,
                color: BRAND_DEEP,
                fontSize: { xs: "1.4rem", sm: "1.9rem", md: "2.4rem", lg: "2.7rem" },
                letterSpacing: { xs: "0.10em", sm: "0.12em", md: "0.14em" },
                lineHeight: 1.05,
                mb: { xs: 1.6, md: 2.2 },
                mt: 0.6,
              }}
            >
              {"LIVE MUSIC & KARAOKE NIGHTS".split("").map((ch, i) => (
                <Box
                  key={i}
                  component="span"
                  sx={{
                    display: "inline-block",
                    whiteSpace: ch === " " ? "pre" : "normal",
                    opacity: storyInView ? 1 : 0,
                    animation: storyInView
                      ? `letterRise 600ms cubic-bezier(.2,.7,.2,1) ${200 + i * 32}ms both`
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
                    bgcolor: BRAND_PURPLE,
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
                color: BRAND_DEEP,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                lineHeight: 1.45,
                mb: { xs: 1.6, md: 2 },
                opacity: storyInView ? 1 : 0,
                animation: storyInView
                  ? "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1100ms both"
                  : "none",
              }}
            >
              Shillong is a music city — and at Hotel Poinisuk, the song never quite stops
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
              From{" "}
              <Box component="em" sx={{ fontStyle: "italic", color: BRAND_PURPLE, fontWeight: 600 }}>
                karaoke nights
              </Box>{" "}
              at Klong Lounge to{" "}
              <Box component="em" sx={{ fontStyle: "italic", color: BRAND_PURPLE, fontWeight: 600 }}>
                live acoustic sets
              </Box>{" "}
              at Dopwái — Hotel Poinisuk hosts a curated calendar of music nights with
              500+ Hindi, English, Khasi, and Bollywood-pop tracks, a generous stage, and
              a crowd that knows how to cheer. Walk in, sign up, and have the room sing
              your chorus back to you.
            </Typography>
          </Box>
        </Box>

        {/* ────────────────────── UPCOMING EVENTS ────────────────────── */}
        <Box
          ref={eventsRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2, sm: 3, md: 6, lg: 8 },
            bgcolor: "#0e1116",
            overflow: "hidden",
          }}
        >
          {/* Ambient glows */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 18% 30%, rgba(202,166,255,0.16) 0%, rgba(202,166,255,0) 45%)",
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

          <Box sx={{ position: "relative", maxWidth: 1240, mx: "auto" }}>
            {/* Section header */}
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: script,
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                  lineHeight: 1,
                  display: "inline-block",
                  backgroundImage:
                    "linear-gradient(90deg, #caa6ff 0%, #fff 35%, #caa6ff 65%, #5f02ab 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  opacity: eventsInView ? 1 : 0,
                  animation: eventsInView
                    ? "scriptRise 800ms cubic-bezier(.2,.7,.2,1) both, cursiveShimmer 6s linear 800ms infinite"
                    : "none",
                }}
              >
                What's on
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: { xs: "1.6rem", sm: "2.1rem", md: "2.6rem" },
                  letterSpacing: { xs: "0.10em", md: "0.14em" },
                  lineHeight: 1.05,
                  mt: 0.6,
                }}
              >
                {"UPCOMING NIGHTS".split("").map((ch, i) => (
                  <Box
                    key={i}
                    component="span"
                    sx={{
                      display: "inline-block",
                      whiteSpace: ch === " " ? "pre" : "normal",
                      opacity: eventsInView ? 1 : 0,
                      animation: eventsInView
                        ? `letterRise 600ms cubic-bezier(.2,.7,.2,1) ${200 + i * 38}ms both`
                        : "none",
                    }}
                  >
                    {ch}
                  </Box>
                ))}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 1, md: 1.2 },
                  mt: { xs: 1.4, md: 1.8 },
                }}
              >
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 48, sm: 80, md: 110 },
                    background:
                      "linear-gradient(90deg, rgba(202,166,255,0) 0%, #caa6ff 100%)",
                    transformOrigin: "right center",
                    opacity: eventsInView ? 1 : 0,
                    animation: eventsInView
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
                      bgcolor: BRAND_LAVENDER,
                      transform: "translate(-50%, -50%) rotate(45deg)",
                      opacity: eventsInView ? 1 : 0,
                      animation: eventsInView
                        ? "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1300ms both"
                        : "none",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 48, sm: 80, md: 110 },
                    background:
                      "linear-gradient(90deg, #caa6ff 0%, rgba(202,166,255,0) 100%)",
                    transformOrigin: "left center",
                    opacity: eventsInView ? 1 : 0,
                    animation: eventsInView
                      ? "dividerGrow 700ms cubic-bezier(.2,.7,.2,1) 900ms both"
                      : "none",
                  }}
                />
              </Box>

              <Box
                sx={{
                  mt: { xs: 2.4, md: 3 },
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.6,
                  justifyContent: "center",
                  opacity: eventsInView ? 1 : 0,
                  animation: eventsInView
                    ? "cormorantRise 900ms cubic-bezier(.2,.7,.2,1) 1500ms both"
                    : "none",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => setContactOpen(true)}
                  startIcon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: BRAND_PURPLE,
                    color: "#fff",
                    fontFamily: cinzel,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    fontSize: { xs: "0.74rem", md: "0.82rem" },
                    textTransform: "uppercase",
                    px: { xs: 2.6, md: 3.2 },
                    py: { xs: 1.05, md: 1.2 },
                    borderRadius: 1.1,
                    boxShadow: "0 6px 18px rgba(95,2,171,0.28)",
                    transition:
                      "background-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
                    "&:hover": {
                      bgcolor: "#76046b",
                      transform: "translateY(-1px)",
                      boxShadow: "0 10px 22px rgba(95,2,171,0.36)",
                    },
                  }}
                >
                  Reserve a Table
                </Button>

                <Button
                  variant="outlined"
                  href="tel:+913647100030"
                  startIcon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: BRAND_LAVENDER,
                    borderColor: BRAND_LAVENDER,
                    fontFamily: cinzel,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    fontSize: { xs: "0.74rem", md: "0.82rem" },
                    textTransform: "uppercase",
                    px: { xs: 2.6, md: 3.2 },
                    py: { xs: 1.05, md: 1.2 },
                    borderRadius: 1.1,
                    borderWidth: 1.5,
                    transition:
                      "background-color 240ms ease, transform 240ms ease, color 240ms ease, border-color 240ms ease",
                    "&:hover": {
                      bgcolor: "rgba(202,166,255,0.08)",
                      borderColor: "#fff",
                      color: "#fff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Call (0364) 7100030
                </Button>
              </Box>
            </Box>

            {/* Events grid / state */}
            {eventsLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                  gap: { xs: 2, md: 3 },
                }}
              >
                {[0, 1, 2].map((i) => (
                  <Box
                    key={`skeleton-${i}`}
                    sx={{
                      height: 260,
                      bgcolor: "rgba(202,166,255,0.06)",
                      border: "1px solid rgba(202,166,255,0.14)",
                      borderRadius: 1.4,
                      animation: "cardLift 2.4s ease-in-out infinite",
                    }}
                  />
                ))}
              </Box>
            ) : upcomingEvents.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: { xs: 4, md: 6 },
                  px: 2,
                  border: "1px solid rgba(202,166,255,0.16)",
                  bgcolor: "rgba(202,166,255,0.04)",
                  maxWidth: 720,
                  mx: "auto",
                  borderRadius: 1.4,
                }}
              >
                <EventAvailableOutlinedIcon
                  sx={{
                    fontSize: { xs: 36, md: 44 },
                    color: BRAND_LAVENDER,
                    mb: 1.5,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: cormorant,
                    fontStyle: "italic",
                    color: "#fff",
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    mb: 0.6,
                  }}
                >
                  Next show is being lined up.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: cormorant,
                    color: "rgba(255,255,255,0.72)",
                    fontSize: { xs: "0.96rem", md: "1.06rem" },
                    lineHeight: 1.7,
                  }}
                >
                  Karaoke nights run regularly at Klong Lounge — reserve a table
                  above or call us for the latest line-up.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                  gap: { xs: 2.4, md: 3 },
                }}
              >
                {upcomingEvents.map((ev, idx) => (
                  <KaraokeEventCard
                    key={ev.id}
                    ev={ev}
                    index={idx}
                    inView={eventsInView}
                    variant="on-dark"
                    cormorant={cormorant}
                    cinzel={cinzel}
                    montserrat={montserrat}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* ────────────────────────── GALLERY ────────────────────────── */}
        <Box
          ref={galleryRef}
          sx={{
            position: "relative",
            py: { xs: 5, md: 7 },
            px: { xs: 2, sm: 3, md: 6 },
            bgcolor: "#0e1116",
          }}
        >
          <Box sx={{ maxWidth: 1340, mx: "auto" }}>
            <Box sx={{ textAlign: "center", mb: { xs: 2.4, md: 3 } }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: cormorant,
                  fontStyle: "italic",
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                  lineHeight: 1,
                  display: "inline-block",
                  backgroundImage:
                    "linear-gradient(90deg, #caa6ff 0%, #fff 35%, #caa6ff 65%, #5f02ab 100%)",
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
                Sights &amp; sounds
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 700,
                  letterSpacing: { xs: "0.12em", md: "0.15em" },
                  color: "#fff",
                  fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.1rem" },
                  lineHeight: 1,
                  mt: 0.4,
                }}
              >
                {"FROM THE STAGE".split("").map((ch, i) => (
                  <Box
                    key={i}
                    component="span"
                    sx={{
                      display: "inline-block",
                      whiteSpace: ch === " " ? "pre" : "normal",
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
              {[
                { kind: "image" as const, src: "/images/live/image1.png" },
                {
                  kind: "video" as const,
                  src: "/images/live/video.mp4",
                },
                {
                  kind: "image" as const,
                  src: "/images/live/image4.png",
                  objectFit: "contain" as const,
                },
                {
                  kind: "video" as const,
                  src: "/images/live/video1.mp4",
                },
                { kind: "image" as const, src: "/images/live/image5.png" },
                {
                  kind: "image" as const,
                  src: "/images/live/image3.png",
                  objectFit: "contain" as const,
                },
              ].map((item, i) => (
                <Box
                  key={`${item.kind}-${item.src}`}
                  sx={{
                    position: "relative",
                    minHeight: { xs: 160, sm: 220, md: 280 },
                    overflow: "hidden",
                    cursor: "pointer",
                    opacity: galleryInView ? 1 : 0,
                    transform: galleryInView ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 800ms ease ${300 + i * 120}ms, transform 800ms ease ${300 + i * 120}ms`,
                    "& img, & video": {
                      transition: "transform 700ms cubic-bezier(.2,.7,.2,1)",
                    },
                    "&:hover img, &:hover video": {
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
                  {item.kind === "video" ? (
                    <video
                      src={item.src}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label="Hotel Poinisuk live music night clip"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt="Hotel Poinisuk live music night"
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 33vw"
                      style={{
                        objectFit:
                          "objectFit" in item ? item.objectFit : "cover",
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        source="hotelpoinisuk.com / karaoke-page"
        title="Reserve a Table"
        subtitle="Booking for an upcoming karaoke or live music night? Leave us a note with your date and party size — our team will confirm shortly."
      />
    </main>
  );
};

KaraokePage.seo = {
  title: "Live Music & Karaoke",
  description:
    "Live karaoke, acoustic sets and DJ nights at Hotel Poinisuk, Shillong. Open-mic Fridays and Saturdays at Klong Lounge with 500+ Hindi, English and Khasi tracks. Sunset sessions Sundays at Dopwái rooftop.",
  keywords:
    "karaoke Shillong, live music Shillong, karaoke night Shillong, open mic Shillong, music venue Shillong, Klong Lounge karaoke, Dopwai live music, Hotel Poinisuk events, things to do Shillong night",
  ogImage: "/images/og/klong.jpg",
};

export default KaraokePage;
