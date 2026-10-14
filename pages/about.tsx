// pages/about.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Box,
  Container,
  Typography,
  GlobalStyles,
  useMediaQuery,
} from "@mui/material";
import Footer from "@/components/Footer";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SSR-safe slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

/* ────────── brand typography ────────── */
const serif = "var(--font-cormorant), 'Playfair Display', 'Georgia', 'Times New Roman', serif";
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";

const AboutPage: NextPageWithSeo = () => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const aboutSlides = ["/images/image5.webp", "/images/image6.webp", "/images/about2.jpg"];

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: reduceMotion ? 0 : 600,
      autoplay: !reduceMotion,
      autoplaySpeed: 3500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      pauseOnHover: true,
      adaptiveHeight: false,
    }),
    [reduceMotion]
  );

  /* parallax + scroll reveals */
  const [parallaxY, setParallaxY] = useState(0);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [storyInView, setStoryInView] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setParallaxY(window.scrollY * 0.28);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets: Array<[
      React.RefObject<HTMLDivElement | null>,
      React.Dispatch<React.SetStateAction<boolean>>
    ]> = [
      [storyRef, setStoryInView],
      [galleryRef, setGalleryInView],
    ];
    const observers: IntersectionObserver[] = [];
    targets.forEach(([ref, setter]) => {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setter(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.16 }
      );
      observer.observe(node);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main>
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          body: { margin: 0, overflowX: "hidden" },
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },
          ".slick-slider": { height: "100%" },
          ".slick-list": { height: "100%" },
          ".slick-track": { height: "100%", display: "flex" },
          ".slick-slide": { height: "auto" },
          ".slick-slide > div": { height: "100%", width: "100%" },
        }}
      />

      <Box
        sx={{
          bgcolor: "#faf6ef",
          "@keyframes cormorantRise": {
            "0%": {
              opacity: 0,
              transform: "translateY(22px) scale(0.985)",
              filter: "blur(6px)",
            },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
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
          "@keyframes breatheOrb": {
            "0%, 100%": { transform: "scale(1)", opacity: 0.18 },
            "50%": { transform: "scale(1.08)", opacity: 0.32 },
          },
          "@keyframes memoryRise": {
            "0%": { transform: "translate(0, 0) scale(0.5)", opacity: 0 },
            "12%": { transform: "translate(2px, -22px) scale(1.1)", opacity: 0.85 },
            "55%": { transform: "translate(-6px, -120px) scale(1)", opacity: 0.75 },
            "90%": { opacity: 0.45 },
            "100%": { transform: "translate(4px, -260px) scale(0.85)", opacity: 0 },
          },
          "@keyframes memoryRiseAlt": {
            "0%": { transform: "translate(0, 0) scale(0.5)", opacity: 0 },
            "10%": { transform: "translate(-3px, -18px) scale(1.15)", opacity: 0.9 },
            "60%": { transform: "translate(8px, -130px) scale(1)", opacity: 0.7 },
            "100%": { transform: "translate(-2px, -300px) scale(0.8)", opacity: 0 },
          },
          "@keyframes memoryTwinkle": {
            "0%, 100%": { filter: "brightness(1) blur(0)" },
            "50%": { filter: "brightness(1.6) blur(0.4px)" },
          },
        }}
      >
        {/* ───────────── HERO ───────────── */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "78vh", sm: "82vh", md: "88vh" },
            overflow: "hidden",
            bgcolor: "#05070b",
          }}
        >
          {/* Parallax background photo */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              willChange: "transform",
              transform: `translateY(${parallaxY}px)`,
              transition: "transform 90ms linear",
            }}
          >
            <Image
              src="/images/image4.jpg"
              alt="Hotel Poinisuk — panoramic view"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center 35%",
                filter: "brightness(0.78) contrast(1.10) saturate(1.02)",
              }}
            />
          </Box>

          {/* Night-tone gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,11,0.46) 0%, rgba(8,6,18,0.30) 35%, rgba(20,8,40,0.36) 70%, rgba(5,4,16,0.55) 100%)",
            }}
          />

          {/* Vignette */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.40) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ─────── About signature: large breathing purple orbs ─────── */}
          {[
            { left: "12%", top: "22%", size: 240, dur: 11, delay: 0,   tint: "rgba(202,166,255,0.22)" },
            { left: "78%", top: "60%", size: 320, dur: 14, delay: 2.4, tint: "rgba(95,2,171,0.20)"   },
            { left: "55%", top: "12%", size: 200, dur: 12, delay: 4.8, tint: "rgba(214,196,255,0.18)" },
            { left: "22%", top: "75%", size: 260, dur: 13, delay: 1.5, tint: "rgba(95,2,171,0.16)"   },
          ].map((orb, i) => (
            <Box
              key={`orb-${i}`}
              sx={{
                position: "absolute",
                top: orb.top,
                left: orb.left,
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle at center, ${orb.tint} 0%, rgba(202,166,255,0) 70%)`,
                filter: "blur(20px)",
                animation: `breatheOrb ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* ─────── Slow rising memory particles ─────── */}
          {[
            { left: "8%",  size: 3, dur: 14, delay: 0,   tdur: 2.6, tdelay: 0.2, alt: false, warm: false },
            { left: "16%", size: 4, dur: 16, delay: 3.2, tdur: 3.2, tdelay: 0.6, alt: true,  warm: true  },
            { left: "24%", size: 3, dur: 13, delay: 1.6, tdur: 2.4, tdelay: 1.1, alt: false, warm: false },
            { left: "32%", size: 5, dur: 17, delay: 5.0, tdur: 3.4, tdelay: 0.4, alt: true,  warm: false },
            { left: "40%", size: 3, dur: 15, delay: 2.4, tdur: 2.8, tdelay: 0.9, alt: false, warm: true  },
            { left: "48%", size: 4, dur: 14, delay: 6.2, tdur: 3.0, tdelay: 1.3, alt: true,  warm: false },
            { left: "56%", size: 3, dur: 16, delay: 0.8, tdur: 2.6, tdelay: 0.3, alt: false, warm: false },
            { left: "64%", size: 5, dur: 15, delay: 3.7, tdur: 3.6, tdelay: 1.0, alt: true,  warm: true  },
            { left: "72%", size: 3, dur: 14, delay: 1.2, tdur: 2.4, tdelay: 0.7, alt: false, warm: false },
            { left: "80%", size: 4, dur: 17, delay: 4.6, tdur: 3.2, tdelay: 0.5, alt: true,  warm: false },
            { left: "88%", size: 3, dur: 13, delay: 2.0, tdur: 2.6, tdelay: 1.2, alt: false, warm: true  },
            { left: "94%", size: 5, dur: 15, delay: 5.4, tdur: 3.0, tdelay: 0.6, alt: true,  warm: false },
          ].map((d, i) => {
            const core = d.warm ? "rgba(255,232,196,0.92)" : "rgba(220,200,255,0.9)";
            const glow = d.warm ? "rgba(255,210,160,0.65)" : "rgba(202,166,255,0.65)";
            return (
              <Box
                key={`mem-${i}`}
                sx={{
                  position: "absolute",
                  bottom: -16,
                  left: d.left,
                  width: d.size,
                  height: d.size,
                  borderRadius: "50%",
                  bgcolor: core,
                  boxShadow: `0 0 ${d.size + 6}px ${glow}, 0 0 ${d.size * 2 + 12}px ${glow}`,
                  animation: `${d.alt ? "memoryRiseAlt" : "memoryRise"} ${d.dur}s ease-out ${d.delay}s infinite, memoryTwinkle ${d.tdur}s ease-in-out ${d.tdelay}s infinite`,
                  mixBlendMode: "screen",
                  willChange: "transform, opacity, filter",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* Hero content */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "78vh", sm: "82vh", md: "88vh" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: { xs: 2, sm: 3, md: 4 },
              zIndex: 2,
            }}
          >
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
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 250ms both",
              }}
            >
              About Us
            </Typography>

            {/* Divider */}
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
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
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
                      "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1200ms both",
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
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
                }}
              />
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.45rem" },
                lineHeight: 1.4,
                letterSpacing: "0.02em",
                maxWidth: 720,
                textShadow: "0 2px 14px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1300ms both",
              }}
            >
              Mesmerizing views &amp; modern comfort in the heart of Shillong
            </Typography>
          </Box>
        </Box>

        {/* ───────────── STORY + CAROUSEL ───────────── */}
        <Box
          ref={storyRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2.4, md: 4 },
            bgcolor: "#faf6ef",
            overflow: "hidden",
          }}
        >
          {/* Soft purple ambient glow at top */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(202,166,255,0.18) 0%, rgba(202,166,255,0) 55%)",
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                columnGap: { xs: 0, md: 5, lg: 7 },
                rowGap: { xs: 4, md: 0 },
                alignItems: "center",
              }}
            >
              {/* Text column */}
              <Box
                sx={{
                  gridColumn: { xs: "1 / -1", md: "1 / 2" },
                  opacity: storyInView ? 1 : 0,
                  transform: storyInView ? "translateY(0)" : "translateY(28px)",
                  transition: "opacity 900ms ease 100ms, transform 900ms ease 100ms",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: cinzel,
                    fontWeight: 600,
                    color: "#5f02ab",
                    letterSpacing: "0.28em",
                    fontSize: { xs: "0.72rem", sm: "0.78rem" },
                    lineHeight: 1,
                    mb: 1.6,
                  }}
                >
                  Established 2015
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    fontFamily: cormorant,
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: "#320953",
                    lineHeight: 1.05,
                    fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem", lg: "3.2rem" },
                    letterSpacing: "0.005em",
                    mb: 2,
                  }}
                >
                  Hotel Poinisuk
                </Typography>

                {/* Divider */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 3 }}>
                  <Box
                    sx={{
                      height: "1px",
                      width: { xs: 60, md: 80 },
                      background:
                        "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      bgcolor: "#5f02ab",
                      transform: "rotate(45deg)",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: cormorant,
                    color: "#3f2a2a",
                    fontSize: { xs: "1rem", sm: "1.06rem", md: "1.12rem" },
                    lineHeight: { xs: 1.75, md: 1.85 },
                    mb: 2.5,
                    maxWidth: 640,
                    textAlign: "justify",
                  }}
                >
                  We are a city-center hotel in the heart of Shillong. Blending warm hospitality
                  with modern comforts, Hotel Poinisuk offers well-appointed rooms and thoughtful
                  amenities for both business and leisure travelers. Enjoy Dopwai—our rooftop
                  restaurant—along with a lively bar &amp; lounge, free Wi-Fi, and a banquet hall
                  that hosts up to 200 guests.
                </Typography>

                {/* Signature block */}
                <Box sx={{ mt: 4 }}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      pr: { xs: 3, md: 5 },
                      pb: { xs: 1.5, md: 2 },
                      "@keyframes sigInk": {
                        "0%": { opacity: 0, transform: "rotate(-4deg) translateY(8px)" },
                        "100%": { opacity: 1, transform: "rotate(-4deg) translateY(0)" },
                      },
                      "@keyframes sigDraw": {
                        "0%": { strokeDashoffset: 700 },
                        "100%": { strokeDashoffset: 0 },
                      },
                      "@keyframes sigShimmer": {
                        "0%, 100%": { filter: "drop-shadow(0 1px 0 rgba(58,15,110,0.18))" },
                        "50%": { filter: "drop-shadow(0 2px 6px rgba(95,2,171,0.28))" },
                      },
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        display: "inline-block",
                        fontFamily:
                          "var(--font-allura), 'Great Vibes', 'Pinyon Script', 'Brush Script MT', cursive",
                        fontSize: { xs: "3rem", sm: "3.6rem", md: "4.4rem" },
                        fontWeight: 400,
                        color: "#3a0f6e",
                        lineHeight: 0.92,
                        letterSpacing: "-0.005em",
                        whiteSpace: "nowrap",
                        transform: "rotate(-4deg)",
                        transformOrigin: "left bottom",
                        textShadow:
                          "0 1px 0 rgba(58,15,110,0.18), 0 2px 6px rgba(58,15,110,0.10), 0 0 1px rgba(95,2,171,0.35)",
                        opacity: 0,
                        animation: "sigInk 900ms ease-out 200ms forwards, sigShimmer 4.5s ease-in-out 1.5s infinite",
                        userSelect: "none",
                        WebkitFontSmoothing: "antialiased",
                      }}
                    >
                      O. B. Tariang
                    </Typography>

                    {/* Hand-drawn flourish underline */}
                    <Box
                      component="svg"
                      viewBox="0 0 340 40"
                      preserveAspectRatio="none"
                      sx={{
                        position: "absolute",
                        left: { xs: -4, md: -8 },
                        bottom: { xs: -2, md: -4 },
                        width: { xs: 230, sm: 270, md: 320 },
                        height: { xs: 22, md: 28 },
                        overflow: "visible",
                        pointerEvents: "none",
                      }}
                    >
                      <Box
                        component="path"
                        d="M6 26 C 50 8, 110 34, 170 18 S 260 6, 318 22 Q 332 27, 322 14"
                        sx={{
                          fill: "none",
                          stroke: "#3a0f6e",
                          strokeWidth: 1.7,
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          opacity: 0.78,
                          strokeDasharray: 700,
                          strokeDashoffset: 700,
                          animation: "sigDraw 1.6s cubic-bezier(0.65, 0, 0.35, 1) 700ms forwards",
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: cinzel,
                      fontWeight: 500,
                      color: "#320953",
                      letterSpacing: "0.22em",
                      fontSize: { xs: "0.7rem", md: "0.78rem" },
                      mt: { xs: 1.5, md: 2 },
                    }}
                  >
                    Oni Bilet Tariang — Managing Director
                  </Typography>
                </Box>
              </Box>

              {/* Image carousel */}
              <Box
                sx={{
                  gridColumn: { xs: "1 / -1", md: "2 / 3" },
                  position: "relative",
                  width: "100%",
                  height: { xs: 280, sm: 340, md: 460, lg: 540 },
                  minHeight: 240,
                  opacity: storyInView ? 1 : 0,
                  transform: storyInView ? "translateY(0)" : "translateY(28px)",
                  transition: "opacity 900ms ease 250ms, transform 900ms ease 250ms",
                  boxShadow:
                    "0 1px 2px rgba(50,9,83,0.05), 0 8px 18px rgba(50,9,83,0.10), 0 22px 44px rgba(50,9,83,0.14)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  "& .slick-list, & .slick-track": { height: "100%" },
                  "& .slick-dots": { bottom: 12 },
                  "& .slick-dots li button:before": { color: "#fff", opacity: 0.55, fontSize: 8 },
                  "& .slick-dots li.slick-active button:before": { color: "#caa6ff", opacity: 1 },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    boxShadow: "inset 0 0 0 1px rgba(50,9,83,0.10)",
                    zIndex: 2,
                    borderRadius: "8px",
                  },
                }}
              >
                <Slider {...sliderSettings}>
                  {aboutSlides.map((src, i) => (
                    <Box
                      key={`${src}-${i}`}
                      sx={{ position: "relative", width: "100%", height: "100%" }}
                    >
                      <Image
                        src={src}
                        alt={`About slide ${i + 1}`}
                        fill
                        sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 600px"
                        style={{ objectFit: "cover" }}
                        priority={i === 0}
                        onError={(e) => {
                          (e.currentTarget as any).style.display = "none";
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ───────────── EXPERIENCE HIGHLIGHTS ───────────── */}
        <Box
          ref={galleryRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2, md: 4 },
            bgcolor: "#f6f1e7",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: cormorant,
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "#320953",
                  fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem", lg: "3rem" },
                  lineHeight: 1.05,
                  letterSpacing: "0.005em",
                  mb: 1.6,
                  opacity: galleryInView ? 1 : 0,
                  animation: galleryInView
                    ? "cormorantRise 900ms cubic-bezier(.2,.7,.2,1) both"
                    : "none",
                }}
              >
                Experience Highlights
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.2,
                  mb: 2.4,
                  opacity: galleryInView ? 1 : 0,
                  transform: galleryInView ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 700ms ease 250ms, transform 700ms ease 250ms",
                }}
              >
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 50, md: 80 },
                    background:
                      "linear-gradient(90deg, rgba(95,2,171,0) 0%, #5f02ab 100%)",
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#5f02ab",
                    transform: "rotate(45deg)",
                  }}
                />
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 50, md: 80 },
                    background:
                      "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontFamily: cormorant,
                  color: "#3f2a2a",
                  fontSize: { xs: "0.98rem", sm: "1.06rem", md: "1.12rem" },
                  lineHeight: 1.7,
                  maxWidth: 760,
                  mx: "auto",
                  opacity: galleryInView ? 1 : 0,
                  transform: galleryInView ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 700ms ease 350ms, transform 700ms ease 350ms",
                }}
              >
                Rooftop dining at Dopwai, elegant rooms &amp; suites, and a lively bar and lounge—crafted
                for memorable stays.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: { xs: 2.4, sm: 3, md: 3.6 },
              }}
            >
              {[
                { src: "/images/dine/dine9.jpeg", alt: "Dopwai Rooftop", caption: "Dopwai Rooftop Restaurant", href: "/dine" },
                { src: "/images/rooms/masthead.jpg", alt: "Rooms", caption: "Deluxe & Premium Rooms", href: "/rooms" },
                { src: "/images/bar/masthead1.jpeg", alt: "Bar", caption: "Bar & Lounge", href: "/klong" },
              ].map((card, idx) => (
                <Box
                  key={idx}
                  component={Link}
                  href={card.href}
                  aria-label={card.caption}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "10px",
                    height: { xs: 220, sm: 260, md: 300, lg: 340 },
                    cursor: "pointer",
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "none",
                    transformStyle: "preserve-3d",
                    transform: galleryInView
                      ? "perspective(1400px) rotateX(0deg) translateY(0)"
                      : "perspective(1400px) rotateX(0deg) translateY(28px)",
                    opacity: galleryInView ? 1 : 0,
                    transition: `opacity 850ms cubic-bezier(.2,.7,.2,1) ${idx * 130}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${idx * 130}ms, box-shadow 420ms ease, border-color 320ms ease`,
                    "& .zoom-img": {
                      transform: "scale(1)",
                      transition: "transform 800ms cubic-bezier(.2,.8,.2,1)",
                    },
                    "&:hover": {
                      transform:
                        "perspective(1400px) rotateX(2.2deg) translateY(-8px) scale(1.012)",
                      boxShadow: "none",
                      borderColor: "rgba(0,0,0,0.12)",
                    },
                    "&:hover .zoom-img": { transform: "scale(1.08)" },
                    "&:focus-visible": {
                      outline: "2px solid rgba(95,2,171,0.55)",
                      outlineOffset: "3px",
                    },
                  }}
                >
                  <Image
                    className="zoom-img"
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(min-width:1200px) 380px, (min-width:900px) 33vw, (min-width:600px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(50,9,83,0.62) 0%, rgba(50,9,83,0.18) 50%, rgba(50,9,83,0) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Top edge highlight */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: { xs: 18, md: 22 },
                      bottom: { xs: 16, md: 18 },
                      right: { xs: 18, md: 22 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: cinzel,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.14em",
                        fontSize: { xs: "0.86rem", sm: "0.95rem", md: "1.02rem" },
                        textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                      }}
                    >
                      {card.caption}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        height: "1px",
                        width: 40,
                        background:
                          "linear-gradient(90deg, #caa6ff 0%, rgba(202,166,255,0) 100%)",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </main>
  );
};

AboutPage.seo = {
  title: "About Us",
  description:
    "Learn about Hotel Poinisuk—established in 2015, offering warm hospitality and modern comforts in the heart of Shillong. Discover our story, values, and commitment to excellence.",
  keywords:
    "about Hotel Poinisuk, Shillong hotel history, hotel management Shillong",
  ogImage: "/images/og/about.jpg",
  schema: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Hotel Poinisuk",
    url: "https://www.hotelpoinisuk.com/about",
    description:
      "Learn about Hotel Poinisuk—established in 2015, offering warm hospitality and modern comforts in the heart of Shillong.",
    mainEntity: { "@id": "https://www.hotelpoinisuk.com#hotel" },
    isPartOf: { "@id": "https://www.hotelpoinisuk.com#website" },
    inLanguage: "en-IN",
  },
};

export default AboutPage;
