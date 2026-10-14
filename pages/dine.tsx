import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import LandscapeOutlinedIcon from "@mui/icons-material/LandscapeOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

const DinePage: NextPageWithSeo = () => {
  const serif = "var(--font-cormorant), 'Playfair Display', 'Georgia', 'Times New Roman', serif";
  const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
  const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
  const [instaInView, setInstaInView] = useState(false);
  const instaRef = useRef<HTMLDivElement | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const node = instaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInstaInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Box
        sx={{
          bgcolor: "#faf6ef",
          "@keyframes glowDrift": {
            "0%": { transform: "translateX(-8%)", opacity: 0.22 },
            "50%": { transform: "translateX(10%)", opacity: 0.38 },
            "100%": { transform: "translateX(-8%)", opacity: 0.22 },
          },
          "@keyframes heroReveal": {
            "0%": { opacity: 0, transform: "translateY(24px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes cormorantRise": {
            "0%": { opacity: 0, transform: "translateY(22px) scale(0.985)", filter: "blur(6px)" },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          },
          "@keyframes cinzelTrack": {
            "0%": { opacity: 0, letterSpacing: "0.05em", transform: "translateY(10px)" },
            "100%": { opacity: 1, letterSpacing: "0.32em", transform: "translateY(0)" },
          },
          "@keyframes heroDividerGrow": {
            "0%": { transform: "scaleX(0)", opacity: 0 },
            "100%": { transform: "scaleX(1)", opacity: 1 },
          },
          "@keyframes heroDiamondPop": {
            "0%": { transform: "rotate(0deg) scale(0)", opacity: 0 },
            "70%": { transform: "rotate(45deg) scale(1.3)", opacity: 1 },
            "100%": { transform: "rotate(45deg) scale(1)", opacity: 1 },
          },
          "@keyframes card3DHover": {
            "0%": { transform: "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)" },
            "50%": { transform: "perspective(1200px) rotateY(-3.2deg) rotateX(2deg) scale(1.02)" },
            "100%": { transform: "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)" },
          },
          "@keyframes leafSway": {
            "0%, 100%": { transform: "rotate(-6deg)" },
            "50%": { transform: "rotate(6deg)" },
          },
          "@keyframes emberDrift": {
            "0%":   { transform: "translate(0, 0) scale(0.6)",        opacity: 0 },
            "10%":  { transform: "translate(2px, -10px) scale(1)",    opacity: 0.9 },
            "50%":  { transform: "translate(10px, -55px) scale(1.05)", opacity: 0.95 },
            "85%":  { transform: "translate(-6px, -120px) scale(0.95)", opacity: 0.65 },
            "100%": { transform: "translate(0, -180px) scale(0.55)",  opacity: 0 },
          },
          "@keyframes emberDriftAlt": {
            "0%":   { transform: "translate(0, 0) scale(0.55)",        opacity: 0 },
            "12%":  { transform: "translate(-3px, -12px) scale(1.1)",  opacity: 0.95 },
            "55%":  { transform: "translate(-14px, -70px) scale(1)",   opacity: 0.9 },
            "90%":  { transform: "translate(8px, -150px) scale(0.9)",  opacity: 0.55 },
            "100%": { transform: "translate(0, -210px) scale(0.5)",    opacity: 0 },
          },
          "@keyframes emberTwinkle": {
            "0%, 100%": { filter: "brightness(1) blur(0)" },
            "50%":      { filter: "brightness(1.7) blur(0.4px)" },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "100vh", sm: "110vh", md: "120vh", lg: "130vh" },
            overflow: "hidden",
            bgcolor: "#0e1116",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/images/dine/masthead2.jpeg"
              alt="Vacation retreat"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                filter: "brightness(1.08) contrast(1.08) saturate(1.05)",
              }}
            />
          </Box>
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,15,20,0.06) 0%, rgba(12,15,20,0.18) 100%)" }} />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 25% 30%, rgba(202,166,255,0.32) 0%, rgba(202,166,255,0) 40%)",
              animation: "glowDrift 8s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 80% 65%, rgba(95,2,171,0.28) 0%, rgba(95,2,171,0) 44%)",
              animation: "glowDrift 11s ease-in-out infinite reverse",
            }}
          />

          {/* ───────── Twinkling embers (warm + cool, drifting + pulsing) ───────── */}
          {[
            { left: "5%",  top: "82%", size: 4, dur: 11, delay: 0,   tdur: 2.4, tdelay: 0,   warm: true,  alt: false },
            { left: "10%", top: "68%", size: 3, dur: 13, delay: 2.1, tdur: 3.0, tdelay: 0.5, warm: false, alt: true  },
            { left: "16%", top: "78%", size: 5, dur: 10, delay: 4.3, tdur: 2.6, tdelay: 1.2, warm: true,  alt: false },
            { left: "22%", top: "60%", size: 3, dur: 14, delay: 1.4, tdur: 3.4, tdelay: 0.2, warm: false, alt: true  },
            { left: "28%", top: "85%", size: 4, dur: 12, delay: 3.8, tdur: 2.2, tdelay: 0.8, warm: true,  alt: false },
            { left: "34%", top: "55%", size: 2, dur: 16, delay: 0.6, tdur: 3.6, tdelay: 1.5, warm: false, alt: true  },
            { left: "40%", top: "75%", size: 5, dur: 11, delay: 5.2, tdur: 2.8, tdelay: 0.3, warm: true,  alt: false },
            { left: "46%", top: "62%", size: 3, dur: 13, delay: 2.9, tdur: 2.4, tdelay: 1.0, warm: false, alt: true  },
            { left: "52%", top: "80%", size: 4, dur: 12, delay: 4.7, tdur: 3.2, tdelay: 0.7, warm: true,  alt: false },
            { left: "58%", top: "58%", size: 3, dur: 15, delay: 1.1, tdur: 2.6, tdelay: 1.3, warm: false, alt: true  },
            { left: "64%", top: "78%", size: 5, dur: 10, delay: 3.4, tdur: 3.0, tdelay: 0.4, warm: true,  alt: false },
            { left: "70%", top: "65%", size: 3, dur: 14, delay: 0.9, tdur: 2.8, tdelay: 1.1, warm: false, alt: true  },
            { left: "76%", top: "84%", size: 4, dur: 12, delay: 5.5, tdur: 2.4, tdelay: 0.6, warm: true,  alt: false },
            { left: "82%", top: "60%", size: 2, dur: 17, delay: 2.4, tdur: 3.4, tdelay: 1.4, warm: false, alt: true  },
            { left: "88%", top: "76%", size: 5, dur: 11, delay: 4.1, tdur: 2.6, tdelay: 0.5, warm: true,  alt: false },
            { left: "93%", top: "68%", size: 3, dur: 13, delay: 1.7, tdur: 3.0, tdelay: 1.2, warm: false, alt: true  },
            { left: "97%", top: "82%", size: 4, dur: 10, delay: 3.2, tdur: 2.2, tdelay: 0.9, warm: true,  alt: false },
          ].map((e, i) => {
            const core = e.warm ? "rgba(255,218,168,0.95)" : "rgba(214,180,255,0.9)";
            const glow = e.warm ? "rgba(255,196,140,0.7)" : "rgba(202,166,255,0.7)";
            return (
              <Box
                key={`ember-${i}`}
                sx={{
                  position: "absolute",
                  top: e.top,
                  left: e.left,
                  width: e.size,
                  height: e.size,
                  borderRadius: "50%",
                  bgcolor: core,
                  boxShadow: `0 0 ${e.size + 5}px ${glow}, 0 0 ${e.size * 2 + 10}px ${glow}`,
                  animation: `${e.alt ? "emberDriftAlt" : "emberDrift"} ${e.dur}s ease-out ${e.delay}s infinite, emberTwinkle ${e.tdur}s ease-in-out ${e.tdelay}s infinite`,
                  mixBlendMode: "screen",
                  willChange: "transform, opacity, filter",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "100vh", sm: "110vh", md: "120vh", lg: "130vh" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
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
                  xs: "3rem",
                  sm: "4.4rem",
                  md: "5.6rem",
                  lg: "6.8rem",
                  xl: "7.4rem",
                },
                lineHeight: 1,
                letterSpacing: "0.005em",
                textShadow:
                  "0 4px 30px rgba(50,9,83,0.45), 0 2px 6px rgba(0,0,0,0.35)",
                animation:
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 150ms both",
              }}
            >
              Dopwái
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1.2, sm: 1.4, md: 1.6 },
                mt: { xs: 1.2, sm: 1.8, md: 2.4 },
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
                    "heroDividerGrow 800ms cubic-bezier(.2,.7,.2,1) 700ms both",
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
                      "heroDiamondPop 600ms cubic-bezier(.2,.7,.2,1) 1100ms both",
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
                    "heroDividerGrow 800ms cubic-bezier(.2,.7,.2,1) 700ms both",
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
                  xs: "0.78rem",
                  sm: "1.05rem",
                  md: "1.3rem",
                  lg: "1.5rem",
                },
                lineHeight: 1,
                letterSpacing: { xs: "0.24em", sm: "0.28em", md: "0.32em" },
                pl: { xs: "0.24em", sm: "0.28em", md: "0.32em" },
                textTransform: "uppercase",
                textShadow:
                  "0 2px 14px rgba(50,9,83,0.45), 0 1px 4px rgba(0,0,0,0.3)",
                mb: 2.2,
                animation:
                  "cinzelTrack 1100ms cubic-bezier(.2,.7,.2,1) 1300ms both",
              }}
            >
              The Rooftop Restaurant
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 6, lg: 8 },
            py: { xs: 4, md: 0 },
            pb: { xs: 4, sm: 6, md: 8 },
            mt: { xs: 0, md: -6 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 1120,
              mx: "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
              gap: { xs: 3, sm: 4, md: 5 },
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: 460, sm: 460, md: 640, lg: 700 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: { xs: "85%", sm: "82%", md: "82%" },
                  height: { xs: 340, sm: 340, md: 490, lg: 540 },
                  boxShadow:
                    "0 30px 44px rgba(50,9,83,0.22), 0 8px 16px rgba(50,9,83,0.16)",
                  transformStyle: "preserve-3d",
                  animation: "card3DHover 6s ease-in-out infinite",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(130deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 32%)",
                    pointerEvents: "none",
                  },
                }}
              >
                <Image
                  src="/images/dine/dine5.jpg"
                  alt="Dopwai dining"
                  fill
                  sizes="(max-width: 600px) 86vw, (max-width: 900px) 80vw, 44vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 12, md: 0 },
                  bottom: { xs: 8, sm: 12, md: 3 },
                  width: { xs: 140, sm: 200, md: 250, lg: 280 },
                  height: { xs: 120, sm: 220, md: 300, lg: 330 },
                  border: { xs: "5px solid #faf6ef", md: "6px solid #faf6ef" },
                  boxShadow: "0 18px 28px rgba(50,9,83,0.22)",
                  zIndex: 3,
                }}
              >
                <Image
                  src="/images/dine/dine3.jpg"
                  alt="Signature curry"
                  fill
                  sizes="(max-width: 600px) 35vw, (max-width: 900px) 28vw, 280px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "#faf6ef",
                boxShadow: "0 16px 28px rgba(50,9,83,0.14)",
                px: { xs: 2.4, sm: 3.6, md: 5, lg: 5.5 },
                py: { xs: 3, sm: 4, md: 5.5 },
                mt: { xs: 0, md: 6 },
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 64, sm: 80, md: 96, lg: 104 },
                  height: { xs: 64, sm: 80, md: 96, lg: 104 },
                  mb: { xs: 1.4, sm: 1.8, md: 2.2 },
                  transformOrigin: "50% 95%",
                  animation: "leafSway 5s ease-in-out infinite",
                  filter: "drop-shadow(0 6px 14px rgba(50,9,83,0.18))",
                }}
              >
                <Image
                  src="/images/dine/dopwai-leaf.png"
                  alt="Ka Dopwái — areca leaf food wrapping"
                  fill
                  sizes="(max-width: 600px) 64px, (max-width: 900px) 80px, 104px"
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Typography
                component="h2"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 600,
                  color: "#320953",
                  fontSize: {
                    xs: "1.7rem",
                    sm: "2.3rem",
                    md: "2.7rem",
                    lg: "3rem",
                  },
                  lineHeight: 1.05,
                  letterSpacing: "0.04em",
                  mb: { xs: 1, md: 1.2 },
                }}
              >
                DINNING AT DOPWAI
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: { xs: 1.8, sm: 2.2, md: 2.4 },
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 24, sm: 30, md: 36 },
                    background:
                      "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: cinzel,
                    fontWeight: 500,
                    color: "#5f02ab",
                    letterSpacing: { xs: "0.18em", sm: "0.22em", md: "0.24em" },
                    fontSize: { xs: "0.66rem", sm: "0.74rem", md: "0.82rem" },
                    lineHeight: 1,
                  }}
                >
                  BEST ROOFTOP RESTAURANT EXPERIENCE
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#320953",
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.25rem",
                    md: "1.4rem",
                    lg: "1.55rem",
                  },
                  lineHeight: 1.35,
                  mb: { xs: 1.8, sm: 2.3, md: 2.6 },
                }}
              >
                Dine above the city, beyond the ordinary
                Curated flavors, warm service, unforgettable moments
              </Typography>

              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontWeight: 400,
                  color: "#3f2a2a",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.12rem",
                    lg: "1.16rem",
                  },
                  lineHeight: { xs: 1.65, md: 1.75 },
                  mb: { xs: 2, sm: 2.6, md: 3 },
                }}
              >
                A rooftop setting with panoramic Shillong views—Dopwai brings Indian, Asian, and Italian favorites together with warm service and curated beverages. Classic techniques meet contemporary taste, creating an inviting ambience for memorable meals.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.2, md: 1.4 } }}>
                {[
                  {
                    icon: (
                      <LandscapeOutlinedIcon
                        sx={{ fontSize: { xs: 17, sm: 19, md: 20 }, color: "#5f02ab" }}
                      />
                    ),
                    text: "Comfortable dining with scenic view",
                  },
                  {
                    icon: (
                      <MusicNoteOutlinedIcon
                        sx={{ fontSize: { xs: 17, sm: 19, md: 20 }, color: "#5f02ab" }}
                      />
                    ),
                    text: "Elevated Moments with Live Music",
                  },
                ].map((item) => (
                  <Box
                    key={item.text}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.1, sm: 1.3, md: 1.4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: 28, sm: 32, md: 36 },
                        height: { xs: 28, sm: 32, md: 36 },
                        borderRadius: "50%",
                        bgcolor: "rgba(95,2,171,0.08)",
                        border: "1px solid rgba(95,2,171,0.16)",
                        flexShrink: 0,
                        transition:
                          "background-color 240ms ease, transform 240ms ease",
                        "&:hover": {
                          bgcolor: "rgba(95,2,171,0.16)",
                          transform: "scale(1.06)",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: cormorant,
                        fontWeight: 500,
                        color: "#3f2a2a",
                        fontSize: {
                          xs: "0.92rem",
                          sm: "1rem",
                          md: "1.08rem",
                        },
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Contact Us CTA — opens a brand-styled popup that submits to
                  the same AWS endpoint as the main contact form. */}
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
                    boxShadow: "0 6px 18px rgba(95,2,171,0.28)",
                    transition: "background-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
                    "&:hover": {
                      bgcolor: "#76046b",
                      transform: "translateY(-1px)",
                      boxShadow: "0 10px 22px rgba(95,2,171,0.36)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid rgba(202,166,255,0.7)",
                      outlineOffset: 3,
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          ref={instaRef}
          sx={{
            pb: { xs: 4, sm: 5, md: 6 },
            pt: { xs: 3, sm: 3.5, md: 4 },
            px: { xs: 2, sm: 3, md: 6, lg: 8 },
            mt: 0,
            position: "relative",
            zIndex: 1,
            "@keyframes instagramIn": {
              "0%": { opacity: 0, transform: "translateY(22px) scale(0.96)" },
              "60%": { opacity: 1 },
              "100%": { opacity: 1, transform: "translateY(0px) scale(1)" },
            },
            "@keyframes tileShimmer": {
              "0%": { transform: "translateX(-120%) rotate(10deg)", opacity: 0 },
              "30%": { opacity: 0.7 },
              "100%": { transform: "translateX(120%) rotate(10deg)", opacity: 0 },
            },
            "@keyframes floatTile": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-5px)" },
            },
            "@keyframes purpleRowSweep": {
              "0%": { transform: "translateX(-150%)", opacity: 0 },
              "20%": { opacity: 1 },
              "80%": { opacity: 1 },
              "100%": { transform: "translateX(500%)", opacity: 0 },
            },
            "@keyframes cursiveShimmer": {
              "0%": { backgroundPosition: "200% 50%" },
              "100%": { backgroundPosition: "-200% 50%" },
            },
            "@keyframes pulseDot": {
              "0%, 100%": {
                transform: "scale(1)",
                boxShadow: "0 0 0 0 rgba(95,2,171,0.55)",
              },
              "50%": {
                transform: "scale(1.18)",
                boxShadow: "0 0 0 10px rgba(95,2,171,0)",
              },
            },
            "@keyframes dividerGrow": {
              "0%": { transform: "scaleX(0)", opacity: 0 },
              "100%": { transform: "scaleX(1)", opacity: 1 },
            },
            "@keyframes diamondPop": {
              "0%": {
                transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
                opacity: 0,
              },
              "70%": {
                transform: "translate(-50%, -50%) rotate(45deg) scale(1.3)",
                opacity: 1,
              },
              "100%": {
                transform: "translate(-50%, -50%) rotate(45deg) scale(1)",
                opacity: 1,
              },
            },
            "@keyframes letterRise": {
              "0%": { opacity: 0, transform: "translateY(14px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes scriptRise": {
              "0%": { opacity: 0, transform: "translateY(18px) rotate(-2deg)" },
              "100%": { opacity: 1, transform: "translateY(0) rotate(0deg)" },
            },
          }}
        >
          <Box sx={{ maxWidth: 1340, mx: "auto" }}>
            <Box sx={{ position: "relative", textAlign: "center", mb: { xs: 2, sm: 2.4, md: 2.6 } }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: { xs: 1, md: 1.2 } }}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: serif,
                    fontSize: {
                      xs: "1.8rem",
                      sm: "2.4rem",
                      md: "2.8rem",
                      lg: "3.1rem",
                    },
                    lineHeight: 1,
                    fontStyle: "italic",
                    display: "inline-block",
                    backgroundImage:
                      "linear-gradient(90deg, #320953 0%, #caa6ff 25%, #5f02ab 50%, #caa6ff 75%, #320953 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    opacity: instaInView ? 1 : 0,
                    animation: instaInView
                      ? "scriptRise 800ms cubic-bezier(.2,.7,.2,1) both, cursiveShimmer 6s linear 800ms infinite"
                      : "none",
                  }}
                >
                  Dopwái
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: { xs: 7, md: 8 },
                    height: { xs: 7, md: 8 },
                    borderRadius: "50%",
                    bgcolor: "#5f02ab",
                    opacity: instaInView ? 1 : 0,
                    transition: "opacity 400ms ease 900ms",
                    animation: instaInView ? "pulseDot 2.4s ease-out infinite 1100ms" : "none",
                  }}
                />
              </Box>

              <Typography
                component="div"
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  letterSpacing: { xs: "0.12em", sm: "0.14em", md: "0.15em" },
                  color: "#320953",
                  fontSize: {
                    xs: "1.5rem",
                    sm: "2rem",
                    md: "2.4rem",
                    lg: "2.6rem",
                  },
                  lineHeight: 1,
                  mt: 0.4,
                }}
              >
                {"GALLERY".split("").map((char, i) => (
                  <Box
                    key={i}
                    component="span"
                    sx={{
                      display: "inline-block",
                      opacity: instaInView ? 1 : 0,
                      animation: instaInView
                        ? `letterRise 600ms cubic-bezier(.2,.7,.2,1) ${250 + i * 55}ms both`
                        : "none",
                    }}
                  >
                    {char}
                  </Box>
                ))}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 1, sm: 1.1, md: 1.2 },
                  mt: { xs: 1.2, sm: 1.4, md: 1.6 },
                  mb: { xs: 1.4, sm: 1.7, md: 2 },
                }}
              >
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 50, sm: 80, md: 110, lg: 130 },
                    background:
                      "linear-gradient(90deg, rgba(95,2,171,0) 0%, #5f02ab 100%)",
                    transformOrigin: "right center",
                    opacity: instaInView ? 1 : 0,
                    animation: instaInView
                      ? "dividerGrow 700ms cubic-bezier(.2,.7,.2,1) 900ms both"
                      : "none",
                  }}
                />
                <Box sx={{ position: "relative", width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 } }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: { xs: 7, md: 8 },
                      height: { xs: 7, md: 8 },
                      bgcolor: "#5f02ab",
                      transform: "translate(-50%, -50%) rotate(45deg)",
                      opacity: instaInView ? 1 : 0,
                      animation: instaInView
                        ? "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1300ms both"
                        : "none",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    height: "1px",
                    width: { xs: 50, sm: 80, md: 110, lg: 130 },
                    background:
                      "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                    transformOrigin: "left center",
                    opacity: instaInView ? 1 : 0,
                    animation: instaInView
                      ? "dividerGrow 700ms cubic-bezier(.2,.7,.2,1) 900ms both"
                      : "none",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(5, 1fr)",
                },
                gap: { xs: 0.8, sm: 1.1, md: 1.4 },
                border: "1px solid rgba(50,9,83,0.12)",
                bgcolor: "#f1ecdb",
                p: { xs: 0.7, sm: 0.9, md: 1.2 },
              }}
            >
              {[
                "/images/dine/gallery-salad.jpg",
                "/images/dine/gallery-kebabs.jpg",
                "/images/dine/gallery-rooftop.jpg",
                "/images/dine/gallery-dining-room.jpg",
                "/images/dine/gallery-chevron.jpg",
                "/images/dine/masthead2.jpeg",
                "/images/dine/masthead3.jpeg",
                "/images/dine/dine11.jpeg",
                "/images/dine/image7.png",
                "/images/dine/image4.png",
                "/images/dine/image6.png",
                "/images/dine/image3.png",
                "/images/dine/image2.png",
                "/images/dine/image1.png",
                "/images/dine/dine14.jpeg",
              ].map((src, idx) => (
                <Box
                  key={src}
                  sx={{
                    position: "relative",
                    minHeight: { xs: 140, sm: 200, md: 240, lg: 280 },
                    overflow: "hidden",
                    transformOrigin: "center",
                    willChange: "transform, box-shadow",
                    transition:
                      "transform 360ms cubic-bezier(.2,.6,.2,1), box-shadow 360ms ease",
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.025)",
                      boxShadow:
                        "0 24px 38px rgba(95,2,171,0.28), 0 8px 18px rgba(50,9,83,0.18)",
                      "& .insta-frame": { opacity: 1 },
                      "& .insta-img": { transform: "scale(1.08)" },
                      "& .insta-shimmer": {
                        animation: "tileShimmer 1000ms ease-out both",
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box
                    className="insta-anim"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      opacity: instaInView ? undefined : 0,
                      animation: instaInView
                        ? `instagramIn 850ms cubic-bezier(.2,.7,.2,1) ${idx * 120}ms both, floatTile 7s ease-in-out ${idx * 350 + 1600}ms infinite`
                        : "none",
                    }}
                  >
                    <Box
                      className="insta-img"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        transition: "transform 700ms cubic-bezier(.2,.6,.2,1)",
                      }}
                    >
                      <Image
                        src={src}
                        alt="Dopwai gallery"
                        fill
                        sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 20vw"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box
                      className="insta-shimmer"
                      sx={{
                        position: "absolute",
                        inset: -40,
                        background:
                          "linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(202,166,255,0.55) 55%, rgba(255,255,255,0) 70%)",
                        transform: "translateX(-120%) rotate(10deg)",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <Box
                      className="insta-frame"
                      sx={{
                        position: "absolute",
                        inset: 4,
                        border: "1px solid rgba(95,2,171,0.7)",
                        opacity: 0,
                        transition: "opacity 320ms ease",
                        pointerEvents: "none",
                      }}
                    />
                  </Box>
                </Box>
              ))}

              {/* Sequential purple light sweep across the gallery on entrance */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 4,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "22%",
                    transform: "translateX(-150%)",
                    background:
                      "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(202,166,255,0.5) 42%, rgba(127,77,255,0.6) 50%, rgba(202,166,255,0.5) 58%, rgba(255,255,255,0) 100%)",
                    filter: "blur(6px)",
                    mixBlendMode: "screen",
                    animation: instaInView
                      ? "purpleRowSweep 1900ms cubic-bezier(.4,.1,.2,1) 1100ms both"
                      : "none",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />

      {/* Mounted at the page root so it overlays everything regardless of
          which CTA opened it. Submits to the same AWS endpoint as the main
          contact form (see `lib/contact.ts`). */}
      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        source="hotelpoinisuk.com / dine-page"
        title="Reach the Dopwai Team"
        subtitle="Reservations, private dinners, or a question about the menu — leave us a note and our team will get back to you shortly."
      />
    </main>
  );
};

DinePage.seo = {
  title: "Dining",
  description:
    "Dopwai rooftop restaurant at Hotel Poinisuk — Indian, Asian, Italian cuisine with panoramic Shillong views. Fine dining experience in the heart of Shillong.",
  keywords: "restaurant Shillong, rooftop restaurant, dining Shillong, Dopwai restaurant, Shillong restaurant, multi-cuisine restaurant",
  ogImage: "/images/og/dine.jpg",
};

export default DinePage;
