// pages/index.tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Slider from 'react-slick';

import AvailabilityForm from '@/components/AvailabilityForm';
import WelcomeSection from '@/components/WelcomeSection';
import FeaturesSection from '@/components/FeatureSection';
import BanquetPage from './banquet';
import ContactSection from '@/components/ContactSection';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NavBar from '@/components/Navbar';

const heroImages = [
  '/images/image4.jpg',
  '/images/image2.jpg',
  '/images/image5.jpg',
];

const features = [
  { title: 'Rooms & Suites', subtitle: 'Exceptional Accommodations', image: '/images/room1.jpg', href: '/rooms' },
  { title: 'Dining', subtitle: 'A World of Flavors', image: '/images/dine1.jpg', href: '/dine' },
  { title: 'Bar & Lounge', subtitle: 'Handcrafted Cocktails', image: '/images/bar/bar.jpg', href: '/klong' },
  { title: 'Travel Desk', subtitle: 'Guided Tours & Trips', image: '/images/travel-desk.jpg', href: '#' },
  { title: 'Complimentary Breakfast', subtitle: 'Start Your Day Right', image: '/images/bfast.webp', href: '#' },
  { title: 'Free Wi-Fi', subtitle: 'Always Connected', image: '/images/Wi-Fi.webp', href: '#' },
  { title: 'On-site Parking', subtitle: 'Convenience at Your Doorstep', image: '/images/parking.webp', href: '#' },
  { title: 'Doctor on Call', subtitle: 'Your Health, Our Priority', image: '/images/doctor.webp', href: '#' },
  { title: 'Banquet Hall', subtitle: 'Perfect for Events', image: '/images/banquet.avif', href: '#banquet' },
];

export default function Home() {
  const theme = useTheme();

  const handleCheckRates = (
    checkIn: Date | null,
    checkOut: Date | null,
    guests: number,
    children: number
  ) => {
    console.log({ checkIn, checkOut, guests, children });
  };

  return (
    <>
      {/* Full-screen hero slider */}
      <Box sx={{ position: 'relative', height: '100vh', zIndex: 0 }}>
        <Slider
          autoplay
          autoplaySpeed={5000}
          infinite
          speed={1000}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false}
          dots={false}
          fade
        >
          {heroImages.map((url, idx) => (
            <Box
              key={idx}
              sx={{
                height: '100vh',
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: 'kenburns 5s ease-in-out',
              }}
            />
          ))}
        </Slider>
    

        {/* Custom CSS for Ken Burns effect */}
        <style>
          {`
            @keyframes kenburns {
              0% {
                transform: scale(1);
              }
              100% {
                transform: scale(1.1);
              }
            }
          `}
        </style>

        {/* Overlay */}
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)' }} />

        {/* Hero content */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            px: 2,
          }}
        >
          <NavBar />
          <Typography variant="h2" gutterBottom sx={{ fontFamily: 'Georgia, serif', fontWeight: 400, mt:5 }}>
            Welcome to Hotel Poinisuk
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Georgia, serif' }}>
            Mesmerizing views & modern comfort in the heart of Shillong
          </Typography>

          <Box
            sx={{
              mt: 4,
              width: { xs: '100%', sm: '90%', md: '80%', lg: '60%' },
              p: { xs: 2, md: 4 },
              bgcolor: 'transparent',
              backdropFilter: 'blur(6px)',
              '& .MuiFilledInput-root, & .MuiOutlinedInput-root': { bgcolor: 'transparent' },
            }}
          >
            <AvailabilityForm onCheckRates={handleCheckRates} />
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box component="main">
        <WelcomeSection />
        <FeaturesSection features={features} />
        <Box component="section" id="banquet">
          <BanquetPage />
        </Box>
        <ContactSection />
      </Box>
    </>
  );
}
