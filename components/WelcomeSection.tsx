// components/WelcomeSection.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import HighlightsShowcase from "@/components/HighlightsShowcase";

const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";

const WelcomeSection: React.FC = () => (
  <Box
    id="welcome"
    component="section"
    sx={{
      bgcolor: "#f1ecdbff",
      px: { xs: 2, sm: 3, md: 6 },
      // no top padding: the showcase is a full-bleed wood block that runs
      // straight on from the hero and carries the section heading itself
      pt: 0,
      pb: { xs: 5, sm: 7, md: 10 },
    }}
  >
    <HighlightsShowcase />

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
          component="p"
          sx={{
            fontFamily: cormorant,
            fontWeight: 500,
            color: "text.secondary",
            lineHeight: 1.8,
            fontSize: { xs: "1.03rem", md: "1.3rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Hotel Poinisuk readies every room for city comfort with crisp linen bedding, modern in-room entertainment, and a 24/7 front desk—plus rooftop dining at Dopwai and signature drinks at Klong.
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: cormorant,
            fontWeight: 500,
            color: "text.secondary",
            lineHeight: 1.8,
            fontSize: { xs: "1.03rem", md: "1.3rem" },
            textAlign: { xs: "center", md: "left" },
            mt: { xs: 2, md: 2.5 },
          }}
        >
          Centrally located at Police Point in Laitumkhrah—a short drive from Ward&apos;s Lake and Lady Hydari Park—Hotel Poinisuk is consistently rated among the best boutique hotels in Shillong for both leisure and business stays.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default WelcomeSection;
