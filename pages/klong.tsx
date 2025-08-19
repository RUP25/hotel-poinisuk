// pages/klong.tsx
import React from "react";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  GlobalStyles,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Footer from "@/components/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const KlongPage: React.FC = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const images = [
    "/images/bar/klong-bar1.jpg",
    "/images/bar/klong-bar.jpg",
    "/images/bar/bar.jpg",
    "/images/bar/masthead.jpeg",
    "/images/bar/masthead1.jpeg",
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
  } as const;

  return (
    <main>
      <Head>
        <title>Klong Lounge | Hotel Poinisuk</title>
        <meta
          name="description"
          content="Relax at Klong Lounge in Hotel Poinisuk — live music, karaoke, curated drinks, and vibrant ambience in Shillong."
        />
      </Head>

      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          html: { width: "100%" },
          body: { width: "100%", margin: 0, overflowX: "hidden" },
          main: { width: "100%", maxWidth: "100vw" },
          // don’t force heights globally; we’ll do it inside the ratio wrapper
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },
        }}
      />

      {/* Masthead */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 220, sm: 240, md: 300, lg: 360 },
          backgroundImage: "url('/images/bar/masthead.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,.45)" }} />
        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
            px: { xs: 2, sm: 3, md: 4 },
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              fontSize: { sm: "clamp(1.6rem, 4.5vw, 2.6rem)" },
            }}
          >
            Klong Lounge
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 3, sm: 4, md: 5 },
          pb: { xs: 5, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: { xs: 0, sm: 4, lg: 6 },
            rowGap: { xs: 3, sm: 4 },
            alignItems: "start",
            minWidth: 0,
          }}
        >
          {/* Text */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", md: "1 / 2" },
              alignSelf: "start",
              minWidth: 0,
            }}
          >
            <Typography
              component="h1"
              gutterBottom
              sx={{
                mt: 0,
                fontWeight: 700,
                letterSpacing: 0.4,
                fontSize: { xs: "clamp(1.4rem, 6vw, 1.9rem)", md: "2.2rem" },
                lineHeight: 1.15,
              }}
            >
              Klong Lounge
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
              The lounge bar reiterates comfort and style—a kindred spirit in
              ambience. It thrives on its pep atmosphere to allow savouring of
              beverages amidst complete tranquillity.
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
              Aptly manned by master bartenders, there’s a drink for every mood
              and every soul to match the pulsating vibes of energy.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: { xs: 1, sm: 1.5 } }}>
              Entertainment:
            </Typography>
            <Typography variant="body2" sx={{ mb: { xs: 1.5, sm: 2 } }}>
              Live Music & Karaoke
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: { xs: 1, sm: 1.5 } }}>
              Timing:
            </Typography>
            <Typography variant="body2">13:00 hrs – 22:30 hrs</Typography>

            <Box
              sx={{
                mt: { xs: 2.5, sm: 3 },
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Button variant="contained" size="large" color="primary" href="/booking">
                Book Now
              </Button>
              <Button variant="outlined" size="large" color="primary" href="/bar/klong">
                View More
              </Button>
            </Box>
          </Box>

          {/* Slider */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", md: "2 / 3" },
              alignSelf: "start",
              width: "100%",
              minWidth: 0,
              borderRadius: { xs: 1.5, md: 2 },
              overflow: "hidden",
              "& .slick-list": { borderRadius: { xs: 1.5, md: 2 } },
            }}
          >
            {/* Aspect-ratio wrapper that *also* forces slick internals to fill it */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: { xs: "4 / 3", sm: "16 / 10", md: "16 / 9", lg: "10 / 9" },
                minHeight: { xs: 260, sm: 320, md: 360 },
                // CRUCIAL: make slick use this height instead of collapsing to 0
                "& .slick-slider, & .slick-list, & .slick-track": { height: "100%" },
                "& .slick-slide, & .slick-slide > div": { height: "100%" },
              }}
            >
              <Slider {...sliderSettings}>
                {images.map((src, i) => (
                  <Box key={i} sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image
                      src={src}
                      alt={`Klong Lounge slide ${i + 1}`}
                      fill
                      sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 600px"
                      style={{ objectFit: "cover" }}
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
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

export default KlongPage;
