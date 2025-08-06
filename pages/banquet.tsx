import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banquetImages = [
  "/images/banq1.jpg",
  "/images/banq2.jpg",
  "/images/banq3.avif",
  "/images/banquet.avif",
  // Add more banquet images if needed
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

const BanquetPage: React.FC = () => {
  return (
    <main>
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
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: { xs: "2rem", md: "2.7rem" },
              }}
            >
              Celebrate Unforgettable Events<br />
              at Our Banquet Hall
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#444",
                mb: 3,
                fontSize: "1.1rem",
                fontFamily: "Georgia, serif",
              }}
            >
              Our grand banquet hall can host up to 200 guests—ideal for weddings, receptions, corporate launches, and private parties. With flexible seating, state-of-the-art AV, custom décor, and gourmet catering, your celebration is in expert hands at Hotel Poinisuk.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#5f02ab",
                  color: "white",
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontFamily: "'Montserrat',sans-serif",
                  "&:hover": { bgcolor: "#5f02ab" },
                }}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#5f02ab",
                  color: "#5f02ab",
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontFamily: "'Montserrat',sans-serif",
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
              minHeight: 400,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
              width: "100%",
              maxWidth: 600,
            }}
          >
            <Slider {...sliderSettings}>
              {banquetImages.map((img, idx) => (
                <Box
                  key={img}
                  sx={{
                    width: "100%",
                    height: { xs: 260, md: 420 },
                    position: "relative",
                  }}
                >
                  <Image
                    src={img}
                    alt={`Banquet event ${idx + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={idx === 0}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Container>
    </main>
  );
};

export default BanquetPage;
