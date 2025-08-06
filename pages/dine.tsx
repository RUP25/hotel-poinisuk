// pages/dine.tsx
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

const DinePage: React.FC = () => {
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
    flexDirection: { xs: "column", md: "row" },
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
    animation: "fadeIn 0.6s ease-out",
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
          height: { xs: 800, md: 280 },
          backgroundImage: "url('/images/dine/masthead1.jpeg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
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
          {/* <Typography
            variant="h2"
            component="h1"
            color="common.white"
            sx={{ pr: { md: 4 } }}
          >
            Dining
          </Typography> */}
        </Container>
      </Box>

      {/* ─── Content ─── */}
      <Container maxWidth="lg" sx={{ py: theme.spacing(6) }}>
        {/* DOPWAI Section */}
        <Box component="section" sx={sectionSx}>
          {/* Text Content */}
          <Box sx={textSx}>
            <Typography variant="h3" component="h2" gutterBottom>
              DOPWAI
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Our rooftop restaurant is always brimming with tantalizing fragrances and offers multi-cuisine delicacies ranging from Indian to Italian and Asian. Delivering oriental tastes in the purest form, this setting is a montage of classic and contemporary taste under one ethnic roof.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Each dish is prepared with meticulousness such that it’s perfect for sinful, pulsating vibes of energy.
            </Typography>
            <Typography variant="subtitle1" component="p" gutterBottom>
              Signature Dish:
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Grilled Lemon Butter Chicken with Garlic Risotto
            </Typography>
            <Typography variant="subtitle1" component="p" gutterBottom>
              Timing:
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              12:30 hrs – 22:30 hrs
            </Typography>
            <Typography variant="subtitle1" component="p" gutterBottom>
              Seating Capacity:
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              95 covers (51 inside + 44 outside smoking)
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

          {/* Image Carousel */}
          <Box sx={sliderSx}>
            <Slider {...sliderSettings}>
              {dineImages.map((src, index) => (
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
                    alt={`Dopwai slide ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Container>

      {/* ─── Footer ─── */}
      <Footer />
    </main>
  );
};

export default DinePage;
