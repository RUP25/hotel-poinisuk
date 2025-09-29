// components/FeaturesSection.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

type Feature = {
  title: string;   // used only to place the tile (not shown)
  image: string;
  href: string;
  subtitle?: string; // ignored visually
};

interface FeaturesSectionProps {
  features: Feature[];
}

const areaFor = (title: string) => {
  const t = title.trim().toLowerCase();
  if (t.includes("poinisuk")) return "poinisuk";
  if (t.includes("executive") && t.includes("non")) return "execNonAc";
  if (t.includes("deluxe") && t.includes("non")) return "deluxeNonAc";
  if (t.includes("premium")) return "premium";
  if (t.includes("deluxe")) return "deluxe";
  return undefined;
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <Box component="section" sx={{ mt: { xs: 6, md: 10 }, mb: { xs: 6, md: 12 }, textAlign: "center" }}>
      {/* Top-center sketch */}
      <Box
        aria-hidden
        sx={{
          position: "relative",
          width: { xs: 110, sm: 130, md: 160 },
          height: { xs: 58, sm: 70, md: 200 },
          mx: "auto",
          mb: 1,
          maskImage: "radial-gradient(closest-side, black 78%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, black 78%, transparent 100%)",
        }}
      >
        <Image
          src="/images/sketch.png"
          alt=""
          fill
          sizes="150px"
          style={{
            objectFit: "contain",
            mixBlendMode: "multiply",
            opacity: 0.78,
            filter: "grayscale(100%) contrast(95%) brightness(0.96) drop-shadow(0 10px 20px rgba(0,0,0,.18))",
          }}
        />
      </Box>

      {/* Header */}
      <Box sx={{ mb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: "text.secondary",
            mb: 1,
            fontSize: { xs: "1rem", md: "1.8rem" },
          }}
        >
          Experience Comfort
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{ fontFamily: "Georgia, serif", fontWeight: 800, color: "#3f2a2a", letterSpacing: 1, mb: 1 }}
        >
          EXPLORE OUR ROOMS &amp; SUITES
        </Typography>

        {/* Flourish */}
        <Box sx={{ mx: "auto", width: 64, height: 16, position: "relative" }}>
          <Box sx={{ position: "absolute", top: "50%", left: 0, width: 180, height: 2, bgcolor: "#b6afa6", transform: "translateY(-50%)" }} />
          <Box sx={{ position: "absolute", top: "50%", right: 0, width: 180, height: 2, bgcolor: "#b6afa6", transform: "translateY(-50%)" }} />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              fontSize: 16,
              fontFamily: "Georgia, serif",
              color: "#b6afa6",
              letterSpacing: 2,
            }}
          >
            ~~~
          </Box>
        </Box>
      </Box>

      {/* Mosaic — SAME layout on all breakpoints, only sizes change */}
      <Box sx={{ position: "relative", maxWidth: 1500, mx: "auto", px: { xs: 1.5, sm: 3, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "1fr 1fr 1fr", // ← keep 3 columns everywhere
            gridAutoRows: { xs: 120, sm: 180, md: 230, lg: 260 }, // ← scale down on small screens
            gridTemplateAreas: {
              // ← single mosaic layout for all sizes
              xs: `"poinisuk execNonAc  deluxe"
                   "poinisuk deluxeNonAc deluxe"
                   "poinisuk premium     premium"`,
              sm: `"poinisuk execNonAc  deluxe"
                   "poinisuk deluxeNonAc deluxe"
                   "poinisuk premium     premium"`,
              md: `"poinisuk execNonAc  deluxe"
                   "poinisuk deluxeNonAc deluxe"
                   "poinisuk premium     premium"`,
              lg: `"poinisuk execNonAc  deluxe"
                   "poinisuk deluxeNonAc deluxe"
                   "poinisuk premium     premium"`,
            },
          }}
        >
          {features.map((f) => {
            const area = areaFor(f.title);
            if (!area) return null;

            return (
              <Box
                key={f.title}
                component={Link}
                href={f.href}
                sx={{
                  gridArea: area,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "#fff",
                  backgroundImage: `url(${f.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  overflow: "hidden",
                  transition: "transform .32s cubic-bezier(.4,2,.3,1)",
                  "&:hover": { transform: "scale(1.02)" },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      area === "deluxe"
                        ? "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15))"
                        : "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.20))",
                    zIndex: 1,
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesSection;
