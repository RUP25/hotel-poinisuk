// components/HamburgerMenu.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconButton,
  Drawer,
  Box,
  Typography,
} from "@mui/material";

// Outlined icon variants — refined stroke that matches the rest of the brand surfaces
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import KingBedOutlined from "@mui/icons-material/KingBedOutlined";
import RestaurantOutlined from "@mui/icons-material/RestaurantOutlined";
import LocalBarOutlined from "@mui/icons-material/LocalBarOutlined";
import MicExternalOnOutlined from "@mui/icons-material/MicExternalOnOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";

// Hotel Poinisuk brand font stack
const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";

import { LAVENDER, PURPLE, PURPLE_DEEP, SANS_UI } from "@/lib/luxury-chrome";

const ACCENT = LAVENDER;
const ACCENT_DEEP = PURPLE;

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { label: "Home",            href: "/",        icon: <HomeOutlined /> },
  { label: "Rooms & Suites",  href: "/rooms",   icon: <KingBedOutlined /> },
  { label: "Dopwai",          href: "/dine",    icon: <RestaurantOutlined /> },
  { label: "Klong",           href: "/klong",   icon: <LocalBarOutlined /> },
  { label: "Live & Karaoke",  href: "/karaoke", icon: <MicExternalOnOutlined /> },
  { label: "About",           href: "/about",   icon: <InfoOutlined /> },
  { label: "Hotel T&C",       href: "/terms",   icon: <GavelOutlined /> },
];

interface Props {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const HamburgerMenu: React.FC<Props> = ({ open, setOpen }) => {
  const router = useRouter();
  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
      {/* ───────────────── Trigger: bespoke thin-line hamburger ───────────────── */}
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        disableRipple
        sx={{
          width: { xs: 40, md: 44 },
          height: { xs: 40, md: 44 },
          borderRadius: 0,
          color: "#ffffff",
          p: 0.5,
          transition: "color 220ms ease, opacity 220ms ease",
          "&:hover": {
            color: ACCENT,
            bgcolor: "transparent",
            "& .hp-bar-mid": { width: "100%" },
          },
          "&:focus-visible": {
            outline: `2px solid ${ACCENT}`,
            outlineOffset: 2,
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "relative",
            width: 24,
            height: 14,
            "& .hp-bar": {
              position: "absolute",
              left: 0,
              height: "1px",
              background: "currentColor",
              transition: "width 280ms cubic-bezier(.2,.7,.2,1)",
            },
          }}
        >
          <Box className="hp-bar" sx={{ top: 0, width: "100%" }} />
          <Box
            className="hp-bar hp-bar-mid"
            sx={{ top: "50%", width: "70%", transform: "translateY(-50%)" }}
          />
          <Box className="hp-bar" sx={{ bottom: 0, width: "100%" }} />
        </Box>
      </IconButton>

      {/* ───────────────────────────── Drawer ───────────────────────────── */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        transitionDuration={{ enter: 320, exit: 240 }}
        PaperProps={{
          sx: {
            width: { xs: "82vw", sm: 340, md: 380 },
            maxWidth: 420,
            color: "#f4eefe",
            background:
              `linear-gradient(180deg, #1a1230 0%, ${PURPLE_DEEP} 55%, #0d0719 100%)`,
            backdropFilter: "saturate(140%) blur(10px)",
            WebkitBackdropFilter: "saturate(140%) blur(10px)",
            borderRight: "1px solid rgba(202,166,255,0.18)",
            boxShadow: "none",
          },
        }}
      >
        <Box
          role="presentation"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "100dvh",
          }}
        >
          {/* ─────────── Header: close button only ─────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: { xs: 2.25, md: 2.75 },
              pt: { xs: 2.25, md: 2.75 },
              pb: 2,
            }}
          >
            {/* Slim animated close — thin lines crossing into an X */}
            <IconButton
              onClick={toggleDrawer(false)}
              aria-label="Close menu"
              disableRipple
              sx={{
                width: 40,
                height: 40,
                borderRadius: 0,
                color: "rgba(244,238,254,0.85)",
                border: "1px solid rgba(202,166,255,0.25)",
                transition:
                  "color 220ms ease, border-color 220ms ease, background-color 220ms ease",
                "&:hover": {
                  color: ACCENT,
                  borderColor: ACCENT,
                  background: "rgba(202,166,255,0.08)",
                },
                "&:focus-visible": {
                  outline: `2px solid ${ACCENT}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: "relative",
                  width: 16,
                  height: 16,
                  "& span": {
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: "100%",
                    height: "1.5px",
                    background: "currentColor",
                  },
                  "& span:nth-of-type(1)": {
                    transform: "translateY(-50%) rotate(45deg)",
                  },
                  "& span:nth-of-type(2)": {
                    transform: "translateY(-50%) rotate(-45deg)",
                  },
                }}
              >
                <span />
                <span />
              </Box>
            </IconButton>
          </Box>

          {/* Lavender hairline divider */}
          <Box
            sx={{
              mx: { xs: 2.25, md: 2.75 },
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.5) 50%, rgba(202,166,255,0) 100%)",
            }}
          />

          {/* ─────────── Menu list ─────────── */}
          <Box
            component="nav"
            aria-label="Primary"
            sx={{ px: { xs: 1, md: 1.25 }, py: 1.5 }}
          >
            {menuItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Box
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={toggleDrawer(false)}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.75,
                    px: { xs: 1.5, md: 2 },
                    py: 1.4,
                    textDecoration: "none",
                    color: active ? "#ffffff" : "rgba(244,238,254,0.92)",
                    transition:
                      "color 240ms ease, background-color 240ms ease, padding-left 240ms ease",
                    // Active left rail
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: active ? "3px" : "0px",
                      background: `linear-gradient(180deg, ${ACCENT}, ${ACCENT_DEEP})`,
                      transition: "width 260ms ease",
                    },
                    "&:hover": {
                      color: ACCENT,
                      background:
                        "linear-gradient(90deg, rgba(202,166,255,0.10), rgba(202,166,255,0) 70%)",
                      pl: { xs: 2, md: 2.5 },
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${ACCENT}`,
                      outlineOffset: -2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      color: active ? ACCENT : "rgba(244,238,254,0.78)",
                      "& svg": { fontSize: 22 },
                      transition: "color 240ms ease",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: cinzel,
                      fontWeight: active ? 700 : 600,
                      fontSize: { xs: "0.86rem", md: "0.92rem" },
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* ─────────── Footer: copyright only ─────────── */}
          <Box
            sx={{
              mt: "auto",
              px: { xs: 2.25, md: 2.75 },
              pb: { xs: 2.5, md: 3 },
              pt: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS_UI,
                fontWeight: 500,
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(236,230,245,0.5)",
              }}
            >
              © Hotel Poinisuk <span suppressHydrationWarning>{new Date().getFullYear()}</span>
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
