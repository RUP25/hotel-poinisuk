// components/WelcomeSection.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const WelcomeSection: React.FC = () => (
  <Box
    id="welcome"
    component="section"
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "stretch",
      bgcolor: "#fff",
      overflow: "hidden",

      // Spacing
      mt: { xs: 3, sm: 4, md: 8, lg: 12, xl: 14 },
      pl: "15px", // exact 15px on all screens
      pr: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },

      // Visible gutter between columns
      gap: { xs: 2, sm: 3, md: 4, lg: 6 },

      // Baseline heights
      minHeight: { xs: 340, sm: 380, md: 480, lg: 540 },

      "@media (max-width:360px)": {
        pr: 1.5,
        gap: 1.5,
      },
    }}
  >
    {/* TEXT COLUMN */}
    <Box
      sx={{
        order: { xs: 1, md: 2 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
        pr: { xs: 0, sm: 1, md: 4, lg: 6 },
        maxWidth: { md: 760, lg: 820 },
        mx: { xs: 0, md: "auto" },
        "@supports not (gap: 1rem)": { ml: { md: 4, lg: 6 } },
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          textAlign: { xs: "left", md: "left" },
          fontWeight: 600,
          fontFamily: "Georgia, serif",
          letterSpacing: 0.5,
          mb: { xs: 1.25, sm: 2, md: 3 },
          fontSize: {
            xs: "clamp(1.5rem, 6.5vw, 2.1rem)",
            sm: "clamp(1.7rem, 5.5vw, 2.3rem)",
            md: "2.5rem",
            lg: "2.7rem",
            xl: "2.9rem",
          },
          lineHeight: 1.15,
          "@media (max-width:360px)": { fontSize: "1.45rem", letterSpacing: 0.3 },
        }}
      >
        Welcome
        <br />
        to Hotel Poinisuk
      </Typography>

      {/* --- Mobile: single condensed paragraph --- */}
      <Typography
        variant="body1"
        sx={{
          display: { xs: "block", sm: "none" },
          textAlign: { xs: "left", md: "justify" },
          color: "text.secondary",
          fontFamily: "Georgia, serif",
          mb: { xs: 1.5 },
          fontSize: "1rem",
        }}
      >
        In the heart of Laitumkhrah, Hotel Poinisuk blends warm hospitality with
        contemporary rooms—steps from the Cathedral of Mary Help of Christians and
        close to Shillong’s best cafés, spas, and gyms. Perfect for business,
        leisure, and a relaxing escape.
      </Typography>

      {/* --- Tablet & Desktop: full two paragraphs --- */}
      <Typography
        variant="body1"
        sx={{
          display: { xs: "none", sm: "block" },
          textAlign: "justify",
          color: "text.secondary",
          fontFamily: "Georgia, serif",
          mb: { sm: 2 },
          pr: { sm: 0, md: 6, lg: 10 },
          fontSize: { sm: "1.05rem", md: "1.1rem", lg: "1.12rem" },
        }}
      >
        Nestled in the heart of Laitumkhrah, Hotel Poinisuk offers an amazing range
        of accommodation options with heartwarming hospitality for business and leisure
        travelers. The well-appointed rooms boast contemporary amenities and ensure a
        comfortable stay for all guests.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          display: { xs: "none", sm: "block" },
          textAlign: "justify",
          color: "text.secondary",
          fontFamily: "Georgia, serif",
          pr: { sm: 0, md: 6, lg: 10 },
          fontSize: { sm: "1.05rem", md: "1.1rem", lg: "1.12rem" },
        }}
      >
        The location allows travelers easy access to the city's highlights, from the
        iconic Cathedral of Mary Help of Christians just steps away, to the city's
        best cafes, spas, and gyms. Perfect for both relaxation and adventure.
      </Typography>

      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          alignSelf: { xs: "stretch", md: "flex-start" },
        }}
      >
        <Link href="/rooms" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#5f02ab",
              color: "white",
              borderRadius: 0,
              px: { xs: 3, md: 4, lg: 5 },
              py: { xs: 1.1, md: 1.5 },
              fontWeight: 700,
              letterSpacing: 1,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: { xs: "0.95rem", md: "1rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "#2f0a4d" },
              "@media (max-width:360px)": { fontSize: "0.9rem", py: 1 },
            }}
          >
            View Rooms
          </Button>
        </Link>
      </Box>
    </Box>

    {/* IMAGE COLUMN */}
    <Box
      sx={{
        order: { xs: 2, md: 1 },
        position: "relative",
        flex: { xs: "none", md: "0 0 48%", lg: "0 0 50%" },
        width: { xs: "100%", md: "auto" },
        aspectRatio: { xs: "16 / 10", sm: "16 / 9", md: "auto" },
        height: { xs: "auto", sm: "auto", md: "auto" },
        minHeight: { md: 480, lg: 560, xl: 620 },
        borderRadius: { xs: 1, md: 0 },
        overflow: "hidden",
        boxShadow: { xs: 1, md: 0 },
        "@supports not (aspect-ratio: 1 / 1)": {
          height: { xs: 240, sm: 300, md: "auto" },
        },
        "@media (max-width:360px)": { aspectRatio: "3 / 2" },
      }}
    >
      <Image
        src="/images/image1.webp"
        alt="Hotel Poinisuk exterior"
        fill
        priority={false}
        sizes="(max-width: 900px) 100vw, 50vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </Box>
  </Box>
);

export default WelcomeSection;
