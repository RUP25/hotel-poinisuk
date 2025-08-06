// components/HamburgerMenu.tsx

import React from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import KingBedIcon from "@mui/icons-material/KingBed";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import InfoIcon from "@mui/icons-material/Info";
import GavelIcon from "@mui/icons-material/Gavel";
import Link from "next/link";

const menuItems = [
  { label: "Home",           href: "/",       icon: <HomeIcon /> },
  { label: "Rooms & Suites", href: "/rooms",  icon: <KingBedIcon /> },
  { label: "Dine In",        href: "/dine",   icon: <RestaurantIcon /> },
  { label: "Bar & Lounge",   href: "/klong",  icon: <LocalBarIcon /> },
  { label: "About Us",       href: "#about",  icon: <InfoIcon /> },
  { label: "Hotel T&C",      href: "#terms",  icon: <GavelIcon /> },
];

interface Props {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const HamburgerMenu: React.FC<Props> = ({ open, setOpen }) => {
  const toggleDrawer = (state: boolean) => () => setOpen(state);

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
            width: 350,
            overflow: "hidden",
            position: "relative",
          },
        }}
      >
        {/* Blurred background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/logo1.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(8px)",
            zIndex: 0,
          }}
        />

        {/* Dark overlay for contrast */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        />

        {/* Menu content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            textAlign: "center",
            pt: 4,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    width: "100%",
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "common.white",
                    textDecoration: "none",
                    transition: "background-color 0.3s, color 0.3s",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: "primary.main" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "1.3rem",
                          fontWeight: 600,
                          color: "inherit",
                          textDecoration: "none",
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
