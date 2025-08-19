// pages/banquet.tsx
import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
// Use dynamic import to avoid any SSR hiccups with react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banquetImages = [
  "/images/banq1.jpg",
  "/images/banq2.jpg",
  "/images/banq3.avif",
  "/images/banquet.avif",
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  fade: true,
  arrows: false,
  pauseOnHover: false,
};

const sampleEvents = [
  {
    title: "Wedding Reception",
    description:
      "Celebrate your special day with bespoke décor, gourmet catering, and a spacious dance floor.",
    image: "/images/events/wedding.jpg",
  },
  {
    title: "Corporate Launch",
    description:
      "State-of-the-art AV, customizable seating plans, and high-speed Wi-Fi to impress your guests.",
    image: "/images/events/corporate.jpg",
  },
  {
    title: "Private Party",
    description:
      "Intimate gatherings with live music options, custom lighting, and curated menus.",
    image: "/images/events/party.jpg",
  },
];

const BanquetPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Banquet Hall | Hotel Poinisuk</title>
        <meta
          name="description"
          content="Banquet hall at Hotel Poinisuk—host weddings, receptions, corporate launches, and private parties with AV, catering, and décor."
        />
      </Head>

      <main id="banquet">
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 6, md: 10 },
              minHeight: { md: "70vh" },
            }}
          >
            {/* LEFT: TEXT + BUTTONS */}
            <Box sx={{ flex: 1, pr: { md: 8 } }}>
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: { xs: "2rem", md: "2.7rem" },
                  lineHeight: 1.15,
                }}
              >
                Celebrate Unforgettable Events
                <br />
                at Our Banquet Hall
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  color: "#444",
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  fontFamily: "Georgia, serif",
                  maxWidth: 760,
                }}
              >
                Our grand banquet hall can host up to 200 guests—ideal for weddings,
                receptions, corporate launches, and private parties. With flexible seating,
                state-of-the-art AV, custom décor, and gourmet catering, your celebration is
                in expert hands at Hotel Poinisuk.
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  href="/#contact"
                  sx={{
                    bgcolor: "#5f02ab",
                    color: "white",
                    borderRadius: 0,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    "&:hover": { bgcolor: "#5f02ab" },
                  }}
                >
                  Book Now
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setOpen(true)}
                  sx={{
                    borderColor: "#5f02ab",
                    color: "#5f02ab",
                    borderRadius: 0,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    "&:hover": { borderColor: "#3b0964ff", color: "#3b0964ff" },
                  }}
                >
                  View More
                </Button>
              </Box>
            </Box>

            {/* RIGHT: IMAGE SLIDER */}
            <Box
              sx={{
                flex: 1,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 4,
                width: "100%",
                maxWidth: 640,
              }}
            >
              <Slider {...sliderSettings}>
                {banquetImages.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: { xs: 260, sm: 320, md: 420, lg: 520 },
                      overflow: "hidden",
                      "& img": {
                        // Optional subtle Ken Burns zoom
                        animation: "kbZoom 7s ease-in-out",
                      },
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Banquet image ${idx + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                    {/* Readability overlay (very subtle) */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)",
                      }}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>
        </Container>
      </main>

      {/* ─── VIEW MORE MODAL ─── */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Our Banquet Events
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
            }}
          >
            {sampleEvents.map((evt) => (
              <Box key={evt.title}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <Image
                    src={evt.image}
                    alt={evt.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {evt.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {evt.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Global keyframes for Ken Burns */}
      <style jsx global>{`
        @keyframes kbZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
};

export default BanquetPage;
