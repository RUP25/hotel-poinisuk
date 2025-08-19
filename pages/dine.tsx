// pages/dine.tsx
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  GlobalStyles,
} from "@mui/material";
import Footer from "@/components/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SSR-safe slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const DinePage: React.FC = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // simple fade-in keyframes
  const fadeIn = {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(16px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  };

  const sectionSx = {
    ...fadeIn,
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(0,1fr)" },
    columnGap: { xs: 0, sm: 4, lg: 6 },
    rowGap: { xs: 3, sm: 4 },
    alignItems: "center",
    mb: { xs: 6, md: 8 },
    minWidth: 0,
  } as const;

  const textSx = {
    gridColumn: { xs: "1 / -1", md: "1 / 2" },
    animation: reduceMotion ? "none" : "fadeIn 0.8s ease-out",
    minWidth: 0,
  } as const;

  const sliderWrapSx = {
    gridColumn: { xs: "1 / -1", md: "2 / 3" },
    borderRadius: { xs: 1.5, md: 2 },
    overflow: "hidden",
    animation: reduceMotion ? "none" : "fadeIn 0.6s ease-out",
    minWidth: 0,
    // ensure slick fills the wrapper height
    "& .slick-slider, & .slick-list, & .slick-track": { height: "100%" },
    "& .slick-slide, & .slick-slide > div": { height: "100%" },
    "& .slick-list": { borderRadius: { xs: 1.5, md: 2 } },
  } as const;

  const dineImages = [
    "/images/dine/dinemasthead.jpeg",
    "/images/dine/dine3.jpg",
    "/images/dine/dine5.jpg",
    "/images/dine/dine7.jpeg",
    "/images/dine/dine9.jpeg",
    "/images/dine/dine10.jpeg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: reduceMotion ? 0 : 600,
    autoplay: !reduceMotion,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    adaptiveHeight: false,
  } as const;

  return (
    <main>
      {/* hard fixes (mobile width + slick sizing helpers) */}
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          html: { width: "100%" },
          body: { width: "100%", margin: 0, overflowX: "hidden" },
          main: { width: "100%", maxWidth: "100vw" },
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },
          ".slick-track": { display: "flex" },
          ".slick-slide": { height: "auto" },
          ".slick-slide > div": { height: "100%", width: "100%" },
        }}
      />

      {/* ─── Masthead ─── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 220, sm: 260, md: 320, lg: 380 }, // ← fixed (was 800 on xs)
          backgroundImage: "url('/images/dine/masthead1.jpeg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.45)" }} />
        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              color: "#fff",
              fontWeight: 700,
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              fontSize: { sm: "clamp(1.6rem, 4.5vw, 2.6rem)" },
            }}
          >
            Dining
          </Typography>
        </Container>
      </Box>

      {/* ─── Content ─── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box component="section" sx={sectionSx}>
          {/* Text */}
          <Box sx={textSx}>
            <Typography
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: 0.4,
                fontSize: { xs: "clamp(1.4rem, 6vw, 1.9rem)", md: "2.2rem" },
                lineHeight: 1.15,
              }}
            >
              DOPWAI
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                lineHeight: { xs: 1.7, md: 1.8 },
                mb: { xs: 1.25, sm: 1.5 },
                textAlign: "justify",
              }}
            >
              Our rooftop restaurant is always brimming with tantalizing fragrances and offers multi-cuisine
              delicacies ranging from Indian to Italian and Asian. Delivering oriental tastes in the purest form,
              this setting is a montage of classic and contemporary taste under one ethnic roof.
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                lineHeight: { xs: 1.7, md: 1.8 },
                mb: { xs: 2, sm: 2.5 },
                textAlign: "justify",
              }}
            >
              Each dish is prepared with meticulousness such that it’s perfect for sinful, pulsating vibes of energy.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: { xs: 1, sm: 1.5 } }}>
              Signature Dish:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Grilled Lemon Butter Chicken with Garlic Risotto
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: { xs: 1, sm: 1.5 } }}>
              Timing:
            </Typography>
            <Typography variant="body2" gutterBottom>
              12:30 hrs – 22:30 hrs
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: { xs: 1, sm: 1.5 } }}>
              Seating Capacity:
            </Typography>
            <Typography variant="body2" gutterBottom>
              95 covers (51 inside + 44 outside smoking)
            </Typography>

            <Box
              sx={{
                mt: { xs: 2.5, sm: 3 },
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Button variant="contained" size="large" sx={{ width: { xs: "100%", sm: "auto" } }}>
                Book Now
              </Button>
              <Button variant="outlined" size="large" sx={{ width: { xs: "100%", sm: "auto" } }}>
                View More
              </Button>
            </Box>
          </Box>

          {/* Image Carousel */}
          <Box sx={sliderWrapSx}>
            {/* Responsive HEIGHT via aspect-ratio */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: { xs: "4 / 3", sm: "16 / 10", md: "16 / 9", lg: "10 / 9" },
              }}
            >
              <Slider {...sliderSettings}>
                {dineImages.map((src, index) => (
                  <Box key={index} sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image
                      src={src}
                      alt={`Dopwai slide ${index + 1}`}
                      fill
                      sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 600px"
                      style={{ objectFit: "cover" }}
                      priority={index === 0}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>
        </Box>
      </Container>

      <Footer />
    </main>
  );
};

export default DinePage;
