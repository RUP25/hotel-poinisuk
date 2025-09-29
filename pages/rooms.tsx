// pages/rooms.tsx
import React, { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  Collapse,
  Chip,
  GlobalStyles,
  useMediaQuery,
} from "@mui/material";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import HotelIcon from "@mui/icons-material/Hotel";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import PeopleIcon from "@mui/icons-material/People";
import BathtubIcon from "@mui/icons-material/Bathtub";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import TvIcon from "@mui/icons-material/Tv";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import PhoneIcon from "@mui/icons-material/Phone";
import WifiIcon from "@mui/icons-material/Wifi";
import DeskIcon from "@mui/icons-material/Desk";
import BedIcon from "@mui/icons-material/Bed";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SSR-safe slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface Amenity {
  icon: React.ReactNode;
  label: string;
}

interface Room {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  policies: string[];
  sleeps: number;           // occupancy
  bed: string;              // bed type quick label
  hasAC: boolean;
  hasWindow: boolean;
}

const rooms: Room[] = [
  {
    key: "premium-ac",
    title: "Premium Air Conditioned Rooms",
    subtitle: "Ideal for Families",
    description:
      "Our Premium rooms (216 sq.ft.) offer spacious comfort with modern conveniences—including a flat-screen TV, tea & coffee maker, complimentary Wi‑Fi, telephone, writing desk with lamp, and a well‑stocked minibar; guests consistently rave about their stay.",
    images: ["/images/rooms/PremiumAC.jpg", "/images/rooms/ACW.jpg", "/images/rooms/prebath.png"],
    amenities: [
      { icon: <LandscapeIcon />, label: "City view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <TvIcon />, label: "Flat‑screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi‑Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
      { icon: <LocalLaundryServiceIcon />, label: "Laundry Service" },
      { icon: <BathtubIcon />, label: "Bathtub" },
    ],
    policies: [
      "Occupancy: up to 4 occupants; extra beds available on request (chargeable).",
      "Includes flat‑screen TV, tea & coffee maker, Wi‑Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP & CP.",
      "Safety locker, bathtub, and individual geyser provided.",
      "In‑room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 King Bed",
    hasAC: true,
    hasWindow: true,
  },
  {
    key: "deluxe-ac",
    title: "Deluxe Air Conditioned Rooms (No Window)",
    subtitle: "Ideal for Couples or Trios",
    description:
      "Our Deluxe A/C rooms (128 sq.ft., no window) blend modern comforts—flat‑screen TV, tea & coffee maker, complimentary Wi‑Fi, telephone, writing desk with lamp—with a minibar option; compact yet well‑equipped.",
    images: ["/images/rooms/DeluxeANW.jpeg", "/images/rooms/ENONAC1.webp", "/images/rooms/bath4.png"],
    amenities: [
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <TvIcon />, label: "Flat‑screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi‑Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 3 occupants; extra bed available on request (chargeable).",
      "Includes flat‑screen TV, tea & coffee maker, Wi‑Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP & CP.",
      "Standard shower (no bathtub).",
      "In‑room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 Queen Bed",
    hasAC: true,
    hasWindow: false,
  },
  {
    key: "deluxe-nonac",
    title: "Deluxe Non‑AC Rooms (Twin)",
    subtitle: "Ideal for Budget Travelers",
    description:
      "Our Deluxe Non‑A/C rooms (approx. 227 sq.ft.) provide a quiet retreat with modern essentials—flat‑screen TV, tea & coffee maker, complimentary Wi‑Fi, telephone, and writing desk with lamp; great value for duos.",
    images: ["/images/rooms/TWIN.jpg", "/images/rooms/deluxeTB.jpg", "/images/rooms/bath4.png"],
    amenities: [
      { icon: <TvIcon />, label: "Flat‑screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi‑Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 3 occupants; extra bed available on request (chargeable).",
      "Includes flat‑screen TV, tea & coffee maker, Wi‑Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP & CP.",
      "Standard shower.",
      "In‑room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
    sleeps: 3,
    bed: "2 Single Beds",
    hasAC: false,
    hasWindow: true, // adjust if truly windowless; left true for now
  },
  {
    key: "executive-nonac",
    title: "Executive Non‑AC Rooms",
    subtitle: "Ideal for Single Travelers",
    description:
      "Our Executive Non‑A/C rooms (166 sq.ft.) offer city outlooks, flat‑screen TV, tea & coffee maker, complimentary Wi‑Fi, telephone, and writing desk with lamp—an affordable yet comfortable choice.",
    images: ["/images/rooms/ExecutiveNonAc.jpg", "/images/rooms/NW1.jpg", "/images/rooms/bath4.png"],
    amenities: [
      { icon: <TvIcon />, label: "Flat‑screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi‑Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 2 occupants; no extra beds available.",
      "Includes flat‑screen TV, tea & coffee maker, Wi‑Fi, telephone, writing desk with lamp.",
      "Plan options: EP & CP.",
      "Shower only.",
      "In‑room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 Queen Bed",
    hasAC: false,
    hasWindow: true,
  },
];

const sliderSettings = (reduceMotion: boolean) => ({
  dots: true,
  infinite: true,
  speed: reduceMotion ? 0 : 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: !reduceMotion,
  autoplaySpeed: 3200,
  pauseOnHover: true,
  cssEase: "ease-in-out" as const,
});

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [expanded, setExpanded] = useState(false);

  const metaChips = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, mb: 1.5 }}>
      <Chip
        size="small"
        icon={<PeopleIcon />}
        label={`Sleeps ${room.sleeps}`}
        sx={{ bgcolor: "rgba(95,2,171,0.08)", color: "#320953" }}
      />
      <Chip
        size="small"
        icon={<BedIcon />}
        label={room.bed}
        sx={{ bgcolor: "rgba(95,2,171,0.08)", color: "#320953" }}
      />
      <Chip
        size="small"
        icon={<AcUnitIcon />}
        label={room.hasAC ? "A/C" : "Non‑A/C"}
        sx={{ bgcolor: "rgba(95,2,171,0.08)", color: "#320953" }}
      />
      <Chip
        size="small"
        icon={<LandscapeIcon />}
        label={room.hasWindow ? "Window" : "No Window"}
        sx={{ bgcolor: "rgba(95,2,171,0.08)", color: "#320953" }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "none", // cleaner, elegant look
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .2s ease",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Aspect-ratio wrapper for consistent heights */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "16/10", md: "16/9" },
            "& .slick-slider, & .slick-list, & .slick-track": { height: "100%" },
            "& .slick-slide, & .slick-slide > div": { height: "100%" },
          }}
        >
          <Slider {...sliderSettings(reduceMotion)} aria-label={`${room.title} gallery`}>
            {room.images.map((src, i) => (
              <Box key={src} sx={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={src}
                  alt={`${room.title} image ${i + 1}`}
                  fill
                  sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 600px"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" fontWeight={700}>
          {room.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mt: 0.5 }}>
          {room.subtitle}
        </Typography>

        {metaChips}

        <Typography variant="body2" paragraph sx={{ flex: 1 }}>
          {room.description}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
            gap: 1,
            mb: 2,
          }}
        >
          {room.amenities.map((a, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
              {a.icon}
              <Typography variant="body2">{a.label}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => {
              // example: scroll to availability or push to / with query
              window.location.href = "https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg=";
            }}
            sx={{ bgcolor: "#5f02ab", "&:hover": { bgcolor: "#320953" } }}
          >
            Book Now
          </Button>
          <Button variant="outlined" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {room.policies.map((policy) => (
              <Typography key={policy} variant="body2" sx={{ mb: 1 }}>
                • {policy}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

const RoomsPage: React.FC = () => {
  const theme = useTheme();

  const fadeInKeyframes = {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(12px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  };

  return (
    <>
      {/* global fixes for slick width/height on mobile */}
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          html: { width: "100%" },
          body: { width: "100%", margin: 0, overflowX: "hidden" },
          main: { width: "100%", maxWidth: "100vw" },
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },
        }}
      />

      <Masthead image="/images/rooms/masthead.jpg" height={{ xs: 220, md: 460, lg: 500 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.2,
              textShadow: "0 4px 14px rgba(0,0,0,0.45)",
              fontSize: { xs: "1.6rem", md: "2.2rem" },
            }}
          >
            Our Rooms & Cabins
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.9,
              mt: 0.5,
              textShadow: "0 2px 10px rgba(0,0,0,0.45)",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Comfort, convenience, and character — right in the heart of Shillong
          </Typography>
        </Container>
      </Masthead>

      {/* Page Content */}
      <Container
        maxWidth="lg"
        sx={{
          py: theme.spacing(6),
          ...fadeInKeyframes,
          animation: "fadeIn .6s ease-out",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: theme.spacing(4),
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "start",
          }}
        >
          {rooms.map((room) => (
            <RoomCard room={room} key={room.key} />
          ))}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

(RoomsPage as any).seo = {
  title: "Rooms & Suites",
  description:
    "Well-appointed rooms with flat-screen TV, Wi-Fi, tea/coffee maker, writing desk and more at Hotel Poinisuk, Shillong. Deluxe & Premium include a mini-bar.",
  ogImage: "/images/og/rooms.jpg",
};
export default RoomsPage;
