// pages/about.tsx
import React, { useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Container,
  Typography,
  Divider,
  GlobalStyles,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Footer from "@/components/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SSR-safe slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const APP_BAR_H = { xs: 100, sm: 150, md: 170 }; // adjust to your actual header stack

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Swap these to your real assets under /public/images/...
  const aboutSlides = ["/images/image5.jpg", "/images/image6.webp", "/images/about2.jpg"];

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 600,
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

  return (
    <main>
      {/* Global fixes for slick width/height + no horizontal scroll */}
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          body: { margin: 0, overflowX: "hidden" },

          /* Width rules */
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },

          /* Height inheritance to prevent blank panel */
          ".slick-slider": { height: "100%" },
          ".slick-list": { height: "100%" },
          ".slick-track": { height: "100%", display: "flex" },

          ".slick-slide": { height: "auto" },
          ".slick-slide > div": { height: "100%", width: "100%" },
        }}
      />

      <Head>
        <title>About Us | Hotel Poinisuk</title>
        <meta
          name="description"
          content="Learn about Hotel Poinisuk—our story, values, and the experience we craft in the heart of Shillong."
        />
      </Head>

      {/* ───────── Masthead (with padding to avoid header/logo overlap) ───────── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: "28vh", sm: "29vh", md: "32vh", lg: "42vh" },
          overflow: "hidden",
          // Fallback gradient so it never looks like a flat pane
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), radial-gradient(80% 60% at 50% 40%, #5e5e5e 0%, #444 35%, #2b2b2b 100%)",
        }}
      >
        {/* Background Image */}
        <Box sx={{ position: "absolute", inset: 0 }}>
          <Image
            className="kb-img"
            src="/images/image4.jpg"
            alt="Hotel Poinisuk — panoramic view"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
            onError={(e) => {
              (e.currentTarget as any).style.display = "none";
            }}
          />
        </Box>

        {/* Ken Burns */}
        <style>{`
          .kb-img { transform-origin: center; animation: kenburns 12s ease-in-out infinite alternate; }
          @media (prefers-reduced-motion: reduce) { .kb-img { animation: none !important; } }
          @keyframes kenburns {
            0% { transform: scale(1) }
            100% { transform: scale(1.08) translate(-1.5%,-1.5%) }
          }
        `}</style>

        {/* Overlay */}
        <Box aria-hidden sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.28)" }} />

        {/* Headline */}
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            textAlign: "center",
            px: { xs: 1, sm: 2, md: 2 },
            pt: {
              xs: `${APP_BAR_H.xs + 12}px`,
              sm: `${APP_BAR_H.sm + 14}px`,
              md: `${APP_BAR_H.md + 18}px`,
            },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                textShadow: "0 6px 28px rgba(0,0,0,0.45)",
                fontSize: { xs: "1.2rem", sm: "2.3rem", md: "2.6rem", lg: "3rem" },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              About Us
            </Typography>
            <Typography
              sx={{
                opacity: 0.95,
                textShadow: "0 4px 16px rgba(0,0,0,0.45)",
                fontSize: { xs: "0.7rem", sm: "1rem", md: "1.1rem" },
                mx: "auto",
                maxWidth: 760,
              }}
            >
              Mesmerizing views & modern comfort in the heart of Shillong
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ───────── Story + Carousel ───────── */}
      <Container sx={{ py: { xs: 5, sm: 6, md: 8 }, maxWidth: "lg" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: { xs: 0, md: 4, lg: 6 },
            rowGap: { xs: 3, md: 0 },
            alignItems: "center",
          }}
        >
          {/* Text column */}
          {/* Text column — replace this whole Box’s children with the code below */}
<Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / 2" } }}>
  {/* Kicker */}
  <Typography
    sx={{
      textTransform: "uppercase",
      letterSpacing: ".18em",
      fontWeight: 700,
      fontSize: { xs: 12, sm: 12.5 },
      color: "#a38f7c", // warm muted accent like reference
      mb: 1.25,
    }}
  >
    Established 2015
  </Typography>

  {/* Big headline */}
  <Typography
    component="h2"
    sx={{
      color: "#2b211b",
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: ".02em",
      fontFamily: `'Georgia','Times New Roman',serif`,
      fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.1rem", lg: "2.3rem" },
      mb: 2,
    }}
  >
  Hotel Poinisuk
  </Typography>

  {/* Body copy */}
  <Typography
    sx={{
      color: "text.secondary",
      fontSize: { xs: "0.98rem", sm: "1rem" },
      lineHeight: { xs: 1.75, md: 1.85 },
      mb: 2.25,
      maxWidth: 640,
      textAlign: "justify",
    }}
  >
    We are a city-center hotel in the heart of Shillong. Blending warm 
    hospitality with modern comforts, Hotel Poinisuk offers well-appointed
    rooms and thoughtful amenities for both business and leisure travelers.
    Enjoy Dopwai—our rooftop restaurant—along with a lively bar & lounge,
    free Wi-Fi, and a banquet hall that hosts up to 200 guests.
  </Typography>

  <Typography
    sx={{
      color: "text.secondary",
      fontSize: { xs: "0.98rem", sm: "1rem" },
      lineHeight: { xs: 1.75, md: 1.85 },
      mb: 2.75,
      maxWidth: 640,
      textAlign: "justify",
    }}
  >
  </Typography>

  {/* Signature + role */}
  <Box sx={{ mt: 1.25 }}>
    {/* If you add /public/images/signature.svg it’ll render; otherwise this hides silently */}
    <Box sx={{ position: "relative", width: 230, height: 52, mb: 0.5 }}>
      <Image
        src="/images/signature.svg"
        alt="Managing Director signature"
        fill
        sizes="230px"
        style={{ objectFit: "contain" }}
        onError={(e) => ((e.currentTarget as any).style.display = "none")}
      />
    </Box>

    {/* Fallback text signature (optional) */}
    <Typography
      sx={{
        fontFamily: `'Brush Script MT','Segoe Script',cursive`,
        fontSize: 24,
        color: "#8b6f59",
        display: { xs: "block" },
        mt: -0.5,
      }}
    >
      O. B. Tariang
    </Typography>

    <Typography sx={{ color: "text.secondary", mt: 0.25 }}>
      Oni Bilet Tariang — Managing Director
    </Typography>
  </Box>
</Box>


          {/* Image carousel (height-based to avoid blank panel) */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", md: "2 / 3" },
              borderRadius: 2,
              overflow: "hidden",
              width: "100%",
              height: { xs: 260, sm: 320, md: 420, lg: 520 },
              minHeight: 240,
              boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
              "& .slick-list, & .slick-track": { height: "100%" },
            }}
          >
            <Slider {...sliderSettings}>
              {aboutSlides.map((src, i) => (
                <Box key={`${src}-${i}`} sx={{ position: "relative", width: "100%", height: "100%" }}>
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

      {/* ───────── Highlights Gallery ───────── */}
      <Container sx={{ pb: { xs: 6, sm: 8, md: 10 }, maxWidth: "lg" }}>
        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            textAlign: "center",
            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" },
          }}
        >
          Experience Highlights
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            textAlign: "center",
            mb: { xs: 3, sm: 4, md: 5 },
            maxWidth: 820,
            mx: "auto",
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
          }}
        >
          Rooftop dining at Dopwai, elegant rooms & suites, and a lively bar and lounge—crafted
          for memorable stays.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {[
            { src: "/images/dine/dine9.jpeg", alt: "Dopwai Rooftop", caption: "Dopwai Rooftop Restaurant" },
            { src: "/images/rooms/masthead.jpg", alt: "Rooms", caption: "Deluxe & Premium Rooms" },
            { src: "/images/bar/masthead1.jpeg", alt: "Bar", caption: "Bar & Lounge" },
          ].map((card, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                height: { xs: 200, sm: 240, md: 280, lg: 320 },
                boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                "& .zoom-img": {
                  transform: "scale(1)",
                  transition: "transform 800ms cubic-bezier(.2,.8,.2,1)",
                },
                "&:hover .zoom-img": { transform: "scale(1.08)" },
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
                  background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05))",
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  left: 16,
                  bottom: 14,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {card.caption}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Footer />
    </main>
  );
};

export default AboutPage;
