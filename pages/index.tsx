// pages/index.tsx
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import {
  RESERVATION_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PURPLE,
  PURPLE_HOVER,
  LAVENDER,
  INK,
  SANS_UI,
  SERIF_DISPLAY,
  HERO_POINISUK_ON_DARK_SRC,
  HERO_POINISUK_W,
  HERO_POINISUK_H,
  HERO_POINISUK_SIZES,
} from '@/lib/luxury-chrome';

// import Ticker from '@/components/Ticker';
import WelcomeSection from '@/components/WelcomeSection';
import FeaturesSection from '@/components/FeatureSection';
import BanquetPage from './banquet';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import GuestServices from '@/components/GuestServices';
import ContactDialog from '@/components/ContactDialog';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import type { NextPageWithSeo } from '@/types/next-page-with-seo';
import { makeFaqLd } from '@/lib/seo';

// Avoid SSR issues with react-slick 
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const heroImages = [
  { src: '/images/hero-exterior.jpg', alt: 'Hotel Poinisuk exterior in Shillong' },
  { src: '/images/hero-lobby-2k.jpg', alt: 'Lobby lounge and staircase at Hotel Poinisuk' },
  { src: '/images/hero-lounge-2k.jpg', alt: 'Seating lounge at Hotel Poinisuk' },
  { src: '/images/hero-rooftop-2k.jpg', alt: 'Rooftop dining at night at Hotel Poinisuk' },
  { src: '/images/hero-dining-2k.jpg', alt: 'Indoor dining room at Hotel Poinisuk' },
  { src: '/images/hero-klong-2k.jpg', alt: 'Klong lounge and bar at Hotel Poinisuk' },
];

// IMPORTANT: titles drive grid placement only (labels are hidden in the component)
const features = [
  { title: 'Poinisuk',          image: '/images/rooms/suite-king.jpg',         href: '/rooms' },
  { title: 'Executive Non AC',  image: '/images/rooms/suite-twin.jpg',         href: '/rooms' },
  { title: 'Deluxe Non AC',     image: '/images/rooms/suite-table.jpg',       href: '/rooms' },
  { title: 'Deluxe',            image: '/images/rooms/suite-king-lounge.jpg',  href: '/rooms' },
  { title: 'Premium',           image: '/images/hero-lobby-2k.jpg',            href: '/rooms' },
];

const homepageFaqs = [
  {
    question: "Where is Hotel Poinisuk located in Shillong?",
    answer:
      "Hotel Poinisuk is located at Lady Veronica Lane, Nongkynrih, Laitumkhrah (Police Point), Shillong, Meghalaya 793003, close to key city attractions.",
  },
  {
    question: "How far is Hotel Poinisuk from Ward's Lake and Lady Hydari Park?",
    answer:
      "Hotel Poinisuk is a short drive from Ward's Lake and Lady Hydari Park, making it convenient for sightseeing in Shillong.",
  },
  {
    question: "Does Hotel Poinisuk have dining and lounge options?",
    answer:
      "Yes, guests can enjoy Dopwai rooftop dining and Klong Lounge, along with in-room dining options at the hotel.",
  },
  {
    question: "Is Hotel Poinisuk suitable for family stays and events?",
    answer:
      "Yes. The hotel offers family-friendly rooms and an elegant banquet hall suitable for weddings, receptions, and corporate events.",
  },
];

/** Places a guest can land from the hero itself. */
const heroQuickLinks = [
  { label: 'Banquet & Event Booking', action: 'banquet-dialog' as const },
  { label: 'Live Karaoke', href: '/karaoke' },
  { label: 'Contact', href: '/#contact-section' },
];

const heroCtaBaseSx = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: SANS_UI,
  fontWeight: 600,
  fontSize: { xs: '0.7rem', md: '0.76rem' },
  letterSpacing: { xs: '0.14em', md: '0.18em' },
  textTransform: 'uppercase',
  textDecoration: 'none',
  px: { xs: 2.75, md: 4 },
  py: { xs: 1.5, md: 1.75 },
  transition:
    'background-color 220ms ease, border-color 220ms ease, color 220ms ease, transform 220ms ease, opacity 220ms ease',
  '&:focus-visible': { outline: `2px solid ${LAVENDER}`, outlineOffset: 3 },
} as const;

const heroQuickLinkSx = {
  fontFamily: SANS_UI,
  fontWeight: 500,
  fontSize: { xs: '0.66rem', md: '0.72rem' },
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.78)',
  pb: 0.4,
  bgcolor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  appearance: 'none',
  borderBottom: '1px solid transparent',
  transition: 'color 200ms ease, border-color 200ms ease',
  '&:hover': { color: '#fff', borderBottomColor: 'rgba(202,166,255,0.8)' },
} as const;

const heroKenBurnsSx = {
  transformOrigin: 'center',
  animation: 'kenburns 18s ease-in-out infinite alternate',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
} as const;

const Home: NextPageWithSeo = () => {
  const [mounted, setMounted] = React.useState(false);
  const prefersReducedMotion =
    mounted &&
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tracks whether react-slick has finished mounting. While `false`, a static
  // SSR-rendered hero image (slide 0) is visible — this gives us a real LCP
  // element in the initial HTML payload, instead of waiting for the dynamic
  // import + hydration before any image renders. Flipped to `true` from the
  // slider's onInit callback. We then fade the static image out so the
  // slider's own fade transitions don't double-render slide 0.
  const [slickReady, setSlickReady] = React.useState(false);
  const [banquetContactOpen, setBanquetContactOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    onInit: () => setSlickReady(true),
  };

  return (
    <>
      {/* Preload the LCP hero image so the browser starts downloading it before
          react-slick hydrates. Critical for Largest Contentful Paint on home. */}
      <Head>
        <link
          rel="preload"
          as="image"
          href={heroImages[0].src}
          fetchPriority="high"
        />
      </Head>

      {/* ─── HERO (full viewport, luxury editorial) ─── */}
      <Box
        component="header"
        role="banner"
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          zIndex: 0,
          bgcolor: INK,
          // Content sits in normal flow and is centred by the flex box, so a
          // short viewport grows the hero past 100vh instead of clipping it.
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          '@supports (height: 100dvh)': { minHeight: '100dvh' },
          '@supports (height: 100svh)': { minHeight: '100svh' },
        }}
      >

        {/* SSR-rendered static slide 0 — this is the actual LCP element.
            It exists in the initial HTML so the browser can start downloading
            the hero image as early as possible, without waiting for the
            react-slick dynamic import + React hydration. Once slick has
            mounted (onInit), this layer fades out and the slider takes over.
            Visually identical to slick's slide 0 so the handoff is seamless. */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: slickReady ? 0 : 1,
            transition: 'opacity 400ms ease',
            overflow: 'hidden',
            '& img': heroKenBurnsSx,
          }}
        >
          <Image
            src={heroImages[0].src}
            alt={heroImages[0].alt}
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: 'cover',
              filter: 'brightness(0.88) saturate(0.95)',
            }}
          />
        </Box>

        {/* Slider layer (mounts client-side after hydration) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            '& .slick-slider, & .slick-list, & .slick-track': { height: '100%' },
            '& .slick-slide > div': { height: '100%' },
          }}
          aria-label="Property highlights slideshow"
        >
          <Slider {...sliderProps}>
            {heroImages.map((slide) => (
              <Box
                key={slide.src}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  '& img': heroKenBurnsSx,
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: 'cover',
                    filter: 'brightness(0.88) saturate(0.95)',
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Cinematic overlay — a centre vignette for headline legibility plus a
            vertical wash that anchors the utility rail at the bottom. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 78% 62% at 50% 50%, rgba(12,8,21,0.50) 0%, rgba(12,8,21,0.14) 58%, rgba(12,8,21,0) 100%),' +
              'linear-gradient(180deg, rgba(12,8,21,0.58) 0%, rgba(20,8,40,0.20) 30%, rgba(20,8,40,0.34) 62%, rgba(12,8,21,0.86) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── Hero content ── */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 3, sm: 4, md: 6 },
            // clears the transparent header above and the utility rail below
            pt: { xs: 13, sm: 15, md: 17 },
            pb: { xs: 11, sm: 15, md: 16 },
          }}
        >
          <Box sx={{ maxWidth: 960, width: '100%' }}>
            <Typography
              component="p"
              sx={{
                fontFamily: SANS_UI,
                fontWeight: 600,
                fontSize: { xs: '0.58rem', sm: '0.64rem', md: '0.7rem' },
                letterSpacing: { xs: '0.28em', md: '0.36em' },
                textTransform: 'uppercase',
                color: LAVENDER,
                pl: { xs: '0.28em', md: '0.36em' },
                textShadow: '0 1px 12px rgba(12,8,21,0.7)',
                animation: 'heroFade 900ms ease both 120ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              Est. 1979
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: { xs: 60, md: 84 },
                height: '1px',
                mx: 'auto',
                my: { xs: 2, md: 2.75 },
                background:
                  'linear-gradient(90deg, rgba(202,166,255,0) 0%, rgba(202,166,255,0.85) 50%, rgba(202,166,255,0) 100%)',
                animation: 'heroFade 900ms ease both 240ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />

            {/* The page's single <h1>. Poinisuk is the real wordmark (purple K);
                Hotel sits over the P the way the lockup is drawn. The welcome
                section below carries an <h2>. */}
            <Typography
              component="h1"
              sx={{
                m: 0,
                mx: 'auto',
                width: '100%',
                maxWidth: { xs: 300, sm: 400, md: 500, lg: 560 },
                textAlign: 'left',
                animation: 'heroRise 1000ms cubic-bezier(.22,.61,.36,1) both 300ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: SERIF_DISPLAY,
                  fontWeight: 500,
                  fontSize: { xs: '0.72rem', sm: '0.88rem', md: '1.05rem' },
                  letterSpacing: { xs: '0.28em', md: '0.38em' },
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.94)',
                  pl: { xs: '0.08em', md: '0.12em' },
                  mb: { xs: 0.25, md: 0.5 },
                  textShadow: '0 1px 18px rgba(12,8,21,0.65)',
                }}
              >
                Hotel
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  width: '100%',
                  '& img': {
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none',
                  },
                }}
              >
                <Image
                  src={HERO_POINISUK_ON_DARK_SRC}
                  alt="Poinisuk"
                  width={HERO_POINISUK_W}
                  height={HERO_POINISUK_H}
                  priority
                  sizes={HERO_POINISUK_SIZES}
                />
              </Box>
            </Typography>

            <Typography
              component="p"
              sx={{
                fontFamily: SANS_UI,
                fontSize: { xs: '0.88rem', sm: '0.95rem', md: '1.05rem' },
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.86)',
                maxWidth: 620,
                mx: 'auto',
                mt: { xs: 2.25, md: 3 },
                textShadow: '0 1px 16px rgba(12,8,21,0.7)',
                animation: 'heroRise 1000ms cubic-bezier(.22,.61,.36,1) both 420ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              Teak-warm rooms, rooftop dining at Dopwai, and long evenings at
              Klong &mdash; in the heart of the city.
            </Typography>

            {/* Primary calls to action */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1.5, md: 2 },
                mt: { xs: 3.5, md: 4.5 },
                animation: 'heroRise 1000ms cubic-bezier(.22,.61,.36,1) both 540ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              <Box
                component="a"
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...heroCtaBaseSx,
                  bgcolor: PURPLE,
                  color: '#fff',
                  border: `1px solid ${PURPLE}`,
                  boxShadow: '0 10px 30px rgba(95,2,171,0.38)',
                  '&:hover': {
                    bgcolor: PURPLE_HOVER,
                    borderColor: PURPLE_HOVER,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Book Your Stay
              </Box>

              <Box
                component={Link}
                href="/rooms"
                sx={{
                  ...heroCtaBaseSx,
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(2px)',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.12)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Explore Rooms
              </Box>

              <Box
                component="a"
                href={PHONE_HREF}
                sx={{
                  ...heroCtaBaseSx,
                  color: '#fff',
                  border: '1px solid transparent',
                  px: { xs: 1.5, md: 2 },
                  opacity: 0.9,
                  '&:hover': { opacity: 1, color: LAVENDER },
                }}
              >
                {PHONE_DISPLAY}
              </Box>
            </Box>

            {/* Secondary destinations — every entry point visible up front */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: { xs: 2, md: 3 },
                rowGap: 1,
                mt: { xs: 3, md: 4 },
                animation: 'heroFade 1000ms ease both 660ms',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              {heroQuickLinks.map((link, i) => (
                <React.Fragment key={link.label}>
                  {i > 0 && (
                    <Box
                      aria-hidden
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.4)',
                      }}
                    />
                  )}
                  {'action' in link && link.action === 'banquet-dialog' ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setBanquetContactOpen(true)}
                      sx={heroQuickLinkSx}
                    >
                      {link.label}
                    </Box>
                  ) : (
                    <Box component={Link} href={link.href!} sx={heroQuickLinkSx}>
                      {link.label}
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Scroll cue */}
        <Box
          component={Link}
          href="#welcome"
          aria-label="Scroll to explore the hotel"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: { xs: 70, md: 78 },
            zIndex: 3,
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.75)',
            fontFamily: SANS_UI,
            fontWeight: 600,
            fontSize: '0.56rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            pl: '0.3em',
            transition: 'color 220ms ease',
            '&:hover': { color: LAVENDER },
          }}
        >
          Scroll
          <Box
            aria-hidden
            sx={{
              width: '1px',
              height: 34,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
              animation: 'scrollCue 2.4s ease-in-out infinite',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
        </Box>

        {/* ── Bottom utility rail: address on the left, booking CTA on the right ── */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            backgroundColor: 'rgba(12,8,21,0.32)',
            backdropFilter: 'saturate(140%) blur(6px)',
            WebkitBackdropFilter: 'saturate(140%) blur(6px)',
          }}
        >
          <Typography
            component="p"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 3,
              fontFamily: SANS_UI,
              fontSize: '0.68rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)',
              whiteSpace: 'nowrap',
            }}
          >
            Police Point, Laitumkhrah &nbsp;&middot;&nbsp; Shillong 793003
          </Typography>

          <Box sx={{ flex: { xs: 1, md: '0 0 auto' }, display: 'flex' }}>
            <Box
              component="a"
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Complete your booking"
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.25,
                bgcolor: PURPLE,
                color: '#fff',
                fontFamily: SANS_UI,
                fontWeight: 600,
                fontSize: { xs: '0.68rem', sm: '0.72rem', md: '0.76rem' },
                letterSpacing: { xs: '0.12em', md: '0.16em' },
                textTransform: 'uppercase',
                textDecoration: 'none',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1.6, md: 1.9 },
                transition: 'background-color 220ms ease, gap 220ms ease',
                '&:hover': { bgcolor: PURPLE_HOVER, gap: 1.75 },
              }}
            >
              Complete your booking
              <Box component="span" aria-hidden sx={{ lineHeight: 1 }}>
                &rarr;
              </Box>
            </Box>
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
        <Box
          component="section"
          sx={{
            maxWidth: { xs: "100%", lg: 1100, xl: 1200 },
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            py: { xs: 5, sm: 6, md: 7, lg: 8, xl: 9 },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: 600,
              textAlign: "center",
              mb: { xs: 1.25, sm: 1.5, md: 1.75, lg: 2 },
              fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem", lg: "2.2rem", xl: "2.4rem" },
              lineHeight: { xs: 1.25, md: 1.2 },
              color: "#320953",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            component="p"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              mb: { xs: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5 },
              maxWidth: { xs: "100%", sm: 720, md: 780, lg: 820 },
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1rem", lg: "1.05rem" },
              lineHeight: 1.55,
              px: { xs: 1, sm: 0 },
            }}
          >
            Helpful answers for guests planning a comfortable stay at Hotel Poinisuk in Shillong.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1.5, sm: 1.75, md: 2, lg: 2.25, xl: 2.5 },
            }}
          >
            {homepageFaqs.map((faq) => (
              <Box
                key={faq.question}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  p: { xs: 2, sm: 2.25, md: 2.5, lg: 2.75, xl: 3 },
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 0.75, md: 1 },
                    color: "#320953",
                    fontSize: { xs: "1rem", md: "1.05rem", lg: "1.1rem" },
                    lineHeight: 1.35,
                  }}
                >
                  {faq.question}
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "0.92rem", md: "0.98rem", lg: "1rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {faq.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Footer />

      <ContactDialog
        open={banquetContactOpen}
        onClose={() => setBanquetContactOpen(false)}
        source="hotelpoinisuk.com / hero-banquet"
        title="Plan Your Event"
        subtitle="Weddings, receptions, or a corporate evening — tell us what you have in mind and our banquet team will get back to you shortly."
        defaultSubject="Banquet & event booking"
      />
    </>
  );
};

// ✅ Page-level SEO override (Home must show "Shillong")
Home.seo = {
  title: 'Hotel in Shillong | Hotel Poinisuk',
  description:
    'Hotel Poinisuk — boutique hotel in Shillong with mesmerizing views & modern comfort. Rooftop dining at Dopwai, Klong Lounge, banquet hall, and easy access to Ward\'s Lake & Lady Hydari Park. Book direct for best rates.',
  keywords: 'Hotel Poinisuk, Shillong hotel, hotel in Shillong, Meghalaya hotel, best hotel Shillong, Shillong accommodation, boutique hotel Shillong, hotel near Ward\'s Lake, hotel near Lady Hydari Park',
  ogImage: '/images/og/home-hero.jpg',
  schema: makeFaqLd(homepageFaqs),
};

export default Home;
