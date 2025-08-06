// components/NavBar.tsx

import React from "react";
import Link from "next/link";
import { Box, Link as MuiLink } from "@mui/material";


const navItems = [
  { label: "Rooms", href: "/rooms" },
  { label: "Dine", href: "/dine" },
  { label: "Bar", href: "/klong" },
  { label: "Banquet Hall", href: "#banquet" },
  { label: "Guest Services", href: "#guest-services" },
  { label: "Contact", href: "#contact-section" },
];

const NavBar: React.FC = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 120,
        zIndex: 25,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 2,
          py: 1,
          bgcolor: "transparent",
          backdropFilter: "blur(4px)",
          mt: 5,        
        }}
      >
        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <Link href={item.href} passHref legacyBehavior>
              <MuiLink
                underline="none"
                sx={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 18,
                  "&:hover": { color: "#5f02ab" },
                }}
              >
                {item.label}
              </MuiLink>
            </Link>
            {index < navItems.length - 1 && (
              <Box
                sx={{
                  height: "60%",
                  width: 1,
                  bgcolor: "rgba(255, 255, 255, 0.4)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default NavBar;
