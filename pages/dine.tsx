// pages/dine.tsx
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

// SSR-safe react-slick for the content carousel
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DinePage: NextPageWithSeo = () => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });

  // right-side content slider images
  const contentImages = [
    "/images/dine/dine3.jpg",
    "/images/dine/dine5.jpg",
    "/images/dine/dinemasthead.png",
    "/images/dine/dine9.jpeg",
    "/images/dine/dine10.jpeg",
    "/images/dine/dine8.jpeg",
  ];

  const contentSliderSettings = {
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

  const fadeIn = {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(12px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  };

  const brown = "#5a4235";

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

      {/* ─── Ken Burns Masthead ─── */}
      <MastheadSlider
        images={[
          "/images/dine/masthead1.jpeg",
          "/images/dine/masthead2.jpeg",
          "/images/dine/masthead3.jpeg",
        ]}
        height={{ xs: 220, md: 380 }}
        overlayColor="rgba(0,0,0,0.45)"
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
            justifyContent: { xs: "center", md: "center" },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              fontSize: { xs: "1.6rem", sm: "clamp(1.6rem, 4.5vw, 2.6rem)" },
              letterSpacing: 0.4,
            }}
          >
            Dining
          </Typography>
        </Container>
      </MastheadSlider>

      {/* ─── Content section (At a Glance + right carousel) ─── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            ...fadeIn,
            animation: reduceMotion ? "none" : "fadeIn 0.7s ease-out",

            /* ⬇️ Switch to GRID with named areas to control order by breakpoint */
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gridTemplateAreas: {
              xs: `"copy"
                   "slider"`,          // text first, slider second on mobile/small
              md: `"copy slider"`,     // side-by-side on md+
            },
            alignItems: "stretch",
            gap: { xs: 3.5, md: 5 },
          }}
        >
          {/* LEFT: copy with watermark */}
          <Box
            sx={{
              gridArea: "copy",
              position: "relative",
              pr: { md: 2 },
              minWidth: 0,
              "&::after": {
                content: '""',
                position: "absolute",
                left: { xs: -12, md: -16 },
                bottom: { xs: -10, md: -20 },
                width: { xs: 220, sm: 260, md: 320 },
                height: { xs: 220, sm: 260, md: 320 },
                backgroundImage: "url('/images/dopwai.png')",
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
              Dining at Dopwai
            </Typography>

            {/* squiggle */}
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
              A rooftop setting with panoramic Shillong views—Dopwai brings Indian, Asian, and Italian
              favorites together with warm service and curated beverages. Classic techniques meet
              contemporary taste, creating an inviting ambience for memorable meals.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: brown,
                  color: brown,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  px: 2.5,
                  py: 1,
                  "&:hover": { borderColor: brown, bgcolor: "rgba(90,66,53,.06)" },
                }}
              >
                OUR STORY
              </Button>
            </Box>
          </Box>

          {/* RIGHT: sliding images (carousel) */}
          <Box
            sx={{
              gridArea: "slider",
              position: "relative",
              minWidth: 0,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 10px 26px rgba(0,0,0,.15)",

              /* Keep slider visible on all screens */
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
            <Slider {...(contentSliderSettings as any)}>
              {contentImages.map((src, i) => (
                <Box key={i} sx={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={src}
                    alt={`Dopwai dining image ${i + 1}`}
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

      <Footer />
    </main>
  );
};

DinePage.seo = {
  title: "Dining",
  description:
    "Dopwai rooftop restaurant at Hotel Poinisuk — Indian, Asian, Italian & more with panoramic Shillong views.",
  ogImage: "/images/og/dine.jpg",
};

export default DinePage;
