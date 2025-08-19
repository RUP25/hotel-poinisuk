// components/HamburgerMenu.tsx
import React from "react";
import Link from "next/link";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  { label: "Dine In",        href: "/dine",  icon: <RestaurantIcon /> },
  { label: "Bar & Lounge",   href: "/klong", icon: <LocalBarIcon /> },
  { label: "About Us",       href: "#about", icon: <InfoIcon /> },
  { label: "Hotel T&C",      href: "#terms", icon: <GavelIcon /> },
];

interface Props {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const HamburgerMenu: React.FC<Props> = ({ open, setOpen }) => {
  const toggleDrawer = (state: boolean) => () => setOpen(state);

  // reusable 3D/extruded text style (also applied to "MENU")
  const threeDTextSx = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    letterSpacing: 1.2,
    color: "#fff",
    textTransform: "uppercase",
    textShadow:
      "0 1px 0 #cfcfcf, 0 2px 0 #bfbfbf, 0 3px 0 #afafaf, 0 4px 0 #9f9f9f, 0 5px 0 #8f8f8f, 0 6px 8px rgba(0,0,0,0.35)",
  } as const;

  // 3D pill/button effect shared by each item
  const threeDItemSx = {
    my: 1,
    mx: 2,
    py: 1.25,
    px: 1.5,
    borderRadius: 2,
    backdropFilter: "blur(2px)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
    boxShadow:
      "0 6px 0 rgba(0,0,0,0.35), 0 10px 18px rgba(0,0,0,0.25)",
    transform: "translateY(0)",
    transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,0.35), 0 16px 22px rgba(0,0,0,0.28)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
    },
    "&:active": {
      transform: "translateY(2px)",
      boxShadow:
        "0 3px 0 rgba(0,0,0,0.35), 0 8px 14px rgba(0,0,0,0.22)",
    },
    color: "common.white",
    textDecoration: "none",
  } as const;

  // 3D-style "Cancel" button on the right of the header
  const cancelBtnSx = {
    color: "white",
    px: 1.75,
    py: 0.75,
    borderRadius: 999,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow:
      "0 6px 0 rgba(0,0,0,0.35), 0 10px 18px rgba(0,0,0,0.25), inset 0 1px rgba(255,255,255,0.35)",
    transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
    "&:hover": {
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
      boxShadow:
        "0 8px 0 rgba(0,0,0,0.35), 0 16px 22px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.4)",
    },
    "&:active": {
      transform: "translateY(2px)",
      boxShadow:
        "0 3px 0 rgba(0,0,0,0.35), 0 8px 14px rgba(0,0,0,0.22), inset 0 1px rgba(255,255,255,0.4)",
    },
  } as const;

  return (
    <>
      {/* Hamburger icon */}
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
          sx: {
            width: { xs: 300, sm: 340, md: 360 },
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.9), rgba(20,20,20,0.94))",
          },
        }}
      >
        {/* Background emblem with blur */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/logo1.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(10px)",
            opacity: 0.25,
            zIndex: 0,
          }}
        />

        {/* Soft overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
            zIndex: 1,
          }}
        />

        {/* HEADER: 'MENU' on left + Cancel on right */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: 2,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
          }}
        >
          <Typography component="div" sx={{ ...threeDTextSx, fontSize: "1.35rem" }}>
            Menu
          </Typography>

          <Button
            onClick={toggleDrawer(false)}
            aria-label="Cancel and close menu"
            startIcon={<CloseIcon />}
            sx={cancelBtnSx}
          >
            Cancel
          </Button>
        </Box>

        {/* MENU ITEMS */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            pt: 1,
            pb: 3,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List sx={{ py: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ px: 0 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={threeDItemSx}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "primary.light" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          ...threeDTextSx,
                          // lighter/thinner for items
                          fontWeight: 700,
                          letterSpacing: 0.8,
                          textTransform: "none",
                          fontSize: "1.1rem",
                          textShadow:
                            "0 1px 0 #bfbfbf, 0 2px 0 #a9a9a9, 0 3px 6px rgba(0,0,0,0.35)",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
