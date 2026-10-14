// pages/banquet.tsx
import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, Container, Typography, Divider, useTheme, useMediaQuery } from "@mui/material";

// Load react-slick on the client
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ---- Images (update paths as needed) ----
const TOP_CAROUSEL = [
  "/images/banq6.jpeg",
  "/images/banq2.jpg",
  "/images/banq3.avif",
  "/images/banquet.avif",
  "/images/banq5.jpeg",
  "/images/banq1.jpg",
  "/images/banq7.jpeg",
];
const SECTION_LEFT_IMG = "/images/banq5.jpeg";

export default function BanquetPage() {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));

  // MULTI-ITEM ROW CAROUSEL (no fade)
  const rowSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 5 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 960, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <>
      <Head>
        <title>Hotel Poinisuk | Shillong</title>
        <meta
          name="description"
          content="Unforgettable Weddings & Events at Hotel Poinisuk. Elegant banquet hall, curated menus from Dopwai, live entertainment, AV/DJ/karaoke. Capacity up to 200 guests."
        />
      </Head>
      
      {/* SEO is handled by _app.tsx with seo prop */}

      {/* ===================== SECTION HEADING ===================== */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 1.5, md: 2.5 },
          textAlign: "center",
          "@keyframes bnqRise": {
            from: { opacity: 0, transform: "translateY(14px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes bnqRule": {
            from: { transform: "scaleX(0)" },
            to: { transform: "scaleX(1)" },
          },
          "@keyframes bnqDiamond": {
            from: { opacity: 0, transform: "rotate(45deg) scale(0.4)" },
            to: { opacity: 1, transform: "rotate(45deg) scale(1)" },
          },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0,
            animation: "bnqRise 800ms ease-out 100ms forwards",
          }}
        >
          {/* Eyebrow ornament: line • diamond • line */}
          <Box
            aria-hidden
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
              mb: { xs: 1.25, md: 1.75 },
            }}
          >
            <Box
              sx={{
                width: { xs: 48, sm: 64, md: 84 },
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(90,66,53,0) 0%, rgba(90,66,53,0.55) 50%, rgba(90,66,53,0) 100%)",
                transformOrigin: "right center",
                animation: "bnqRule 700ms ease-out 350ms both",
              }}
            />
            <Box
              sx={{
                width: 7,
                height: 7,
                bgcolor: "#8a6a4f",
                transform: "rotate(45deg)",
                boxShadow: "0 0 0 1px rgba(90,66,53,0.18)",
                animation: "bnqDiamond 600ms ease-out 600ms both",
              }}
            />
            <Box
              sx={{
                width: { xs: 48, sm: 64, md: 84 },
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(90,66,53,0) 0%, rgba(90,66,53,0.55) 50%, rgba(90,66,53,0) 100%)",
                transformOrigin: "left center",
                animation: "bnqRule 700ms ease-out 350ms both",
              }}
            />
          </Box>

          {/* Main heading */}
          <Typography
            component="h2"
            sx={{
              fontFamily: `var(--font-cinzel), var(--font-cormorant), 'Playfair Display', 'Georgia', serif`,
              fontWeight: 600,
              color: "#3d2a1f",
              textTransform: "uppercase",
              letterSpacing: { xs: ".18em", md: ".28em" },
              fontSize: {
                xs: "clamp(1.4rem, 5.6vw, 1.85rem)",
                md: "2.15rem",
                lg: "2.35rem",
              },
              lineHeight: 1.15,
              textShadow: "0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            Banquet Hall
          </Typography>
        </Box>
      </Container>

      {/* ===================== TOP ROW CAROUSEL ===================== */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            // gutter between slides
            "& .slick-slide": { px: 0.75 },
            "& .slick-list": { mx: -0.75 },
            // fix height issues so slides fill the box
            "& .slick-slider, & .slick-list, & .slick-track": { display: "flex", alignItems: "stretch" },
          }}
        >
          <Slider {...(rowSettings as any)}>
            {TOP_CAROUSEL.map((src, i) => (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  height: { xs: 140, sm: 180, md: 220 },
                  borderRadius: 1.5,
                  overflow: "hidden",
                  boxShadow: 2,
                }}
              >
                <Image src={src} alt={`Banquet preview ${i + 1}`} fill sizes="20vw" style={{ objectFit: "cover" }} />
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>

      {/* ============ SECTION WITH BLENDED DECALS ON WOOD ============= */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 6, md: 10 },
          backgroundImage: "url('/images/wood.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          overflow: "hidden",

          // LEFT cake decal (blended)
          "&::before": {
            content: '""',
            position: "absolute",
            left: { xs: -20, md: -100 },
            bottom: { xs: -30, md: 0 },
            width: { xs: 180, md: 280 },
            height: { xs: 260, md: 790 },
            backgroundImage: "url('/images/cakes.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "left bottom",
            opacity: { xs: 0.22, md: 0.35 }, // 0..1 only
            mixBlendMode: "multiply",
            filter: "grayscale(100%) contrast(0.9) brightness(0.92)",
            pointerEvents: "none",
          },

          // RIGHT glasses decal (blended)
          "&::after": {
            content: '""',
            position: "absolute",
            right: { xs: -10, md: -55 },
            top: { xs: 20, md: 10 },
            width: { xs: 160, md: 240 },
            height: { xs: 220, md: 440 },
            backgroundImage: "url('/images/glas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right top",
            opacity: { xs: 0.20, md: 0.32 },
            mixBlendMode: "multiply",
            filter: "grayscale(100%) contrast(0.9) brightness(0.92)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              gap: { xs: 3, md: 5 },
            }}
          >
            {/* LEFT: IMAGE */}
            <Box
              sx={{
                position: "relative",
                flex: 1,
                minHeight: { xs: 240, sm: 360, md: 480 },
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: 2,
              }}
            >
              <Image
                src={SECTION_LEFT_IMG}
                alt="Banquet hall"
                fill
                sizes={downMd ? "100vw" : "50vw"}
                style={{ objectFit: "cover" }}
              />
            </Box>

            {/* RIGHT: TEXT CARD */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "white",
                  borderRadius: 1,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.06)",
                  px: { xs: 3, sm: 6 },
                  py: { xs: 4, sm: 6 },
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontStyle: "italic",
                    color: "#7b6a5e",
                    letterSpacing: ".02em",
                    mb: 1,
                    fontFamily: `'Georgia','Times New Roman',serif`,
                    fontSize: { xs: 18, sm: 20 },
                  }}
                >
                  Unforgettable Moments
                </Typography>

                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 800,
                    letterSpacing: ".06em",
                    color: "#5a4235",
                    fontFamily: `var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif`,
                    fontSize: { xs: 26, sm: 34, md: 40 },
                    lineHeight: 1.15,
                  }}
                >
                  Wedding &amp; Events
                </Typography>

                <Divider sx={{ width: 80, mx: "auto", my: 2.5, borderColor: "rgba(90,66,53,0.5)" }} />
                <Divider sx={{ width: 44, mx: "auto", mt: -2, mb: 3, borderColor: "rgba(90,66,53,0.5)" }} />

                <Typography sx={{ color: "#6d6d6d", lineHeight: 1.9 }}>
                  Our elegant banquet hall sets the stage for weddings, receptions, and corporate
                  celebrations. Enjoy curated multi-cuisine menus from <strong>Dopwai</strong>, live
                  entertainment, and attentive service. Capacity up to <strong>200 guests</strong> with
                  in-house AV, DJ/karaoke, and decor support.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

// Add SEO metadata
(BanquetPage as any).seo = {
  title: "Banquet Hall",
  description:
    "Unforgettable weddings & events at Hotel Poinisuk. Elegant banquet hall with capacity up to 200 guests, curated multi-cuisine menus from Dopwai, live entertainment, AV/DJ/karaoke, and decor support.",
  keywords: "banquet hall Shillong, wedding venue Shillong, event hall Shillong, hotel banquet Shillong",
  ogImage: "/images/og/banquet.jpg",
};

