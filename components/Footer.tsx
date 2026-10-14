import React from "react";
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "#0c0815",
        color: "#ece6f5",
        pt: { xs: 7, md: 9 },
        pb: { xs: 4, md: 5 },
        overflow: "hidden",
        background:
          "radial-gradient(80% 120% at 50% -20%, rgba(95,2,171,0.22) 0%, rgba(50,9,83,0.10) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.55) 50%, rgba(202,166,255,0) 100%)",
        }}
      />

      {/* Subtle ambient orb */}
      <Box
        sx={{
          position: "absolute",
          top: "-25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "120%", md: "70%" },
          height: { xs: 360, md: 460 },
          background:
            "radial-gradient(closest-side, rgba(95,2,171,0.18) 0%, rgba(95,2,171,0) 75%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
          gap={{ xs: 5, md: 6 }}
          alignItems="start"
        >
          {/* ───────── Column 1 — Address ───────── */}
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: { xs: "0.78rem", md: "0.82rem" },
                letterSpacing: "0.28em",
                color: "#caa6ff",
                mb: 1.5,
                textTransform: "uppercase",
              }}
            >
              Address
            </Typography>

            <MuiLink
              href="https://www.google.com/maps?q=Hotel+Poinisuk+Shillong"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: "flex-start",
                gap: 1.2,
                color: "#ece6f5",
                fontFamily: cormorant,
                fontSize: { xs: "1.02rem", md: "1.08rem" },
                lineHeight: 1.55,
                transition: "color 220ms ease, transform 240ms ease",
                "&:hover": {
                  color: "#d6c4ff",
                  transform: "translateY(-1px)",
                },
                "&:hover .map-pin": {
                  color: "#d6c4ff",
                  transform: "scale(1.06)",
                },
              }}
            >
              <RoomIcon
                className="map-pin"
                sx={{
                  fontSize: 28,
                  color: "#caa6ff",
                  mt: "2px",
                  flexShrink: 0,
                  transition: "color 220ms ease, transform 240ms ease",
                }}
              />
              <Box component="span" sx={{ display: "block" }}>
                Lady Veronica Lane,
                <br />
                Nongkynrih, Laitumkhrah,
                <br />
                Shillong – Police Point
              </Box>
            </MuiLink>
          </Box>

          {/* ───────── Column 2 — Follow Us ───────── */}
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.2,
              pt: { xs: 1, md: 2 },
            }}
          >
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: { xs: "0.78rem", md: "0.82rem" },
                letterSpacing: "0.28em",
                color: "#caa6ff",
                textTransform: "uppercase",
              }}
            >
              Follow Us On
            </Typography>

            {/* Divider diamond */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 1,
                width: "100%",
                maxWidth: 220,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.55) 100%)",
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: "#caa6ff",
                  transform: "rotate(45deg)",
                  boxShadow: "0 0 8px rgba(202,166,255,0.6)",
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(202,166,255,0.55) 0%, rgba(202,166,255,0) 100%)",
                }}
              />
            </Box>

            {/* Social icons */}
            <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
              {[
                {
                  href: "https://www.facebook.com/HOTELPOINISUK/",
                  Icon: FacebookIcon,
                  label: "Facebook",
                },
                {
                  href: "https://www.instagram.com/hotelpoinisukshillong/",
                  Icon: InstagramIcon,
                  label: "Instagram",
                },
                {
                  href: "https://twitter.com/hotelpoinisuk",
                  Icon: TwitterIcon,
                  label: "Twitter",
                },
              ].map(({ href, Icon, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: "#ece6f5",
                    border: "1px solid rgba(202,166,255,0.22)",
                    borderRadius: "50%",
                    width: { xs: 50, md: 56 },
                    height: { xs: 50, md: 56 },
                    transition:
                      "color 220ms ease, border-color 220ms ease, transform 260ms ease, box-shadow 260ms ease, background-color 220ms ease",
                    "&:hover": {
                      color: "#0c0815",
                      bgcolor: "#caa6ff",
                      borderColor: "#caa6ff",
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 22px rgba(202,166,255,0.4)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 24, md: 28 } }} />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* ───────── Column 3 — Reservations ───────── */}
          <Box textAlign={{ xs: "center", md: "right" }}>
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: { xs: "0.78rem", md: "0.82rem" },
                letterSpacing: "0.28em",
                color: "#caa6ff",
                mb: 1.5,
                textTransform: "uppercase",
              }}
            >
              Reservations
            </Typography>

            <MuiLink
              href="tel:+918794726831"
              underline="none"
              sx={{
                display: "block",
                fontFamily:
                  "var(--font-montserrat), 'Helvetica Neue', 'Arial', sans-serif",
                fontWeight: 500,
                fontSize: { xs: "0.95rem", md: "1rem" },
                color: "#ece6f5",
                lineHeight: 1.5,
                whiteSpace: "nowrap",
                transition: "color 220ms ease",
                "&:hover": { color: "#d6c4ff" },
              }}
            >
              (0364) 7100030 / (+91) 8794726831
            </MuiLink>

            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: { xs: "0.74rem", md: "0.78rem" },
                letterSpacing: "0.28em",
                color: "#caa6ff",
                mt: 3,
                mb: 1.2,
                textTransform: "uppercase",
              }}
            >
              Email
            </Typography>

            <MuiLink
              href="mailto:reservation@hotelpoinisuk.com"
              underline="none"
              sx={{
                fontFamily: cormorant,
                fontSize: { xs: "1.02rem", md: "1.1rem" },
                color: "#ece6f5",
                wordBreak: "break-word",
                transition: "color 220ms ease, letter-spacing 240ms ease",
                "&:hover": { color: "#d6c4ff", letterSpacing: "0.01em" },
              }}
            >
              reservation@hotelpoinisuk.com
            </MuiLink>
          </Box>
        </Box>

        {/* ───────── Bottom strip ───────── */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: { xs: 2.5, md: 3 },
            borderTop: "1px solid rgba(202,166,255,0.14)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.2,
          }}
        >
          <Typography
            sx={{
              fontFamily: cinzel,
              fontWeight: 500,
              fontSize: { xs: "0.7rem", md: "0.74rem" },
              letterSpacing: "0.24em",
              color: "rgba(236,230,245,0.7)",
              textTransform: "uppercase",
            }}
          >
            © Hotel Poinisuk 2026
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
