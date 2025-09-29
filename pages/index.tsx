// pages/index.tsx
import React from 'react';
import Image from 'next/image';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import NavBar from '@/components/Navbar';
// import Ticker from '@/components/Ticker';
import WelcomeSection from '@/components/WelcomeSection';
import FeaturesSection from '@/components/FeatureSection';
import BanquetPage from './banquet';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import GuestServices from '@/components/GuestServices';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import type { NextPageWithSeo } from '@/types/next-page-with-seo';
import BookingRedirectForm from '@/components/BookingRedirectForm';

// Avoid SSR issues with react-slick 
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const heroImages = [
  '/images/image1.webp',
  '/images/image2.jpeg',
  '/images/image5.jpg',
  '/images/image6.webp',
];

// IMPORTANT: titles drive grid placement only (labels are hidden in the component)
const features = [
  { title: 'Poinisuk',          image: '/images/image3.jpg',              href: '/rooms' },
  { title: 'Executive Non AC',  image: '/images/rooms/ENONAC1.webp',      href: '/rooms' },
  { title: 'Deluxe Non AC',     image: '/images/rooms/MIROR.jpg',        href: '/rooms' },
  { title: 'Deluxe',            image: '/images/rooms/TWIN2.jpg',        href: '/rooms' },
  { title: 'Premium',           image: '/images/rooms/PremiumAC.jpg',     href: '/rooms' },
];

const Home: NextPageWithSeo = () => {
  const theme = useTheme();

  // Media queries with no SSR flicker
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });

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
    lazyLoad: 'ondemand' as const,
    waitForAnimate: true,
    cssEase: 'ease-in-out',
    touchThreshold: 8,
    swipeToSlide: true,
    draggable: true,
  };

  return (
    <>
      {/* ─── HERO (full viewport height, responsive) ─── */}
      <Box
        component="header"
        role="banner"
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          zIndex: 0,
          '@supports (height: 100dvh)': { minHeight: '100dvh' },
          '@supports (height: 100svh)': { minHeight: '100svh' },
        }}
      >
        {/* Slider layer */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            '& .slick-slider, & .slick-list, & .slick-track': { height: '100%' },
            '& .slick-slide > div': { height: '100%' },
          }}
          aria-label="Property highlights slideshow"
        >
          <Slider {...sliderProps}>
            {heroImages.map((url, idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  '& img': {
                    transformOrigin: 'center',
                    animation: prefersReducedMotion ? 'none' : 'kenburns 6s ease-in-out forwards',
                    willChange: prefersReducedMotion ? 'auto' : 'transform',
                  },
                }}
              >
                <Image
                  src={url}
                  alt={
                    idx === 0
                      ? 'Hotel Poinisuk exterior with scenic Shillong views'
                      : idx === 1
                      ? 'Well-appointed rooms at Hotel Poinisuk'
                      : 'Rooftop dining at Dopwai, Hotel Poinisuk'
                  }
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Ken Burns keyframes */}
        <style>
          {`
            @keyframes kenburns {
              0%   { transform: scale(1) translate(0, 0); }
              100% { transform: scale(1.08) translate(-1.5%, -1.5%); }
            }
          `}
        </style>

        {/* Overlay for contrast */}
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.40)' }} />

        {/* Foreground content (centered, responsive) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1600,
            mx: 'auto',
            px: { xs: 1.25, sm: 2, md: 4 },
            pt: { xs: 10, sm: 12, md: 35 },
            pb: { xs: 4, sm: 6, md: 8 },
            color: '#fff',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <NavBar />

          {/* Headings — animated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ width: '100%' }}
          >
            <Typography
              component="h1"
              gutterBottom
              sx={{
                fontFamily: 'Georgia, serif',
                fontWeight: 400,
                fontSize: { xs: '1.9rem', sm: '2.25rem', md: '2.75rem', lg: '3.25rem' },
                lineHeight: 1.15,
                textShadow: '2px 2px 8px rgba(0,0,0,0.45)',
                mt: { xs: 2, md: 3 },
              }}
            >
              Welcome to Hotel Poinisuk
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ width: '100%' }}
          >
            <Typography
              component="p"
              gutterBottom
              sx={{
                fontFamily: 'Georgia, serif',
                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.4rem' },
                opacity: 0.95,
                textShadow: '1px 1px 6px rgba(0,0,0,0.45)',
                maxWidth: { xs: 600, md: 900 },
                mx: 'auto',
              }}
            >
              Mesmerizing views & modern comfort in the heart of Shillong
            </Typography>
          </motion.div>

          {/* Single availability form (SwiftBook widget) inside your glass container */}
          <Box
            sx={{
              width: { xs: '92%', sm: '88%', md: '80%', lg: '70%' },
              p: { xs: 1.25, sm: 2, md: 4, lg: 5 },
              mb: { xs: 2, sm: 4, md: 6 },
              bgcolor: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              boxShadow: '0 6px 26px rgba(0,0,0,0.35)',
            }}
          >
            {/* ⟵ Only this shows now. Remove any other QuickBook divs on the page. */}
            <BookingRedirectForm />
          </Box>
        </Box>
      </Box>

      {/* ─── MAIN CONTENT ─── */}
      <Box component="main">
        <WelcomeSection />
        <FeaturesSection features={features} />
        <Box component="section" id="banquet" aria-label="Banquet Hall">
          <BanquetPage />
        </Box>
        <ContactSection />
        <GuestServices />
      </Box>

      <Footer />
    </>
  );
};

// ✅ Page-level SEO override (Home must show “Shillong”)
Home.seo = {
  title: 'Shillong',
  description:
    'Hotel Poinisuk — mesmerizing views & modern comfort in the heart of Shillong. Rooftop dining, lounge, banquet & more.',
  ogImage: '/images/og/home-hero.jpg',
};

export default Home;
