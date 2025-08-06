import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Footer from "../components/Footer";

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We’ve received your message.");
  };

  return (
    <Box component="section" id="contact-section">
      {/* ─── Hero / Form Overlay with Blur ─── */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 500, md: 600 },
          backgroundImage: `url(/images/contact.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(24, 23, 23, 0.5)",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            px: 2,
            textAlign: "center",
            color: "#fff",
            fontFamily: "Georgia, serif", 
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            <strong>Keep In Touch</strong> 
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
              bgcolor: "rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              backdropFilter: "blur(6px)",
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
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="filled"
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                variant="filled"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                variant="filled"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />

              {/* Message field spans both columns */}
              <Box gridColumn="1 / -1">
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  variant="filled"
                  multiline
                  rows={4}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  InputProps={{ style: { color: "#fff" } }}
                />
              </Box>

              {/* Submit Button */}
              <Box gridColumn="1 / -1" textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#5f02ab",
                    "&:hover": { bgcolor: "#320953ff" },
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

      {/* ─── Footer ─── */}
      <Footer />
    </Box>
  );
};

export default ContactSection;
