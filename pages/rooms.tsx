// pages/rooms.tsx

import React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";

// amenity icons
import LandscapeIcon from "@mui/icons-material/Landscape";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import HotelIcon from "@mui/icons-material/Hotel";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import PeopleIcon from "@mui/icons-material/People";
import BathtubIcon from "@mui/icons-material/Bathtub";
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
}

const rooms: Room[] = [
  {
    title: "Premium Air Conditioned Rooms",
    subtitle: "Ideal for couples",
    description:
      "Our spacious Deluxe Cabins (built in 2004 & 2009) feature a king bed, a large sitting area with queen sofa bed and a private deck facing into nature. Each of these cabins also includes a charming cast iron gas fireplace.",
    images: ["/images/rooms/IMG_8952.jpg", "/images/rooms/IMG_8956.jpg", "/images/rooms/bath1.jpg"],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 4" },
      { icon: <SingleBedIcon />, label: "2 Queen Beds" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
    ],
  },
  {
    title: "Deluxe Air Conditioned Rooms",
    subtitle: "Ideal for families",
    description:
      "The magnificent John Muir House (built in 2009) is a beautiful 2,500 sq ft rental home with three bedrooms and a large loft. Located on the property and available for stays of two nights or more.",
    images: ["/images/rooms/IMG_8949.jpg", "/images/rooms/IMG_8950 (1).jpg", "/images/rooms/bath2.png"],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "3 Bedrooms" },
      { icon: <PeopleIcon />, label: "Sleeps 6" },
      { icon: <SingleBedIcon />, label: "3 Queen Beds" },
      { icon: <BathtubIcon />, label: "2 Bathrooms" },
    ],
  },

    {
    title: "Deluxe Non AC Rooms",
    subtitle: "Ideal for couples",
    description:
      "Our spacious Deluxe Cabins (built in 2004 & 2009) feature a king bed, a large sitting area with queen sofa bed and a private deck facing into nature. Each of these cabins also includes a charming cast iron gas fireplace.",
    images: ["/images/rooms/IMG_8954.jpg", "/images/rooms/IMG_8953.jpg", "/images/rooms/bath4.png"],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 4" },
      { icon: <SingleBedIcon />, label: "2 Queen Beds" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
    ],
  },

    {
    title: "Executive Non AC Rooms",
    subtitle: "Ideal for couples",
    description:
      "Our spacious Deluxe Cabins (built in 2004 & 2009) feature a king bed, a large sitting area with queen sofa bed and a private deck facing into nature. Each of these cabins also includes a charming cast iron gas fireplace.",
    images: ["/images/rooms/ENONAC.webp", "/images/rooms/ENONAC1.webp", "/images/rooms/bath4.png"],
    amenities: [
      { icon: <LandscapeIcon />, label: "Resort view" },
      { icon: <AcUnitIcon />, label: "Air conditioning" },
      { icon: <HotelIcon />, label: "1 Bedroom" },
      { icon: <PeopleIcon />, label: "Sleeps 4" },
      { icon: <SingleBedIcon />, label: "2 Queen Beds" },
      { icon: <BathtubIcon />, label: "1 Bathroom" },
    ],
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Carousel */}
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

      {/* Content */}
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

        {/* Amenities */}
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

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained">Check Availability</Button>
          <Button variant="outlined">View Details</Button>
        </Box>
      </Box>
    </Box>
  );
};

const RoomsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      {/* ─── Masthead ─── */}
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
        {/* Dark overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
          }}
        />
        {/* Title */}
        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          {/* <Typography
            variant="h2"
            component="h1"
            color="common.white"
            sx={{ pr: { md: 4 } }}
          >
            Rooms
          </Typography> */}
        </Container>
      </Box>

      {/* ─── Page Content ─── */}
      <Container maxWidth="lg" sx={{ py: theme.spacing(6) }}>
        <Typography variant="h4" gutterBottom>
          <strong>Our Rooms & Cabins</strong>
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: theme.spacing(4),
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
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
