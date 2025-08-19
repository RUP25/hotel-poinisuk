// pages/index.tsx
import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';

import NavBar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import AvailabilityForm from '@/components/AvailabilityForm';
import WelcomeSection from '@/components/WelcomeSection';
import FeaturesSection from '@/components/FeatureSection';
import BanquetPage from './banquet';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Avoid SSR issues with react-slick
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const heroImages = ['/images/image1.webp', '/images/image2.jpg', '/images/image5.jpg'];

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

const latestNews = [
  'Summer rooftop special at Dopwai now live!',
  '10% off Deluxe rooms if you book 30+ days in advance',
  'Spread Eagle Falls guided tours every weekend',
  'New in-house night club opening this Friday',
];

export default function Home() {
  const theme = useTheme();

  // Media queries
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Responsive hero height
  const heroHeight = isLgUp ? '100vh' : isMdUp ? '92vh' : isSmUp ? '85vh' : '78vh';

  // Typography sizes
  const headingFontSize = isLgUp ? '3.25rem' : isMdUp ? '2.75rem' : isSmUp ? '2.25rem' : '1.9rem';
  const subheadingFontSize = isMdUp ? '1.4rem' : isSmUp ? '1.2rem' : '1.05rem';
  const titleTopMargin = isLgUp ? 4 : isMdUp ? 4 : isSmUp ? 3 : 3; // theme.spacing units

  const handleCheckRates = (
    checkIn: Date | null,
    checkOut: Date | null,
    guests: number,
    children: number
  ) => {
    console.log({ checkIn, checkOut, guests, children });
  };

  // Slider perf tweaks for mobile and reduced motion
  const sliderProps = {
    autoplay: !prefersReducedMotion,
    autoplaySpeed: prefersReducedMotion ? 0 : 5000,
    infinite: true,
    speed: prefersReducedMotion ? 0 : 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: !prefersReducedMotion,
    pauseOnHover: true,
    adaptiveHeight: false,
  } as const;

  return (
    <>
      {/* ─── HERO ─── */}
      <Box
        sx={{
          position: 'relative',
          height: heroHeight,
          zIndex: 0,
          // Use dynamic viewport units on mobile for better address-bar handling
          '@supports (height: 100dvh)': {
            height: { xs: '100dvh', sm: heroHeight },
          },
          overflow: 'hidden',
        }}
      >
        {/* Slider layer (fills the hero height) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            // Make Slick internals respect full height
            '& .slick-slider, & .slick-list, & .slick-track': {
              height: '100%',
            },
            '& .slick-slide > div': {
              height: '100%',
            },
          }}
        >
          <Slider {...sliderProps}>
            {heroImages.map((url, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  height: '100%', // important: give each slide an explicit height
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: prefersReducedMotion ? 'none' : 'kenburns 6s ease-in-out forwards',
                  willChange: prefersReducedMotion ? 'auto' : 'transform',
                }}
              />
            ))}
          </Slider>
        </Box>

        <style>
          {`
            @keyframes kenburns {
              0% { transform: scale(1) translate(0, 0); }
              100% { transform: scale(1.08) translate(-1.5%, -1.5%); }
            }
          `}
        </style>

        {/* Overlay for readability */}
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)' }} />

        {/* Foreground content */}
        <Box
          sx={{
            position: 'relative',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 10, sm: 12, md: 15 },
            px: 1,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          {/* Ticker */}
          <Box
            component="section"
            role="region"
            aria-label="Latest updates"
            sx={{
              width: '100%',
              px: { xs: 1.25, sm: 3, md: 4 },
              mt: { xs: 4, sm: 3, md: 6 },
              display: { xs: 'block', sm: 'block' },
            }}
          >
            <Box
              sx={{
                maxWidth: 1600,
                mx: 'auto',
                backgroundColor: 'rgba(0,0,0,0.55)',
                borderRadius: 1,
                py: { xs: 0.25, sm: 0.5 },
                '& *': { fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } },
              }}
            >
              <Ticker items={latestNews} duration={isMdUp ? '20s' : '24s'} />
            </Box>
          </Box>

          <NavBar />

          {/* Headings */}
          <Typography
            component="h1"
            gutterBottom
            sx={{
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              mt: titleTopMargin,
              fontSize: headingFontSize,
              lineHeight: 1.15,
              textShadow: '2px 2px 8px rgba(0,0,0,0.45)',
              px: { xs: 1, sm: 0 },
            }}
          >
            Welcome to Hotel Poinisuk
          </Typography>

          <Typography
            component="p"
            gutterBottom
            sx={{
              fontFamily: 'Georgia, serif',
              fontSize: subheadingFontSize,
              opacity: 0.95,
              textShadow: '1px 1px 6px rgba(0,0,0,0.45)',
              maxWidth: { xs: 600, md: 900 },
              mx: 'auto',
              px: { xs: 1, sm: 0 },
            }}
          >
            Mesmerizing views & modern comfort in the heart of Shillong
          </Typography>

          {/* Availability Form container */}
          <Box
            sx={{
              width: { xs: '86%', sm: '92%', md: '90%', lg: '70%' },
              p: { xs: 1.25, sm: 2, md: 6, lg: 8 },
              mb: { xs: 2, sm: 10, md: 15 },
              bgcolor: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              boxShadow: '0 6px 26px rgba(0,0,0,0.35)',
              '& .MuiFormControl-root': { minWidth: 0 },
              '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } },
            }}
          >
            <AvailabilityForm onCheckRates={handleCheckRates} />
          </Box>
        </Box>
      </Box>

      {/* ─── MAIN CONTENT ─── */}
      <Box component="main">
        <WelcomeSection />
        <FeaturesSection features={features} />
        <Box component="section" id="banquet">
          <BanquetPage />
        </Box>
        <ContactSection />
      </Box>

      <Footer />
    </>
  );
}
