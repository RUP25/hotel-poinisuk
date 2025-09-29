// components/HamburgerMenu.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import KingBedIcon from "@mui/icons-material/KingBed";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import InfoIcon from "@mui/icons-material/Info";
import GavelIcon from "@mui/icons-material/Gavel";

const menuItems = [
  { label: "Home",           href: "/",      icon: <HomeIcon /> },
  { label: "Rooms & Suites", href: "/rooms", icon: <KingBedIcon /> },
  { label: "Dopwai Dine",        href: "/dine",  icon: <RestaurantIcon /> },
  { label: "Klong Bar",   href: "/klong", icon: <LocalBarIcon /> },
  { label: "About Us",       href: "/about", icon: <InfoIcon /> },
  { label: "Hotel T&C",      href: "/terms", icon: <GavelIcon /> },
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
      {/* Trigger button */}
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="Open navigation menu"
        sx={{ color: "white", fontSize: 40 }}
      >
        <MenuIcon sx={{ fontSize: 40 }} />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          // Minimal, elegant surface: no heavy shadows
          sx: {
            width: { xs: 300, sm: 340, md: 360 },
            bgcolor: "rgba(24,24,26,0.82)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.75,
          }}
        >
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            Menu
          </Typography>

          <Button
            onClick={toggleDrawer(false)}
            aria-label="Close menu"
            startIcon={<CloseIcon />}
            sx={{
              color: "#eaeaea",
              px: 1.25,
              py: 0.6,
              minWidth: 0,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              "&:hover": {
                background: "rgba(255,255,255,0.06)",
              },
              "&:focus-visible": {
                outline: "2px solid #ffffff",
                outlineOffset: 2,
              },
            }}
          >
            Close
          </Button>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Nav list */}
        <Box
          role="presentation"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          sx={{ py: 0.5 }}
        >
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={toggleDrawer(false)}
                    disableRipple
                    sx={{
                      // Minimal row: no box shadow, subtle hover fill, crisp divider
                      py: 1.25,
                      px: 2,
                      gap: 1.25,
                      color: "#f2f2f2",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      transition: "background-color .15s ease, color .15s ease, padding-left .15s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.06)",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #ffffff",
                        outlineOffset: -2,
                      },
                      // left active indicator
                      position: "relative",
                      pl: active ? 2.5 : 2,
                      "&::before": active
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 8,
                            bottom: 8,
                            width: 3,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg, #caa6ff, #7f4dff)",
                          }
                        : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: active ? "#caa6ff" : "rgba(255,255,255,0.8)",
                        transition: "color .15s ease",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: active ? 700 : 500,
                          letterSpacing: 0.2,
                          color: active ? "#ffffff" : "rgba(255,255,255,0.92)",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Footer microcopy (optional) */}
        <Box sx={{ mt: "auto", px: 2, py: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.6)" }}
          >
            © {new Date().getFullYear()} Hotel Poinisuk
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
