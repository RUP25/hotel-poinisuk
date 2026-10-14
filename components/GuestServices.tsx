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

// Outlined icon variants — lighter, more refined strokes that suit the brand
import RestaurantIcon from "@mui/icons-material/RestaurantOutlined";
import LocalBarIcon from "@mui/icons-material/LocalBarOutlined";
import WifiIcon from "@mui/icons-material/WifiOutlined";
import RoomServiceIcon from "@mui/icons-material/RoomServiceOutlined";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import CleaningServicesIcon from "@mui/icons-material/CleaningServicesOutlined";
import IronIcon from "@mui/icons-material/IronOutlined";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMakerOutlined";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDiningOutlined";
import ContentCutIcon from "@mui/icons-material/ContentCutOutlined";
import DryCleaningIcon from "@mui/icons-material/DryCleaningOutlined";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarOutlined";
import ThermostatIcon from "@mui/icons-material/ThermostatOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgentOutlined";
import BlockIcon from "@mui/icons-material/BlockOutlined";
import AccessibleIcon from "@mui/icons-material/AccessibleOutlined";

// New icons for the added amenities
import LocalParkingIcon from "@mui/icons-material/LocalParkingOutlined";
import TravelExploreIcon from "@mui/icons-material/TravelExploreOutlined";
import EventSeatIcon from "@mui/icons-material/EventSeatOutlined";

// Hotel Poinisuk brand font stacks
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const cinzel = "var(--font-cinzel), var(--font-cormorant), 'Playfair Display', 'Georgia', serif";

// Refined warm-walnut tone for icon strokes — harmonizes with the cream backdrop
const ICON_TONE = "#5a4235";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="h5"
    align="center"
    sx={{
      fontFamily: cormorant,
      fontWeight: 700,
      mb: 2.5,
      color: "#2b211b",
      textAlign: "center",
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
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, py: 0.9 }}>
    <Box
      aria-hidden
      sx={{
        width: 36,
        height: 36,
        display: "grid",
        placeItems: "center",
        color: ICON_TONE,
        flexShrink: 0,
        "& svg": { fontSize: { xs: 24, md: 26 } },
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: cormorant,
        fontWeight: 500,
        color: "#2f2a25",
        fontSize: { xs: "1.12rem", md: "1.22rem" },
        lineHeight: 1.45,
      }}
    >
      {label}
    </Typography>
  </Box>
);

const InfoItem: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({
  icon,
  text,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.9 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        color: ICON_TONE,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        "& svg": { fontSize: { xs: 24, md: 26 } },
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: cormorant,
        fontWeight: 500,
        color: "#2f2a25",
        fontSize: { xs: "1.12rem", md: "1.22rem" },
        lineHeight: 1.45,
      }}
    >
      {text}
    </Typography>
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
            maxWidth: { xs: "100%", sm: 640, md: 880, lg: 920 },
            mx: "auto",
            // shift the content rightward so the rows sit comfortably
            // right of the heading's left edge.
            pl: { xs: 0, sm: 2, md: 10, lg: 16 },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: { xs: 2, sm: 4, md: 5 },
            rowGap: { xs: 1.25, sm: 1.5 },
          }}
        >
          {amenities.map((a, i) => (
            <Box
              key={i}
              sx={{
                flex: { xs: "0 0 100%", sm: "0 0 calc(50% - 16px)", md: "0 0 calc(50% - 20px)" },
                maxWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(50% - 20px)" },
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
            maxWidth: { xs: "100%", sm: 640, md: 880, lg: 920 },
            mx: "auto",
            // matches the Amenities grid offset so both blocks share the
            // same horizontal alignment under their respective headings.
            pl: { xs: 0, sm: 2, md: 10, lg: 16 },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: { xs: 2, sm: 4, md: 5 },
            rowGap: { xs: 1.25, sm: 1.5 },
          }}
        >
          {[
            { icon: <AccessTimeIcon />, text: <><strong>Check-in:</strong> 02:00 pm</> },
            { icon: <AccessTimeIcon />, text: <><strong>Check-out:</strong> 12:00 pm</> },
            { icon: <PhoneIcon />, text: "+91 8794726831" },
            { icon: <SupportAgentIcon />, text: "24/7 Reception Desk" },
            { icon: <BlockIcon />, text: "No Pets Allowed" },
            { icon: <AccessibleIcon />, text: "Wheelchair Service" },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                flex: { xs: "0 0 100%", sm: "0 0 calc(50% - 16px)", md: "0 0 calc(50% - 20px)" },
                maxWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(50% - 20px)" },
              }}
            >
              <InfoItem icon={item.icon} text={item.text} />
            </Box>
          ))}
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
            <Typography
              variant="h6"
              sx={{ fontFamily: cormorant, fontWeight: 700, mb: 1.5, color: "#2b211b" }}
            >
              Property Details
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Policies & Payments:</strong> All major Debit/Credit Cards. Contactless mobile payments supported.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Parking & Security:</strong> 24/7 free parking with security.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Business & Events:</strong> Banquet hall (up to 200 guests), conference room, in-house AV, DJ/Karaoke, live band.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500 }}>
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
            <Typography
              variant="h6"
              sx={{ fontFamily: cormorant, fontWeight: 700, mb: 1.5, color: "#2b211b" }}
            >
              FAQs
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Languages:</strong> English, Hindi, Khasi, Assamese.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Early check-in/late check-out:</strong> Subject to availability.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500, mb: 1 }}>
              <strong>Airport distance:</strong> Shillong ~32 km; Guwahati ~120 km.
            </Typography>
            <Typography sx={{ fontFamily: cormorant, fontWeight: 500 }}>
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
          <Typography
            sx={{
              mt: 1.5,
              textAlign: "right",
              fontFamily: cinzel,
              fontWeight: 500,
              fontSize: { xs: "0.85rem", md: "0.9rem" },
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            <MuiLink
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: "#5a4235", "&:hover": { color: "#3d2a1f" } }}
            >
              Get Directions on Google Maps
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GuestServices;
