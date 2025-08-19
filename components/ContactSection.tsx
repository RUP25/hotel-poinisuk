import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We’ve received your message.");
  };

  return (
    <Box component="section" id="contact-section" sx={{ scrollMarginTop: { xs: 72, sm: 88, md: 120 } }}>
      {/* ── Hero / Form Overlay (content-driven height) ── */}
      <Box sx={{ position: "relative" }}>
        {/* Background image */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(/images/contact.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Blur + dark overlay */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(24,23,23,0.5)",
          }}
        />

        {/* Content (drives height) */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            px: { xs: 1.5, sm: 2.5, md: 3 },
            py: { xs: 4, sm: 6, md: 8 },         // vertical breathing room
            minHeight: { xs: 520, sm: 560, md: "62vh" }, // never too short
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "Georgia, serif",
          }}
        >
          <Container maxWidth="lg" sx={{ width: "100%" }}> 
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                lineHeight: 1.15,
                fontSize: {
                  xs: "clamp(1.6rem, 6vw, 2.1rem)",
                  sm: "clamp(1.8rem, 5vw, 2.4rem)",
                  md: "clamp(2.1rem, 3.5vw, 2.8rem)",
                },
              }}
            >
              <strong>Keep In Touch</strong>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mx: "auto",
                maxWidth: { xs: 560, md: 760 },
                mb: { xs: 2.25, sm: 3 },
                opacity: 0.95,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                lineHeight: { xs: 1.6, sm: 1.7 },
              }}
            >
              Have a question or feedback? Fill out the form below and our team
              at Hotel Poinisuk will get back to you as soon as possible.
            </Typography>

            {/* Form */}
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={6}
              sx={{
                mx: "auto",
                width: {
                  xs: "clamp(280px, 92vw, 560px)",
                  sm: "clamp(520px, 88vw, 720px)",
                  md: "840px",
                },
                p: { xs: 1.25, sm: 2.5, md: 3 },
                bgcolor: { xs: "rgba(255,255,255,0.10)", sm: "rgba(255,255,255,0.12)" },
                borderRadius: 2,
                backdropFilter: "blur(6px)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
              }}
            >
              <Box
                display="grid"
                gap={{ xs: 1.25, sm: 1.75, md: 2 }}
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                sx={{
                  "@media (max-width:600px)": {
                    gridTemplateColumns: "1fr !important",
                  },
                }}
              >
                {/* Use outlined + filled bg on mobile for readability */}
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  variant="outlined"
                  size="small"
                  required
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: { xs: "transparent", sm: "transparent" },
                      color: { xs: "#fff", sm: "#fff" },
                    },
                    "& .MuiInputLabel-root": {
                      color: { xs: "#fff", sm: "#fff" },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="outlined"
                  size="small"
                  required
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: { xs: "transparent", sm: "rgba(255,255,255,0.08)" },
                      color: { xs: "#111", sm: "#fff" },
                    },
                    "& .MuiInputLabel-root": {
                      color: { xs: "#fff", sm: "#fff" },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: { xs: "transparent", sm: "rgba(255,255,255,0.08)" },
                      color: { xs: "#fff", sm: "#fff" },
                    },
                    "& .MuiInputLabel-root": {
                      color: { xs: "#fff", sm: "#fff" },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: { xs: "transparent", sm: "rgba(255,255,255,0.08)" },
                      color: { xs: "#111", sm: "#fff" },
                    },
                    "& .MuiInputLabel-root": {
                      color: { xs: "#fff", sm: "#fff" },
                    },
                  }}
                />

                {/* Message spans full width */}
                <Box gridColumn="1 / -1">
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                    required
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: { xs: "transparent", sm: "rgba(255,255,255,0.08)" },
                        color: { xs: "#111", sm: "#fff" },
                      },
                      "& .MuiInputLabel-root": {
                        color: { xs: "#fff", sm: "#fff" },
                      },
                    }}
                  />
                </Box>

                {/* Submit */}
                <Box gridColumn="1 / -1" textAlign={{ xs: "center", sm: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#5f02ab",
                      "&:hover": { bgcolor: "#320953" },
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.25 },
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
    </Box>
  );
};

export default ContactSection;
