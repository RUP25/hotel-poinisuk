// components/ContactSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  GlobalStyles,
} from "@mui/material";

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We’ve received your message.");
  };

  return (
    <Box
      component="section"
      id="contact-section"
      sx={{
        // prevent sticky header overlap when scrolled to via anchor
        scrollMarginTop: { xs: 72, sm: 88, md: 120 },
      }}
    >
      {/* 🔧 Global hard clamps for tiny screens */}
      <GlobalStyles
        styles={{
          /* Safe area & root font fixes */
          ":root": {
            "--safe-top": "env(safe-area-inset-top, 0px)",
            "--safe-bottom": "env(safe-area-inset-bottom, 0px)",
          },

          /* Ultra small phones */
          "@media (max-width:360px)": {
            "#contact-hero h2": { fontSize: "1.55rem !important" },
            "#contact-hero .lead": { fontSize: "0.9rem !important" },
            "#contact-form .MuiInputBase-root": {
              height: "40px !important",
              minHeight: "40px !important",
            },
          },

          "@media (max-width:400px)": {
            "#contact-form .MuiFormControl-root": {
              margin: "4px 0 !important",
            },
            "#contact-form .MuiOutlinedInput-input, #contact-form .MuiInputBase-input":
              {
                padding: "9px 11px !important",
                fontSize: "0.92rem !important",
                lineHeight: "1.2 !important",
              },
            "#contact-form .MuiFormLabel-root": {
              fontSize: "0.9rem !important",
            },
          },

          "@media (max-width:480px)": {
            "#contact-form": {
              padding: "12px !important",
              borderRadius: "10px !important",
            },
          },

          /* Force single column ≤600px */
          "@media (max-width:600px)": {
            "#contact-grid": {
              gridTemplateColumns: "1fr !important",
            },
          },
        }}
      />

      {/* ======= HERO (content-driven) ======= */}
      <Box sx={{ position: "relative" }}>
        {/* Background */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(/images/contact-bg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // Subtle parallax feel on tall screens
            backgroundAttachment: { xs: "scroll", md: "fixed" },
          }}
        />
        {/* Overlay */}
        <Box aria-hidden sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.55)" }} />

        {/* Foreground content (drives height) */}
        <Box
          id="contact-hero"
          sx={{
            position: "relative",
            color: "#fff",
            px: { xs: 1.25, sm: 2.5, md: 3 },
            // Vertical rhythm by breakpoint
            py: {
              xs: "calc(24px + var(--safe-top))",
              sm: "calc(40px + var(--safe-top))",
              md: "calc(56px + var(--safe-top))",
            },
            // Make sure image isn’t too short even before form expands it
            minHeight: {
              xs: "520px",
              sm: "560px",
              md: "62vh",
              lg: "64vh",
            },
            display: "flex",
            alignItems: "center", // vertically center heading+form within minHeight
          }}
        >
          <Container maxWidth="lg" sx={{ width: "100%" }}>
            {/* Heading */}
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: 0.2,
                // Fluid typography via clamp: min, preferred vw, max
                fontSize: {
                  xs: "clamp(1.6rem, 6vw, 2.2rem)",
                  sm: "clamp(1.8rem, 5vw, 2.6rem)",
                  md: "clamp(2.1rem, 3.4vw, 2.8rem)",
                },
                mb: { xs: 1.25, sm: 1.75 },
                textAlign: "center",
              }}
            >
              Keep In Touch
            </Typography>

            {/* Lead */}
            <Typography
              className="lead"
              sx={{
                mx: "auto",
                maxWidth: { xs: 560, md: 760 },
                mb: { xs: 2.25, sm: 3 },
                opacity: 0.95,
                fontSize: {
                  xs: "0.95rem",
                  sm: "1.05rem",
                  md: "1.1rem",
                },
                lineHeight: { xs: 1.6, sm: 1.7 },
                textAlign: "center",
              }}
            >
              Have a question or feedback? Fill out the form below and our team at
              Hotel Poinisuk will get back to you as soon as possible.
            </Typography>

            {/* Form */}
            <Paper
              id="contact-form"
              component="form"
              onSubmit={handleSubmit}
              elevation={6}
              sx={{
                // Always centered and capped
                mx: "auto",
                width: {
                  xs: "clamp(280px, 92vw, 560px)",
                  sm: "clamp(520px, 88vw, 720px)",
                  md: "840px",
                },
                p: { xs: 1.25, sm: 2.5, md: 3.25 },
                bgcolor: { xs: "#ffffff", sm: "rgba(255,255,255,0.95)" },
                borderRadius: { xs: 1.25, sm: 1.5, md: 2 },
                boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
                backdropFilter: "saturate(120%) blur(2px)",
              }}
            >
              <Box
                id="contact-grid"
                display="grid"
                gap={{ xs: 1, sm: 1.6, md: 2 }}
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
              >
                <TextField fullWidth label="Your Name"     name="name"    variant="outlined" size="small" margin="dense" required />
                <TextField fullWidth label="Email Address" name="email"   type="email"      variant="outlined" size="small" margin="dense" required />
                <TextField fullWidth label="Phone Number"  name="phone"   variant="outlined" size="small" margin="dense" />
                <TextField fullWidth label="Subject"       name="subject" variant="outlined" size="small" margin="dense" />
                <Box gridColumn="1 / -1">
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    multiline
                    rows={3}
                    required
                  />
                </Box>

                <Box gridColumn="1 / -1" textAlign={{ xs: "center", sm: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#8B0000",
                      "&:hover": { bgcolor: "#700000" },
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.15 },
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      width: { xs: "100%", sm: "auto" },
                      borderRadius: 1.2,
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>

      {/* ======= FOOTER ======= */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#121212",
          color: "#eee",
          py: {
            xs: "calc(20px + var(--safe-bottom))",
            sm: "calc(28px + var(--safe-bottom))",
            md: "calc(36px + var(--safe-bottom))",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
            gap={{ xs: 3, sm: 3.5, md: 4 }}
            alignItems="center"
          >
            <Box textAlign={{ xs: "center", md: "left" }}>
              <Typography sx={{ fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: { xs: 1.7, md: 1.8 } }}>
                <strong>Address</strong><br />
                Lady Veronica Lane<br />
                Nongkynrih, Laitumkhrah<br />
                Shillong – Police Point
              </Typography>
            </Box>

            <Box textAlign="center">
              <Image
                src="/images/logo-poinisuk.png"
                alt="Hotel Poinisuk Logo"
                width={180}
                height={96}
                sizes="(min-width:1200px) 180px, (min-width:900px) 160px, 140px"
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                priority
              />
            </Box>

            <Box textAlign={{ xs: "center", md: "right" }}>
              <Typography sx={{ fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
                <strong>Reservations</strong><br />
                <a href="tel:+919108193968" style={{ color: "#eee", textDecoration: "none" }}>
                  +91 91081 93968
                </a>
              </Typography>
              <Typography sx={{ mt: 1, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
                <strong>Email</strong><br />
                <a href="mailto:info@hotelpoinisuk.com" style={{ color: "#eee", textDecoration: "none" }}>
                  info@hotelpoinisuk.com
                </a>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactSection;
