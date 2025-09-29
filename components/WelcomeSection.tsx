// components/WelcomeSection.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const WelcomeSection: React.FC = () => (
  <Box
    id="welcome"
    component="section"
    sx={{
      bgcolor: "#f1ecdbff",
      px: { xs: 2, sm: 3, md: 6 },
      py: { xs: 5, sm: 7, md: 10 },
    }}
  >
    {/* HEAD */}
    <Box sx={{ maxWidth: 820, mx: "auto", textAlign: "center" }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: "Georgia, serif",
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: 0.3,
          fontSize: {
            xs: "clamp(1.6rem,5.6vw,2rem)",
            md: "2.2rem",
            lg: "2.35rem",
          },
        }}
      >
        Experience Bespoke Luxury
        <br />
        Where the hills meet the clouds
      </Typography>

      <Box
        sx={{
          width: 280,
          height: 1.5,
          bgcolor: "#918575ff",
          mx: "auto",
          my: { xs: 1.75, md: 2.25 },
        }}
      />

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          color: "text.secondary",
          maxWidth: 720,
          mx: "auto",
          lineHeight: 1.6,
          fontSize: { xs: "1rem", md: "1.3rem" },
        }}
      >
        Designed for Shillong, made at Poinisuk. Each room features artisan-made teak furniture in Khasi wood, layered with soft linens, warm lighting, and amenities that matter—tea/coffee makers, speedy Wi-Fi, and heating in select categories.
      </Typography>
    </Box>

    {/* IMAGE + RIGHT COPY */}
    <Box
      sx={{
        mt: { xs: 5, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "flex-start" },
        gap: { xs: 3.5, md: 6 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      {/* JUST IMPORT THE IMAGE AS-IS */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 560, md: 600 },
          aspectRatio: "4 / 3",
        }}
      >
        <Image
          src="/images/ponisuk_frame.png" // your framed+shadow image
          alt="Hotel Poinisuk terrace view at sunset"
          fill
          sizes="(max-width: 900px) 100vw, 600px"
          style={{ objectFit: "cover" }}
          priority={false}
        />
      </Box>

      {/* RIGHT COPY */}
      <Box sx={{ flex: 1, maxWidth: { xs: 680, md: 420 } }}>
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "text.secondary",
            lineHeight: 1.8,
            fontSize: { xs: "1.03rem", md: "1.3rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Hotel Poinisuk readies every room for city comfort with crisp linen bedding, modern in-room entertainment, and a 24/7 front desk—plus rooftop dining at Dopwai and signature drinks at Klong.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default WelcomeSection;
