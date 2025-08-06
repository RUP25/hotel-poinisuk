// pages/klong.tsx
import React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import Footer from "@/components/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const KlongPage: React.FC = () => {
  const theme = useTheme();

  const fadeIn = {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(20px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  };

  const sectionSx = {
    ...fadeIn,
    display: "flex",
    flexDirection: { xs: "column", md: "row-reverse" },
    alignItems: "center",
    gap: theme.spacing(4),
    mb: theme.spacing(8),
  } as const;

  const textSx = {
    flex: 1,
    animation: "fadeIn 0.8s ease-out",
  } as const;

  const sliderSx = {
    flex: 1,
    borderRadius: 2,
    overflow: "hidden",
    animation: "fadeIn 0.8s ease-out",
  } as const;

  const klongImages = [
    "/images/bar/klong-bar1.jpg",
    "/images/bar/klong-bar.jpg",
    "/images/bar/bar.jpg",
    "/images/bar/masthead.jpeg",
    "/images/bar/masthead1.jpeg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <main>
      {/* ─── Masthead ─── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, md: 300 },
          backgroundImage: "url('/images/bar/masthead.jpeg')", // Replace with actual banner image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
          }}
        />
        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
       
        </Container>
      </Box>

      {/* ─── Content Section ─── */}
      <Container maxWidth="lg" sx={{ py: theme.spacing(6) }}>
        <Box component="section" sx={sectionSx}>
          {/* Image Slider */}
          <Box sx={sliderSx}>
            <Slider {...sliderSettings}>
              {klongImages.map((src, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 200, md: 400 },
                  }}
                >
                  <Image
                    src={src}
                    alt={`Klong Bar slide ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                  />
                </Box>
              ))}
            </Slider>
          </Box>

          {/* Text Content */}
          <Box sx={textSx}>
            <Typography variant="h3" component="h2" gutterBottom>
              Klong Lounge
            </Typography>
            <Typography variant="body1" gutterBottom>
              The lounge bar reiterates comfort and style—a kindred spirit in ambience. It thrives on its pep atmosphere to allow savouring of beverages amidst complete tranquillity.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Aptly manned by master bartenders, there’s a drink for every mood and every soul to match the pulsating vibes of energy.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Entertainment:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Live Music & Karaoke
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Timing:
            </Typography>
            <Typography variant="body2" gutterBottom>
              13:00 hrs – 22:30 hrs
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="contained" size="large">
                Book Now
              </Button>
              <Button variant="outlined" size="large">
                View More
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* ─── Footer ─── */}
      <Footer />
    </main>
  );
};

export default KlongPage;
