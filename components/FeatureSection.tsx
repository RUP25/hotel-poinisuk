// components/FeaturesSection.tsx

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Feature = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

interface FeaturesSectionProps {
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <Box
      id="guest-services"
      component="section"
      sx={{
        mt: { xs: 4, md: 6 },
        mb: { xs: 4, md: 8 },
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        ml: "-50vw",
        mr: "-50vw",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {features.map((f) => (
          <Box
            key={f.title}
            component={Link}
            href={f.href}
            sx={{
              position: "relative",
              height: 240,
              borderRadius: 0, 
              overflow: "hidden",
              textDecoration: "none",
              backgroundImage: `url(${f.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition:
                "transform 0.3s cubic-bezier(.4,2,.3,1), box-shadow 0.3s, z-index 0s",
              boxShadow: 2,
              zIndex: 1,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.4)",
                transition: "background 0.3s cubic-bezier(.4,2,.3,1)",
                zIndex: 2,
              },
              "&:hover": {
                transform: "scale(1.04) translateY(-4px)",
                boxShadow: 8,
                zIndex: 10,
                "&::before": {
                  bgcolor: "rgba(0,0,0,0.65)",
                },
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 3,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",          // center horizontally
                textAlign: "center",
                color: "#fff",
                fontFamily: "Georgia, serif",
              }}
            >
              <Typography variant="h5" color="inherit" fontWeight="bold">
                {f.title}
              </Typography>
              <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
                {f.subtitle}
              </Typography>
              {/* <ArrowForwardIosIcon sx={{ color: "inherit", mt: 2 }} /> */}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturesSection;
