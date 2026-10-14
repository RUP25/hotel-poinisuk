// components/AdminMinimalSiteHeader.tsx
//
// Shown on all `/admin/*` routes instead of TopBar + StickyAppBar.
// Logo only — links to the public home page.

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, useTheme } from "@mui/material";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";
import {
  HEADER_LOGO_ON_DARK_SRC,
  HEADER_LOGO_W,
  HEADER_LOGO_H,
} from "@/lib/luxury-chrome";

const AdminMinimalSiteHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar + 3,
        height: ADMIN_GLOBAL_HEADER_HEIGHT_PX,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 1, sm: 1.25 },
        bgcolor: "rgba(12, 8, 21, 0.94)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
        borderBottom: "1px solid rgba(202, 166, 255, 0.16)",
      }}
    >
      <Box
        component={Link}
        href="/"
        aria-label="Hotel Poinisuk — home"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 84, sm: 96 },
          maxWidth: { xs: 420, sm: 504 },
          flexShrink: 0,
          transition: "opacity 160ms ease",
          "&:hover": { opacity: 0.92 },
        }}
      >
        <Image
          src={HEADER_LOGO_ON_DARK_SRC}
          alt="Hotel Poinisuk"
          width={HEADER_LOGO_W}
          height={HEADER_LOGO_H}
          priority
          sizes="(max-width:600px) 420px, 504px"
          style={{
            width: "auto",
            height: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
};

export default AdminMinimalSiteHeader;
