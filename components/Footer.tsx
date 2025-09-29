import React from "react";
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import RoomIcon from "@mui/icons-material/Room";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#121212", color: "#eee", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }}
          gap={4}
          alignItems="center"
        >
          {/* Address with Map Link */}
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Typography>
              <strong>Address</strong>
              <br />
              <MuiLink
                href="https://www.google.com/maps?q=Hotel+Poinisuk+Shillong"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                color="inherit"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  alignItems: "flex-start",
                  gap: 1,
                  mt: 1,
                }}
              >
                <RoomIcon sx={{ fontSize: 60 }} />
                Lady Veronica Lane,
                <br />
                Nongkynrih, Laitumkhrah,
                <br />
                Shillong – Police Point
              </MuiLink>
            </Typography>

            {/* Ⓒ Copyright below the address, left side */}
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#aaa",
                display: "flex",
                alignItems: "center",
                fontSize: "1.2rem",
                fontWeight: 700,
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 0.5,
              }}
            >
              © Hotel Poinisuk 2025
            </Typography>
          </Box>

          {/* Logo */}
          <Box textAlign="center">
            {/* <Image
              src="/images/logo-poinisuk.png"
              alt="Hotel Poinisuk Logo"
              width={150}
              height={80}
              style={{ objectFit: "contain" }}
            /> */}
          </Box>

          {/* Reservations */}
          <Box textAlign={{ xs: "center", md: "right" }}>
            <Typography>
              <strong>Reservations</strong>
              <br />
              <a
                href="tel:+918794726831"
                style={{ color: "#eee", textDecoration: "none" }}
              >
                (0364) 7100030 / (+91) 8794726831
              </a>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Email</strong>
              <br />
              <a
                href="mailto:info@hotelpoinisuk.com"
                style={{ color: "#eee", textDecoration: "none" }}
              >
                reservation@hotelpoinisuk.com
              </a>
            </Typography>

            {/* Social Media */}
            <Box sx={{ mt: 2 }}>
              <IconButton
                component="a"
                href="https://facebook.com/hotelpoinisuk"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#eee" }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com/hotelpoinisuk"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#eee" }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com/hotelpoinisuk"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#eee" }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
