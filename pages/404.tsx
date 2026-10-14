// pages/404.tsx
import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import Footer from "@/components/Footer";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
const cormorant =
  "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";

const LAVENDER = "#caa6ff";
const DEEP = "#320953";

// Internal recovery links — give crawlers + users somewhere to go.
// Same set Taj/Oberoi 404 pages surface (booking funnel + main sections).
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Dopwai Restaurant", href: "/dine" },
  { label: "Klong Lounge", href: "/klong" },
  { label: "Banquet Hall", href: "/banquet" },
  { label: "About Us", href: "/about" },
  { label: "Book a Room", href: "/booking" },
];

const NotFoundPage: NextPageWithSeo = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          minHeight: { xs: "70vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #1a1230 0%, #140c26 60%, #0d0719 100%)",
          color: "#f4eefe",
          textAlign: "center",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 8, sm: 10, md: 14 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="p"
            sx={{
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: LAVENDER,
              mb: 2,
            }}
          >
            Error 404
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: cormorant,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.6rem", lg: "5.4rem" },
              lineHeight: 1.05,
              color: "#fff",
              mb: { xs: 1.5, md: 2 },
            }}
          >
            Page not found
          </Typography>

          <Typography
            component="p"
            sx={{
              fontFamily: cormorant,
              fontWeight: 500,
              fontSize: { xs: "1.05rem", sm: "1.15rem", md: "1.25rem" },
              color: "rgba(244,238,254,0.78)",
              maxWidth: 580,
              mx: "auto",
              mb: { xs: 4, md: 5 },
            }}
          >
            We can&apos;t find the page you were looking for. It may have moved
            or no longer exist. Try one of the links below to continue your
            journey.
          </Typography>

          {/* Lavender hairline */}
          <Box
            sx={{
              mx: "auto",
              maxWidth: 420,
              height: "1px",
              background: `linear-gradient(90deg, rgba(202,166,255,0) 0%, ${LAVENDER} 50%, rgba(202,166,255,0) 100%)`,
              mb: { xs: 4, md: 5 },
            }}
          />

          <Box
            component="nav"
            aria-label="Recovery links"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 1, sm: 1.25, md: 1.5 },
              mb: { xs: 4, md: 5 },
            }}
          >
            {QUICK_LINKS.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                variant="outlined"
                sx={{
                  fontFamily: cinzel,
                  fontWeight: 600,
                  fontSize: { xs: "0.72rem", md: "0.78rem" },
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#f4eefe",
                  borderColor: "rgba(202,166,255,0.35)",
                  borderRadius: 0,
                  px: { xs: 1.75, md: 2.25 },
                  py: { xs: 0.85, md: 1 },
                  transition:
                    "color 220ms ease, border-color 220ms ease, background-color 220ms ease, letter-spacing 280ms ease",
                  "&:hover": {
                    color: LAVENDER,
                    borderColor: LAVENDER,
                    background: "rgba(202,166,255,0.08)",
                    letterSpacing: "0.26em",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{
              fontFamily: cinzel,
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              borderRadius: 0,
              px: { xs: 3.5, md: 5 },
              py: { xs: 1.1, md: 1.4 },
              backgroundColor: DEEP,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#76046b", boxShadow: "none" },
            }}
          >
            Return Home
          </Button>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

NotFoundPage.seo = {
  title: "Page Not Found",
  description:
    "We can't find the page you were looking for. Browse rooms, dining, lounge, banquet hall, or return to the Hotel Poinisuk home page.",
  noindex: true,
};

export default NotFoundPage;
