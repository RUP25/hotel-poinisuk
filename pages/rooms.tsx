// pages/rooms.tsx

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  Collapse,
} from "@mui/material";
import Slider from "react-slick";
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
import Footer from "@/components/Footer";

// slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Room {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  amenities: { icon: React.ReactNode; label: string }[];
  policies: string[];
}

const rooms: Room[] = [
  {
    title: "Premium Air Conditioned Rooms",
    subtitle: "Ideal for Families",
    description:
      "Our Premium rooms (474 sq.ft.) offer spacious comfort with modern conveniences—including a flat-screen TV, tea & coffee maker, complimentary Wi-Fi, telephone, writing desk with lamp, and a well-stocked minibar; guests consistently rave about their stay.",
    images: [
      "/images/rooms/IMG_8952.jpg",
      "/images/rooms/IMG_8956.jpg",
      "/images/rooms/bath1.jpg",
    ],
    amenities: [
      { icon: <LandscapeIcon />, label: "City view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 2" },
      { icon: <SingleBedIcon />, label: "1 King Bed" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
      { icon: <LocalLaundryServiceIcon />, label: "Laundry Service" },
      { icon: <TvIcon />, label: "Flat-screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi-Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 2 occupants; extra beds available on request (chargeable).",
      "Includes flat-screen TV, tea & coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: European Plan (EP) & Continental Plan (CP).",
      "Safety locker, bathtub, and individual geyser provided.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
  },
  {
    title: "Deluxe Air Conditioned Rooms",
    subtitle: "Ideal for Couples",
    description:
      "Our Deluxe rooms (269 sq.ft.) blend modern comforts—flat-screen TV, tea & coffee maker, complimentary Wi-Fi, telephone, writing desk with lamp—with a minibar option; families appreciate the thoughtful layout and amenities.",
    images: [
      "/images/rooms/IMG_8949.jpg",
      "/images/rooms/IMG_8950 (1).jpg",
      "/images/rooms/bath2.png",
    ],
    amenities: [
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 2" },
      { icon: <SingleBedIcon />, label: "1 Queen Bed" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
      { icon: <LocalLaundryServiceIcon />, label: "Laundry Service" },
      { icon: <TvIcon />, label: "Flat-screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi-Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 2 occupants; extra beds available on request (chargeable).",
      "Includes flat-screen TV, tea & coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP & CP.",
      "Bathtub & individual geyser only in Premium rooms; Deluxe has standard shower.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
  },
  {
    title: "Deluxe Non-AC Rooms",
    subtitle: "Ideal for Budget Travelers",
    description:
      "Our Deluxe Non-AC rooms (226.76 sq.ft.) provide a quiet, windowless retreat with modern essentials—flat-screen TV, tea & coffee maker, complimentary Wi-Fi, telephone, writing desk with lamp, and minibar; perfect for budget-minded couples.",
    images: [
      "/images/rooms/IMG_8954.jpg",
      "/images/rooms/IMG_8953.jpg",
      "/images/rooms/bath4.png",
    ],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 2" },
      { icon: <SingleBedIcon />, label: "2 Single Beds" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
      { icon: <TvIcon />, label: "Flat-screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi-Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 2 occupants; extra beds available on request (chargeable).",
      "Includes flat-screen TV, tea & coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP & CP.",
      "Bathtub & individual geyser only in Premium rooms; standard shower here.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
  },
  {
    title: "Executive Non-AC Rooms",
    subtitle: "Ideal for Single Travelers",
    description:
      "Our Executive Non-AC rooms (166 sq.ft.) offer sweeping city views, flat-screen TV, tea & coffee maker, complimentary Wi-Fi, telephone, and writing desk with lamp—an affordable yet comfortable choice.",
    images: [
      "/images/rooms/ENONAC.webp",
      "/images/rooms/ENONAC1.webp",
      "/images/rooms/bath4.png",
    ],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 2" },
      { icon: <SingleBedIcon />, label: "1 Queen Bed" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
      { icon: <TvIcon />, label: "Flat-screen TV" },
      { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
      { icon: <WifiIcon />, label: "Free Wi-Fi" },
      { icon: <PhoneIcon />, label: "Telephone" },
      { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
    ],
    policies: [
      "Occupancy: up to 2 occupants; no extra beds available.",
      "Includes flat-screen TV, tea & coffee maker, Wi-Fi, telephone, writing desk with lamp.",
      "Plan options: EP & CP.",
      "Bathtub & geyser only in Premium rooms; shower only here.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries & hair dryer; centralized hot & cold water 24/7.",
    ],
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 200,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  cssEase: "ease-in-out" as const,
};

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        // height: "100%",  ← removed so each card auto-sizes
      }}
    >
      <Box sx={{ position: "relative", height: 300 }}>
        <Slider {...sliderSettings}>
          {room.images.map((src, i) => (
            <Box key={i} sx={{ position: "relative", width: "100%", height: 300 }}>
              <Image
                src={src}
                alt={`${room.title} ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" fontWeight="bold">
          {room.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mt: 0.5 }}>
          {room.subtitle}
        </Typography>
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
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {a.icon}
              <Typography variant="body2">{a.label}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained">Check Availability</Button>
          <Button variant="outlined" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {room.policies.map((policy, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
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

  return (
    <>
      {/* Masthead */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, md: 300 },
          backgroundImage: "url('/images/rooms/masthead.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
          }}
        />
      </Box>

      {/* Page Content */}
      <Container maxWidth="lg" sx={{ py: theme.spacing(6) }}>
        <Typography variant="h4" gutterBottom>
          <strong>Our Rooms & Cabins</strong>
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: theme.spacing(4),
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "start",  // ensures cards do not stretch to match height
          }}
        >
          {rooms.map((room, idx) => (
            <RoomCard room={room} key={idx} />
          ))}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default RoomsPage;
