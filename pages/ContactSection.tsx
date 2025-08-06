// components/ContactSection.tsx

import React from "react";
import Image from "next/image";
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
    // TODO: POST to your backend
    alert("Thank you! We’ve received your message.");
  };

  return (
    <Box component="section" id="contact-section">
      {/* — Hero / Form Overlay — */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 500, md: 600 },
          backgroundImage: `url(/images/contact-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Keep In Touch
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mb: 4 }}>
            Have a question or feedback? Fill out the form below and our team at
            Hotel Poinisuk will get back to you as soon as possible.
          </Typography>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 800,
              p: 4,
              bgcolor: "#fff",
              borderRadius: 2,
            }}
          >
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            >
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                variant="filled"
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="filled"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                variant="filled"
              />
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                variant="filled"
              />

              {/* message spans both columns */}
              <Box gridColumn="1 / -1">
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  variant="filled"
                  multiline
                  rows={4}
                  required
                />
              </Box>

              {/* submit button */}
              <Box gridColumn="1 / -1" textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#8B0000",
                    "&:hover": { bgcolor: "#700000" },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* — Footer / Contact Details — */}
      <Box component="footer" sx={{ bgcolor: "#121212", color: "#eee", py: 4 }}>
        <Container maxWidth="lg">
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }}
            gap={4}
            alignItems="center"
          >
            {/* Address */}
            <Box textAlign={{ xs: "center", md: "left" }}>
              <Typography>
                <strong>Address</strong><br />
                Lady Veronica Lane<br />
                Nongkynrih, Laitumkhrah<br />
                Shillong – Police Point
              </Typography>
            </Box>

            {/* Logo */}
            <Box textAlign="center">
              <Image
                src="/images/logo-poinisuk.png"
                alt="Hotel Poinisuk Logo"
                width={150}
                height={80}
              />
            </Box>

            {/* Reservations */}
            <Box textAlign={{ xs: "center", md: "right" }}>
              <Typography>
                <strong>Reservations</strong><br />
                <a
                  href="tel:+919108193968"
                  style={{ color: "#eee", textDecoration: "none" }}
                >
                  +91 91081 93968
                </a>
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Email</strong><br />
                <a
                  href="mailto:info@hotelpoinisuk.com"
                  style={{ color: "#eee", textDecoration: "none" }}
                >
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
