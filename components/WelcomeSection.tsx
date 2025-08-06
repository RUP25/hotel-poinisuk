import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { pl } from "date-fns/locale";

const WelcomeSection = () => (
  <Box
    id="welcome"
    component="section"
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      bgcolor: "#fff",
      borderRadius: 0,
      overflow: "hidden",
      mt: { xs: 4, md: 8, lg: 12 },
      minHeight: { xs: 360, md: 480 },
      boxShadow: 0,
    }}
  >
    {/* IMAGE COLUMN */}
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", md: "45%" },
        height: { xs: 400, md: "100%" },
        minHeight: { xs: 400, md: 500 },
        flex: "none",
        ml: 9,
        mb:4,
      }}
    >
      <Image
        src="/images/image1.webp"
        alt="Hotel Poinisuk exterior"
        fill
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        priority
        sizes="(max-width: 900px) 100vw, 45vw"
      />
    </Box>

    {/* TEXT COLUMN */}
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ml:25,
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          textAlign: "justify",
          fontWeight: 500,
          fontFamily: "Georgia, serif",
          letterSpacing: 1,
          mb: 3,
        }}
      >
        Welcome<br />
        to Hotel Poinisuk
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "justify",
          color: "GrayText",
          fontFamily: "Georgia, serif",
          mb: 2,
          pr:30,
          fontSize: "1.1 rem",
        }}
      >
        Nestled in the heart of Laitumkhrah, Hotel Poinisuk offers an amazing range of accommodation options with heartwarming hospitality for business and leisure travelers. The well-appointed rooms boast contemporary amenities and ensure a comfortable stay for all guests.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "justify",
          color: "GrayText",
          fontFamily: "Georgia, serif",
          pr:30,
          fontSize: "1.1 rem",
        }}
      >
        The location allows travelers easy access to the city's highlights, from the iconic Cathedral of Mary Help of Christians just steps away, to the city's best cafes, spas, and gyms. Perfect for both relaxation and adventure.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Link href="/rooms" passHref>
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
              "&:hover": { bgcolor: "#2f0a4d" },
            }}
          >
            View Rooms
          </Button>
        </Link>
      </Box>
    </Box>
  </Box>
);

export default WelcomeSection;
