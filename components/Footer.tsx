import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import RoomIcon from "@mui/icons-material/Room"; // Map pin icon

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
          <Box textAlign={{ xs: "center", md: "left"}}>
            <Typography>
              <strong>Address</strong><br />
              <MuiLink
                href="https://www.google.com/maps?q=Hotel+Poinisuk+Shillong"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                color="inherit"
                sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, alignItems: "flex-start", gap: 1, mt: 1 }}
              >
        
                <RoomIcon sx={{ fontSize: 60 }} />
                
                Lady Veronica Lane,<br />
                Nongkynrih, Laitumkhrah,<br />
                Shillong – Police Point
              </MuiLink>
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
              <strong>Reservations</strong><br />
              <a
                href="tel:+919108193968"
                style={{ color: "#eee", textDecoration: "none" }}
              >
                (0364) 7100030 / (+91) 8794726831
              </a>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Email</strong><br />
              <a
                href="mailto:info@hotelpoinisuk.com"
                style={{ color: "#eee", textDecoration: "none" }}
              >
                
                reservation@hotelpoinisuk.com
              </a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
