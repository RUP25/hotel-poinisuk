// components/GuestServices.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Link as MuiLink,
} from "@mui/material";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import WifiIcon from "@mui/icons-material/Wifi";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import IronIcon from "@mui/icons-material/Iron";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DryCleaningIcon from "@mui/icons-material/DryCleaning";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BlockIcon from "@mui/icons-material/Block";
import AccessibleIcon from "@mui/icons-material/Accessible";

// New icons for the added amenities
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import EventSeatIcon from "@mui/icons-material/EventSeat";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="h5"
    align="center" // center the title text
    sx={{
      fontWeight: 700,
      mb: 2.5,
      color: "#2b211b",
      fontFamily: `'Georgia','Times New Roman',serif`,
      textAlign: "center", // extra safety
    }}
  >
    {children}
  </Typography>
);

const Line: React.FC = () => (
  <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.08)" }} />
);

const AmenityItem: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
    <Box
      aria-hidden
      sx={{ width: 28, height: 28, display: "grid", placeItems: "center", color: "#2e2a25" }}
    >
      {icon}
    </Box>
    <Typography sx={{ color: "#2f2a25" }}>{label}</Typography>
  </Box>
);

const InfoItem: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({
  icon,
  text,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 0.75 }}>
    <Box sx={{ width: 26, color: "#2e2a25" }}>{icon}</Box>
    <Typography sx={{ color: "#2f2a25" }}>{text}</Typography>
  </Box>
);

const GuestServices: React.FC = () => {
  const amenities = [
    { icon: <RestaurantIcon fontSize="small" />, label: "In-house Restaurant (Dopwai)" },
    { icon: <LocalBarIcon fontSize="small" />, label: "Klong-Bar, Night Club & Pub" },

    // Added items
    { icon: <EventSeatIcon fontSize="small" />, label: "Banquet Hall & Events" },
    { icon: <TravelExploreIcon fontSize="small" />, label: "Travel Desk (Airport/Taxi & Tours)" },
    { icon: <LocalParkingIcon fontSize="small" />, label: "On-site Parking (Free)" },

    { icon: <RoomServiceIcon fontSize="small" />, label: "Prompt Room Service" },
    { icon: <CoffeeMakerIcon fontSize="small" />, label: "Tea/Coffee Makers" },
    { icon: <WifiIcon fontSize="small" />, label: "Free Wi-Fi" },
    { icon: <LocalLaundryServiceIcon fontSize="small" />, label: "Laundry Service" },
    { icon: <CleaningServicesIcon fontSize="small" />, label: "Daily Housekeeping" },
    { icon: <IronIcon fontSize="small" />, label: "Iron & Ironing Board" },
    { icon: <DryCleaningIcon fontSize="small" />, label: "Hair Dryer (on request)" },
    { icon: <BreakfastDiningIcon fontSize="small" />, label: "Breakfast Buffet" },
    { icon: <ContentCutIcon fontSize="small" />, label: "Shaving Kit (on request)" },
    { icon: <DirectionsCarFilledIcon fontSize="small" />, label: "Valet Service" },
    { icon: <ThermostatIcon fontSize="small" />, label: "Heated Rooms (select)" },
  ];

  const mapEmbed = "https://www.google.com/maps?q=Hotel+Poinisuk+Shillong&output=embed";
  const directionsLink = "https://www.google.com/maps/dir/?api=1&destination=Hotel+Poinisuk+Shillong";

  return (
    <Box
      component="section"
      id="guest-services"
      sx={{
        bgcolor: "#faf6ef",
        py: { xs: 5, md: 7 },
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        {/* Amenities */}
        <SectionTitle>Amenities</SectionTitle>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center", // center the rows
            columnGap: { xs: 2, sm: 3 },
            rowGap: { xs: 1, sm: 1.25 },
          }}
        >
          {amenities.map((a, i) => (
            <Box
              key={i}
              sx={{
                // fixed basis per breakpoint so centering works
                flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
                pr: { md: 2 },
              }}
            >
              <AmenityItem icon={a.icon} label={a.label} />
            </Box>
          ))}
        </Box>

        <Line />

        {/* Hotel Information */}
        <SectionTitle>Hotel Information</SectionTitle>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center", // center the rows
            columnGap: { xs: 2, sm: 3 },
            rowGap: { xs: 1, sm: 1.25 },
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<AccessTimeIcon />} text={<><strong>Check-in:</strong> 02:00 pm</>} />
          </Box>
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<AccessTimeIcon />} text={<><strong>Check-out:</strong> 12:00 pm</>} />
          </Box>
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<PhoneIcon />} text="+91 69093 90208" />
          </Box>
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<SupportAgentIcon />} text="24/7 Reception Desk" />
          </Box>
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<BlockIcon />} text="No Pets Allowed" />
          </Box>
          <Box
            sx={{
              flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.333%" },
              maxWidth: { xs: "100%", sm: "50%", md: "33.333%" },
            }}
          >
            <InfoItem icon={<AccessibleIcon />} text="Wheelchair Service" />
          </Box>
        </Box>

        <Line />

        {/* Property Details + FAQs (2-column flex, stacks on mobile) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              flex: { xs: "1 1 auto", md: "1.3 1 0" },
              p: { xs: 2, md: 3 },
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Property Details
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Policies & Payments:</strong> All major Debit/Credit Cards. Contactless mobile payments supported.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Parking & Security:</strong> 24/7 free parking with security.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Business & Events:</strong> Banquet hall (up to 200 guests), conference room, in-house AV, DJ/Karaoke, live band.
            </Typography>
            <Typography>
              <strong>Doctor on Call</strong> available.
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              flex: { xs: "1 1 auto", md: "1 1 0" },
              p: { xs: 2, md: 3 },
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              FAQs
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Languages:</strong> English, Hindi, Khasi, Assamese.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Early check-in/late check-out:</strong> Subject to availability.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Airport distance:</strong> Shillong ~32 km; Guwahati ~120 km.
            </Typography>
            <Typography>
              <strong>Nearby:</strong> Police Bazar (2 km), Ward’s Lake (1 km), Lady Hydari Park (2 km), Don Bosco Museum (5 km).
            </Typography>
          </Paper>
        </Box>

        {/* Google Map */}
        <Box sx={{ mt: 5 }}>
          <SectionTitle>Find Us & Directions</SectionTitle>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              pt: "56.25%", // 16:9
            }}
          >
            <Box
              component="iframe"
              title="Hotel Poinisuk — Google Map"
              src={mapEmbed}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sx={{ position: "absolute", inset: 0, border: 0, width: "100%", height: "100%" }}
            />
          </Box>
          <Typography sx={{ mt: 1.5, textAlign: "right" }}>
            <MuiLink href={directionsLink} target="_blank" rel="noopener noreferrer" underline="hover">
              Get Directions on Google Maps
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GuestServices;
