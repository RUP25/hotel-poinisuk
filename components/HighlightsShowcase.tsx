"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import ContactDialog from "@/components/ContactDialog";
import {
  SERIF_DISPLAY,
  SANS_UI,
  PURPLE,
  PURPLE_HOVER,
  LAVENDER,
} from "@/lib/luxury-chrome";

type Highlight = {
  /** Small label above the title, e.g. "ROOFTOP DINING" */
  kicker: string;
  title: string;
  description: string;
  cta: string;
  /** Where the CTA navigates. Omitted when `dialog` is set. */
  href?: string;
  /** When true the CTA opens the contact form popup instead of navigating. */
  dialog?: boolean;
  image: string;
  alt: string;
};

const highlights: Highlight[] = [
  {
    kicker: "Rooftop Dining",
    title: "Dopwai",
    description:
      "Our rooftop kitchen, where multi-cuisine plates meet an open view across the Shillong hills. Breakfast in the light, dinner under the sky.",
    cta: "Explore Dopwai",
    href: "/dine",
    image: "/images/dine/masthead2.jpeg",
    alt: "Dopwai rooftop dining at Hotel Poinisuk",
  },
  {
    kicker: "Lounge & Bar",
    title: "Klong",
    description:
      "Signature pours, a warm low-lit room, and the easy hum of a good evening. Klong is where the night settles in and stays a while.",
    cta: "Step Inside",
    href: "/klong",
    image: "/images/bar/masthead.jpeg",
    alt: "Klong Lounge and bar at Hotel Poinisuk",
  },
  {
    kicker: "Stay",
    title: "Rooms & Suites",
    description:
      "Artisan teak in Khasi wood, soft linens, and warm lighting — from Deluxe to Premium, every room is made for a slow Shillong morning.",
    cta: "View Rooms",
    href: "/rooms",
    image: "/images/rooms/TWIN2.jpg",
    alt: "Well-appointed rooms and suites at Hotel Poinisuk",
  },
  {
    kicker: "Nights",
    title: "Live & Karaoke",
    description:
      "Live sets, open mics, and a room that sings back. Check the lineup and take the mic — the stage is warmed up and waiting.",
    cta: "See What's On",
    href: "/karaoke",
    image: "/images/dine/dine11.jpeg",
    alt: "Live music and karaoke nights at Hotel Poinisuk",
  },
  {
    kicker: "Celebrations",
    title: "Banquet Hall",
    description:
      "Weddings, receptions, and corporate evenings for up to 200 guests, with curated menus from Dopwai and attentive service throughout.",
    cta: "Plan an Event",
    dialog: true,
    image: "/images/banq5.jpeg",
    alt: "Banquet hall set for a celebration at Hotel Poinisuk",
  },
];

/** Shared between the link CTAs and the banquet button CTA. */
const ctaSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1.25,
  bgcolor: PURPLE,
  color: "#fff",
  textDecoration: "none",
  fontFamily: SANS_UI,
  fontWeight: 600,
  fontSize: { xs: "0.66rem", md: "0.72rem" },
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  px: { xs: 2.25, md: 2.75 },
  py: { xs: 1.25, md: 1.4 },
  transition: "background-color 220ms ease, gap 220ms ease",
  "&:hover": { bgcolor: PURPLE_HOVER, gap: 1.75 },
  "&:focus-visible": {
    outline: `2px solid ${LAVENDER}`,
    outlineOffset: 3,
  },
} as const;

const HighlightsShowcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Box
      component="section"
      aria-label="Hotel Poinisuk highlights"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        backgroundColor: "#c4a574",
        backgroundImage: "url(/images/wood-light-tile.png?v=2)",
        backgroundRepeat: "repeat",
        backgroundSize: "789px auto",
        color: "#2a2118",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: { xs: "68%", md: "62%" },
          backgroundImage: "url(/images/garden-mural.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 42%",
          backgroundSize: "cover",
          opacity: 0.72,
          mixBlendMode: "soft-light",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 10%, #000 70%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 10%, #000 70%, transparent 100%)",
          pointerEvents: "none",
        },
        "& > *": { position: "relative", zIndex: 1 },
        // full-bleed out of the parent section's horizontal padding
        mx: { xs: -2, sm: -3, md: -6 },
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 6, md: 9 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        {/* ── Header ── */}
        <Box sx={{ textAlign: "center", mb: { xs: 4.5, md: 6.5 } }}>
          <Typography
            component="p"
            sx={{
              fontFamily: SANS_UI,
              fontWeight: 600,
              fontSize: { xs: "0.6rem", md: "0.68rem" },
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: PURPLE,
              pl: "0.34em",
              mb: { xs: 2, md: 2.5 },
            }}
          >
            Five Ways In
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: SERIF_DISPLAY,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3.1rem", lg: "3.5rem" },
              lineHeight: 1.2,
              color: "#36454F",
            }}
          >
            Best Hotel in Shillong
            <br />
            Why Do We Say So?
          </Typography>

          <Box
            aria-hidden
            sx={{
              width: { xs: 200, md: 280 },
              height: "1px",
              mx: "auto",
              my: { xs: 2.25, md: 3 },
              background: `linear-gradient(90deg, rgba(95,2,171,0) 0%, ${PURPLE} 50%, rgba(95,2,171,0) 100%)`,
            }}
          />

          <Typography
            component="p"
            sx={{
              fontFamily: SERIF_DISPLAY,
              fontWeight: 500,
              fontSize: { xs: "1rem", md: "1.3rem" },
              lineHeight: 1.6,
              color: "#36454F",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Designed for Shillong, made at Poinisuk. Each room features
            artisan-made teak furniture in Khasi wood, layered with soft linens,
            warm lighting, and amenities that matter&mdash;tea/coffee makers,
            speedy Wi-Fi, and heating in select categories.
          </Typography>

          <Typography
            component="p"
            sx={{
              fontFamily: SANS_UI,
              fontSize: { xs: "0.72rem", md: "0.76rem" },
              letterSpacing: "0.04em",
              lineHeight: 1.6,
              color: PURPLE,
              maxWidth: 560,
              mx: "auto",
              mt: { xs: 2.5, md: 3 },
            }}
          >
            Hover or tap any panel to open it. Each one leads into a different
            corner of Hotel Poinisuk.
          </Typography>
        </Box>

        {/* ── Expanding panels ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 1.25, md: 1.5 },
            height: { md: 470, lg: 530 },
          }}
        >
          {highlights.map((item, index) => {
            const isActive = index === active;
            const number = String(index + 1).padStart(2, "0");

            return (
              <Box
                key={item.title}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${item.title} — ${item.kicker}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(index);
                  }
                }}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "4px",
                  cursor: "pointer",
                  flexShrink: 0,
                  outline: "none",
                  border: isActive
                    ? "1px solid rgba(202,166,255,0.34)"
                    : "1px solid rgba(202,166,255,0.12)",
                  // Horizontal accordion on md+, vertical stack on small screens
                  width: { xs: "100%", md: isActive ? "52%" : "12%" },
                  height: { xs: isActive ? 400 : 72, md: "100%" },
                  transition:
                    "width 620ms cubic-bezier(.4,0,.2,1), height 520ms cubic-bezier(.4,0,.2,1), border-color 400ms ease",
                  "&:focus-visible": {
                    borderColor: LAVENDER,
                    boxShadow: `0 0 0 2px rgba(202,166,255,0.45)`,
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                  },
                }}
              >
                {/* Background image */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width:900px) 100vw, 55vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />

                {/* Legibility scrim — heavier while collapsed */}
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(180deg, rgba(12,8,21,0.15) 0%, rgba(12,8,21,0.30) 45%, rgba(12,8,21,0.88) 100%)"
                      : "linear-gradient(180deg, rgba(12,8,21,0.72) 0%, rgba(12,8,21,0.86) 100%)",
                    transition: "background 520ms ease",
                  }}
                />

                {/* Index number — centred while collapsed, top-left once open.
                    On mobile it rides inside the collapsed label instead. */}
                <Typography
                  aria-hidden
                  sx={{
                    position: "absolute",
                    top: { xs: 22, md: 22 },
                    left: isActive ? { xs: 24, md: 32 } : 0,
                    right: isActive ? "auto" : 0,
                    textAlign: "center",
                    fontFamily: SERIF_DISPLAY,
                    fontStyle: "italic",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    letterSpacing: "0.1em",
                    color: isActive ? LAVENDER : "rgba(244,238,254,0.55)",
                    transition: "color 400ms ease",
                    display: { xs: isActive ? "block" : "none", md: "block" },
                  }}
                >
                  {number}
                </Typography>

                {/* ── Collapsed label ── */}
                <Box
                  aria-hidden={isActive}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "center" },
                    px: { xs: 2.5, md: 0 },
                    pb: { md: 4 },
                    opacity: isActive ? 0 : 1,
                    pointerEvents: "none",
                    transition: "opacity 300ms ease",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.5, md: 1.75 },
                      // vertical, reading bottom-to-top, on md+
                      writingMode: { xs: "horizontal-tb", md: "vertical-rl" },
                      transform: { xs: "none", md: "rotate(180deg)" },
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: SANS_UI,
                        fontWeight: 600,
                        fontSize: { xs: "0.55rem", md: "0.58rem" },
                        letterSpacing: "0.26em",
                        textTransform: "uppercase",
                        color: "rgba(244,238,254,0.55)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box component="span" sx={{ display: { md: "none" } }}>
                        {`${number}  ·  `}
                      </Box>
                      {item.kicker}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        fontFamily: SERIF_DISPLAY,
                        fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: { xs: "1.15rem", md: "1.3rem" },
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </Box>

                {/* ── Expanded content ── */}
                <Box
                  aria-hidden={!isActive}
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    p: { xs: 3, md: 4, lg: 4.5 },
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                    transition: isActive
                      ? "opacity 420ms ease 220ms"
                      : "opacity 180ms ease",
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      fontFamily: SANS_UI,
                      fontWeight: 600,
                      fontSize: { xs: "0.58rem", md: "0.62rem" },
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: LAVENDER,
                      pl: "0.3em",
                      mb: 1,
                    }}
                  >
                    {item.kicker}
                  </Typography>

                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: SERIF_DISPLAY,
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontSize: { xs: "1.75rem", md: "2.3rem", lg: "2.6rem" },
                      lineHeight: 1.15,
                      color: "#fff",
                      mb: { xs: 1.25, md: 1.5 },
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    component="p"
                    sx={{
                      fontFamily: SANS_UI,
                      fontSize: { xs: "0.82rem", md: "0.9rem" },
                      lineHeight: 1.65,
                      color: "rgba(244,238,254,0.78)",
                      maxWidth: 460,
                      mb: { xs: 2.25, md: 2.75 },
                    }}
                  >
                    {item.description}
                  </Typography>

                  {item.dialog ? (
                    <Box
                      component="button"
                      type="button"
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e: React.MouseEvent) => {
                        // don't let the panel's own click handler swallow it
                        e.stopPropagation();
                        setContactOpen(true);
                      }}
                      sx={{ ...ctaSx, border: "none", cursor: "pointer" }}
                    >
                      {item.cta}
                      <Box component="span" aria-hidden sx={{ lineHeight: 1 }}>
                        →
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      component={Link}
                      href={item.href ?? "/"}
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      sx={ctaSx}
                    >
                      {item.cta}
                      <Box component="span" aria-hidden sx={{ lineHeight: 1 }}>
                        →
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Banquet enquiries. Posts to the same AWS endpoint as the "Keep In
          Touch" section — both route through lib/contact.ts. */}
      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        source="hotelpoinisuk.com / banquet-showcase"
        title="Plan Your Event"
        subtitle="Weddings, receptions, or a corporate evening — tell us what you have in mind and our banquet team will get back to you shortly."
        defaultSubject="Banquet Hall enquiry"
      />
    </Box>
  );
};

export default HighlightsShowcase;
