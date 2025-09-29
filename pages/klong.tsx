// pages/klong.tsx
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  GlobalStyles,
  useMediaQuery,
} from "@mui/material";
import Footer from "@/components/Footer";
import MastheadSlider from "@/components/MastheadSlider";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

// Client-only slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const KlongPage: NextPageWithSeo = () => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const brown = "#5a4235";

  // Right-side gallery images
  const images = [
    "/images/bar/klongbar1.jpg",
    "/images/bar/klongbar.jpg",
    "/images/bar/bar.jpg",
    "/images/bar/masthead1.jpeg",
    "/images/bar/bar4.jpg",
    "/images/bar/bar3.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: reduceMotion ? 0 : 600,
    autoplay: !reduceMotion,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: true,
    adaptiveHeight: false,
    cssEase: "ease",
  } as const;

  // subtle entrance
  const fadeIn = {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(12px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  };

  return (
    <main>
      {/* global fixes (slick sizing + layout) */}
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          html: { width: "100%" },
          body: { width: "100%", margin: 0, overflowX: "hidden" },
          main: { width: "100%", maxWidth: "100vw" },
          ".slick-slider,.slick-list,.slick-track": { width: "100%", height: "100%" },
          ".slick-track": { display: "flex" },
          ".slick-slide": { height: "100%" },
          ".slick-slide > div": { height: "100%" },
        }}
      />

      {/* ─── 3-image Ken Burns Masthead ─── */}
      <MastheadSlider
        images={[
          "/images/bar/masthead.jpeg",
          "/images/bar/masthead1.jpeg",
          "/images/bar/klongbar1.jpg",
        ]}
        height={{ xs: 220, md: 360 }}
        overlayColor="rgba(0,0,0,.45)"
        animationDuration="20s"
        scale={1.12}
        align="center"
        contentPadding={{ xs: 2, md: 4 }}
        dots
        arrows={false}
        fade
      >
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3, md: 4 },
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              letterSpacing: 0.5,
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              fontSize: { xs: "1.6rem", sm: "clamp(1.6rem, 4.5vw, 2.6rem)" },
            }}
          >
            Klong Lounge
          </Typography>
        </Container>
      </MastheadSlider>

      {/* ─── Content section with background image ─── */}
      <Box
        sx={{
          backgroundImage: "url('/images/bar/content-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.86), rgba(255,255,255,0.92))",
              pointerEvents: "none",
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              pt: { xs: 4, sm: 5, md: 6 },
              pb: { xs: 6, sm: 7, md: 9 },
              px: { xs: 2, sm: 3, md: 4 },
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                ...fadeIn,
                animation: reduceMotion ? "none" : "fadeIn 0.7s ease-out",

                /* ⬇️ Use GRID with named areas to force order:
                      - Mobile/Small: text first, slider second
                      - md+: side-by-side
                */
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gridTemplateAreas: {
                  xs: `"copy"
                       "slider"`,
                  md: `"copy slider"`,
                },
                alignItems: "stretch",
                gap: { xs: 3.5, md: 5 },
              }}
            >
              {/* LEFT: copy with faint building watermark */}
              <Box
                sx={{
                  gridArea: "copy",
                  position: "relative",
                  pr: { md: 2 },
                  minWidth: 0,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: { xs: -12, md: -65 },
                    bottom: { xs: -10, md: -20 },
                    width: { xs: 220, sm: 260, md: 320 },
                    height: { xs: 220, sm: 260, md: 320 },
                    backgroundImage: "url('/images/klong.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "left bottom",
                    opacity: 0.2,
                    pointerEvents: "none",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: `'Georgia','Times New Roman',serif`,
                    fontStyle: "italic",
                    color: "#6f5d52",
                    mb: 1,
                    letterSpacing: ".01em",
                    fontSize: { xs: 18, md: 20 },
                  }}
                >
                  At a Glance
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    color: brown,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    lineHeight: 1.2,
                    fontFamily: `'Montserrat','Helvetica Neue',Arial,sans-serif`,
                    fontSize: { xs: "clamp(1.6rem, 5.5vw, 2.2rem)", md: "2.6rem" },
                    mb: 1.25,
                  }}
                >
                  Klong Lounge
                </Typography>

                {/* decorative squiggle */}
                <Box aria-hidden sx={{ height: 18, mb: 2.5, "& svg": { display: "block" } }}>
                  <svg width="90" height="18" viewBox="0 0 90 18" fill="none">
                    <path
                      d="M1 9c8-8 14 8 22 0s14 8 22 0 14 8 22 0 14 8 22 0"
                      stroke={brown}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                </Box>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "1rem", sm: "1.05rem" },
                    lineHeight: { xs: 1.8, md: 1.9 },
                    maxWidth: 560,
                    textAlign: "justify",
                  }}
                >
                  The lounge bar reiterates comfort and style—a kindred spirit in ambience. It thrives
                  on its pep atmosphere, letting you savour signature cocktails amidst complete
                  tranquillity. Aptly manned by master bartenders, there’s a drink for every mood.
                </Typography>

                <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="contained" size="large" color="primary" href="/booking">
                    Book Now
                  </Button>
                  <Button variant="outlined" size="large" sx={{ borderColor: brown, color: brown }}>
                    Our Story
                  </Button>
                </Box>
              </Box>

              {/* RIGHT: sliding images — visible on all screens */}
              <Box
                sx={{
                  gridArea: "slider",
                  position: "relative",
                  minWidth: 0,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 10px 26px rgba(0,0,0,.15)",

                  /* Keep the slider visible:
                     - explicit heights on small
                     - aspect-ratio when supported
                  */
                  height: { xs: 260, sm: 320, md: "auto" },
                  "@supports (aspect-ratio: 1 / 1)": {
                    height: "auto",
                    aspectRatio: { xs: "4 / 3", md: "16 / 9" },
                  },

                  "& .slick-slider, & .slick-list, & .slick-track, & .slick-slide > div": {
                    height: "100%",
                  },
                }}
              >
                <Slider {...(sliderSettings as any)}>
                  {images.map((src, i) => (
                    <Box key={i} sx={{ position: "relative", width: "100%", height: "100%" }}>
                      <Image
                        src={src}
                        alt={`Klong Lounge image ${i + 1}`}
                        fill
                        sizes="(max-width: 1199px) 100vw, 600px"
                        style={{ objectFit: "cover" }}
                        priority={i === 0}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </main>
  );
};

// Page-level SEO
KlongPage.seo = {
  title: "Klong Lounge",
  description: "Klong Lounge — live music, karaoke, and curated cocktails at Hotel Poinisuk, Shillong.",
  ogImage: "/images/og/klong.jpg",
};

export default KlongPage;
