// pages/rooms.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Typography,
  Collapse,
  Chip,
  GlobalStyles,
  useMediaQuery,
} from "@mui/material";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AcUnitIcon from "@mui/icons-material/AcUnit";
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
import type { NextPageWithSeo } from "@/types/next-page-with-seo";
import { ROOM_CATALOG, type RoomAmenityKey } from "@/lib/room-catalog";
import { makeHotelRoomLd } from "@/lib/seo";

// Human-readable labels used to populate `HotelRoom.amenityFeature` so each
// room category appears as a fully-qualified entity in Google's rich results.
const AMENITY_LABELS: Record<RoomAmenityKey, string> = {
  cityView: "City View",
  airConditioning: "Air Conditioning",
  flatScreenTv: "Flat-Screen TV",
  teaCoffee: "Tea / Coffee Maker",
  wifi: "Free Wi-Fi",
  telephone: "Telephone",
  desk: "Writing Desk",
  laundry: "Laundry Service",
  bathtub: "Bathtub",
};

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SSR-safe slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

/* ────────── brand typography ────────── */
const serif = "var(--font-cormorant), 'Playfair Display', 'Georgia', 'Times New Roman', serif";
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";

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
  sleeps: number;
  bed: string;
  hasAC: boolean;
  hasWindow: boolean;
}

const amenityMap: Record<RoomAmenityKey, Amenity> = {
  cityView: { icon: <LandscapeIcon />, label: "City view" },
  airConditioning: { icon: <AcUnitIcon />, label: "Air conditioning" },
  flatScreenTv: { icon: <TvIcon />, label: "Flat-screen TV" },
  teaCoffee: { icon: <CoffeeMakerIcon />, label: "Tea & Coffee Maker" },
  wifi: { icon: <WifiIcon />, label: "Free Wi-Fi" },
  telephone: { icon: <PhoneIcon />, label: "Telephone" },
  desk: { icon: <DeskIcon />, label: "Writing Desk with Lamp" },
  laundry: { icon: <LocalLaundryServiceIcon />, label: "Laundry Service" },
  bathtub: { icon: <BathtubIcon />, label: "Bathtub" },
};

const rooms: Room[] = ROOM_CATALOG.map((room) => ({
  key: room.slug,
  title: room.title,
  subtitle: room.subtitle,
  description: room.description,
  images: room.images,
  amenities: room.amenities.map((amenity) => amenityMap[amenity]),
  policies: room.policies,
  sleeps: room.sleeps,
  bed: room.bed,
  hasAC: room.hasAC,
  hasWindow: room.hasWindow,
}));

const sliderSettings = (reduceMotion: boolean) => ({
  dots: true,
  infinite: true,
  speed: reduceMotion ? 0 : 360,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: !reduceMotion,
  autoplaySpeed: 3400,
  pauseOnHover: true,
  cssEase: "ease-in-out" as const,
});

/* ════════════════════════════════════════════
   Room card
   ════════════════════════════════════════════ */
const RoomCard: React.FC<{ room: Room; index: number }> = ({ room, index }) => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const chipSx = {
    bgcolor: "rgba(95,2,171,0.08)",
    color: "#320953",
    border: "1px solid rgba(95,2,171,0.18)",
    fontFamily: cormorant,
    fontWeight: 500,
    fontSize: "0.86rem",
    letterSpacing: "0.02em",
    "& .MuiChip-icon": { color: "#5f02ab" },
  };

  const metaChips = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, mb: 1.5 }}>
      <Chip size="small" icon={<PeopleIcon />} label={`Sleeps ${room.sleeps}`} sx={chipSx} />
      <Chip size="small" icon={<BedIcon />} label={room.bed} sx={chipSx} />
      <Chip
        size="small"
        icon={<AcUnitIcon />}
        label={room.hasAC ? "A/C" : "Non‑A/C"}
        sx={chipSx}
      />
      <Chip
        size="small"
        icon={<LandscapeIcon />}
        label={room.hasWindow ? "Window" : "No Window"}
        sx={chipSx}
      />
    </Box>
  );

  return (
    <Box
      ref={cardRef}
      sx={{
        position: "relative",
        background:
          "linear-gradient(180deg, #ffffff 0%, #faf8f4 100%)",
        border: "1px solid rgba(50,9,83,0.08)",
        borderRadius: "14px",
        boxShadow:
          "0 1px 2px rgba(50,9,83,0.05), 0 6px 14px rgba(50,9,83,0.08), 0 18px 36px rgba(50,9,83,0.10)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transformStyle: "preserve-3d",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "perspective(1400px) rotateX(0deg) translateY(0)"
          : "perspective(1400px) rotateX(0deg) translateY(28px)",
        transition: `opacity 850ms cubic-bezier(.2,.7,.2,1) ${index * 110}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${index * 110}ms, box-shadow 420ms ease, border-color 320ms ease`,
        willChange: "transform, box-shadow",
        "&:hover": {
          transform:
            "perspective(1400px) rotateX(2.2deg) translateY(-8px) scale(1.012)",
          boxShadow:
            "0 2px 4px rgba(50,9,83,0.08), 0 14px 28px rgba(50,9,83,0.16), 0 36px 64px rgba(50,9,83,0.22)",
          borderColor: "rgba(95,2,171,0.24)",
        },
        "&:hover .room-img-wrap img": { transform: "scale(1.06)" },
        /* glossy top edge highlight */
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: 4,
        },
      }}
    >
      <Box
        className="room-img-wrap"
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "16/10", md: "16/9" },
          overflow: "hidden",
          "& .slick-slider, & .slick-list, & .slick-track": { height: "100%" },
          "& .slick-slide, & .slick-slide > div": { height: "100%" },
          "& img": { transition: "transform 700ms cubic-bezier(.2,.7,.2,1)" },
          "& .slick-dots": { bottom: 10 },
          "& .slick-dots li button:before": { color: "#fff", opacity: 0.55, fontSize: 8 },
          "& .slick-dots li.slick-active button:before": { color: "#caa6ff", opacity: 1 },
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
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            background:
              "linear-gradient(180deg, rgba(50,9,83,0) 0%, rgba(50,9,83,0.22) 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 2.6, md: 3.2 }, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            fontFamily: serif,
            fontWeight: 700,
            color: "#320953",
            fontSize: { xs: "1.35rem", md: "1.6rem" },
            lineHeight: 1.15,
            letterSpacing: "0.005em",
          }}
        >
          {room.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: cormorant,
            fontStyle: "italic",
            color: "#5f02ab",
            fontSize: { xs: "1rem", md: "1.12rem" },
            mt: 0.5,
            mb: 0.4,
          }}
        >
          {room.subtitle}
        </Typography>

        {metaChips}

        <Typography
          sx={{
            fontFamily: cormorant,
            color: "#3f2a2a",
            fontSize: { xs: "0.98rem", md: "1.04rem" },
            lineHeight: 1.7,
            flex: 1,
            mb: 1.6,
          }}
        >
          {room.description}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
            columnGap: 1.5,
            rowGap: 1,
            mb: 2.2,
          }}
        >
          {room.amenities.map((a, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#5b4a5e",
                "& svg": {
                  color: "#5f02ab",
                  fontSize: 18,
                  transition: "transform 240ms ease, color 240ms ease",
                },
                "&:hover svg": { color: "#320953", transform: "scale(1.12)" },
              }}
            >
              {a.icon}
              <Typography
                sx={{
                  fontFamily: cormorant,
                  color: "#3f2a2a",
                  fontSize: { xs: "0.94rem", md: "0.98rem" },
                  letterSpacing: "0.01em",
                }}
              >
                {a.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1.4, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => {
              window.location.href =
                "https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg=";
            }}
            sx={{
              position: "relative",
              overflow: "hidden",
              isolation: "isolate",
              background:
                "linear-gradient(135deg, #7d12cc 0%, #5f02ab 45%, #320953 100%)",
              backgroundSize: "200% 100%",
              color: "#fff",
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: { xs: "0.74rem", md: "0.78rem" },
              letterSpacing: "0.16em",
              px: 3.2,
              py: 1.05,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              animation: "buttonGlow 3.2s ease-in-out infinite",
              transition:
                "background-position 600ms ease, transform 280ms ease, box-shadow 280ms ease",
              "& .MuiButton-startIcon, & .MuiButton-endIcon": { position: "relative", zIndex: 1 },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "55%",
                height: "100%",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
                animation: "buttonShimmer 3.2s ease-in-out 0.4s infinite",
                pointerEvents: "none",
                mixBlendMode: "screen",
              },
              "&:hover": {
                background: "#76046b",
                backgroundPosition: "100% 0%",
                transform: "translateY(-1px) scale(1.02)",
                boxShadow:
                  "0 14px 30px rgba(95,2,171,0.55), 0 4px 10px rgba(95,2,171,0.35)",
              },
              "&:active": {
                transform: "translateY(0) scale(0.99)",
              },
            }}
          >
            Book Now
          </Button>
          <Button
            variant="outlined"
            onClick={() => setExpanded((v) => !v)}
            sx={{
              borderColor: "#5f02ab",
              color: "#5f02ab",
              fontFamily: cinzel,
              fontWeight: 500,
              fontSize: { xs: "0.74rem", md: "0.78rem" },
              letterSpacing: "0.16em",
              px: 2.4,
              py: 0.85,
              borderRadius: 0,
              transition: "all 280ms ease",
              "&:hover": {
                borderColor: "#320953",
                color: "#320953",
                bgcolor: "rgba(95,2,171,0.06)",
              },
            }}
          >
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2.4,
              pt: 2,
              borderTop: "1px dashed rgba(95,2,171,0.22)",
            }}
          >
            {room.policies.map((policy) => (
              <Typography
                key={policy}
                sx={{
                  fontFamily: cormorant,
                  color: "#3f2a2a",
                  fontSize: { xs: "0.95rem", md: "0.99rem" },
                  lineHeight: 1.7,
                  mb: 0.9,
                  pl: 1.6,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "0.55em",
                    width: 6,
                    height: 6,
                    bgcolor: "#5f02ab",
                    transform: "rotate(45deg)",
                  },
                }}
              >
                {policy}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

/* ════════════════════════════════════════════
   Page
   ════════════════════════════════════════════ */
const RoomsPage: NextPageWithSeo = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [sectionInView, setSectionInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSectionInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          html: { width: "100%" },
          body: { width: "100%", margin: 0, overflowX: "hidden" },
          main: { width: "100%", maxWidth: "100vw" },
          ".slick-slider,.slick-list,.slick-track": { width: "100%" },
        }}
      />

      <Box
        sx={{
          bgcolor: "#faf6ef",
          "@keyframes cormorantRise": {
            "0%": {
              opacity: 0,
              transform: "translateY(22px) scale(0.985)",
              filter: "blur(6px)",
            },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          },
          "@keyframes dividerGrow": {
            "0%": { transform: "scaleX(0)", opacity: 0 },
            "100%": { transform: "scaleX(1)", opacity: 1 },
          },
          "@keyframes diamondPop": {
            "0%": { transform: "rotate(0deg) scale(0)", opacity: 0 },
            "70%": { transform: "rotate(45deg) scale(1.3)", opacity: 1 },
            "100%": { transform: "rotate(45deg) scale(1)", opacity: 1 },
          },
          "@keyframes silkVeil": {
            "0%": { transform: "translate(-40%, -10%) rotate(-12deg)", opacity: 0 },
            "20%": { opacity: 0.55 },
            "80%": { opacity: 0.4 },
            "100%": { transform: "translate(140%, 18%) rotate(-12deg)", opacity: 0 },
          },
          "@keyframes silkVeilAlt": {
            "0%": { transform: "translate(140%, 8%) rotate(11deg)", opacity: 0 },
            "20%": { opacity: 0.5 },
            "80%": { opacity: 0.35 },
            "100%": { transform: "translate(-40%, -16%) rotate(11deg)", opacity: 0 },
          },
          "@keyframes stardustFall": {
            "0%": { transform: "translate(0, -40px) scale(0.4)", opacity: 0 },
            "10%": { transform: "translate(2px, 0) scale(1)", opacity: 0.9 },
            "55%": { transform: "translate(-4px, 90px) scale(1.05)", opacity: 0.95 },
            "90%": { opacity: 0.55 },
            "100%": { transform: "translate(2px, 220px) scale(0.85)", opacity: 0 },
          },
          "@keyframes stardustTwinkle": {
            "0%, 100%": { filter: "brightness(1) blur(0)" },
            "50%": { filter: "brightness(1.7) blur(0.4px)" },
          },
          "@keyframes buttonShimmer": {
            "0%":   { transform: "translateX(-130%) skewX(-22deg)" },
            "55%":  { transform: "translateX(160%) skewX(-22deg)" },
            "100%": { transform: "translateX(160%) skewX(-22deg)" },
          },
          "@keyframes buttonGlow": {
            "0%, 100%": { boxShadow: "0 8px 18px rgba(95,2,171,0.32), 0 2px 6px rgba(95,2,171,0.22)" },
            "50%":      { boxShadow: "0 12px 26px rgba(95,2,171,0.5), 0 3px 10px rgba(95,2,171,0.32)" },
          },
        }}
      >
        {/* ───────────── HERO ───────────── */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "82vh", sm: "88vh", md: "92vh" },
            overflow: "hidden",
            bgcolor: "#05070b",
          }}
        >
          {/* Background photo */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/images/rooms/masthead.jpg"
              alt="Hotel Poinisuk room ambience"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                filter: "brightness(0.82) contrast(1.10) saturate(1.02)",
              }}
            />
          </Box>

          {/* Night-tone gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,11,0.45) 0%, rgba(8,6,18,0.28) 35%, rgba(20,8,40,0.34) 70%, rgba(5,4,16,0.55) 100%)",
            }}
          />

          {/* Vignette */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.40) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ─────── Drifting silken light veils (Rooms signature) ─────── */}
          {[
            { dur: 26, delay: 0, alt: false, top: "12%",  height: "60%", width: { xs: "70%", md: "45%" } },
            { dur: 32, delay: 8, alt: true,  top: "30%",  height: "55%", width: { xs: "75%", md: "50%" } },
            { dur: 38, delay: 18,alt: false, top: "5%",   height: "70%", width: { xs: "80%", md: "40%" } },
          ].map((v, i) => (
            <Box
              key={`veil-${i}`}
              sx={{
                position: "absolute",
                top: v.top,
                left: 0,
                width: v.width,
                height: v.height,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(214,196,255,0.18) 35%, rgba(214,196,255,0.28) 50%, rgba(214,196,255,0.18) 65%, rgba(255,255,255,0) 100%)",
                filter: "blur(28px)",
                animation: `${v.alt ? "silkVeilAlt" : "silkVeil"} ${v.dur}s ease-in-out ${v.delay}s infinite`,
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* ─────── Falling stardust (gentle downward — opposite of Klong) ─────── */}
          {[
            { left: "6%",  size: 3, dur: 12, delay: 0,   tdur: 2.8, tdelay: 0,   warm: false },
            { left: "12%", size: 4, dur: 14, delay: 3.2, tdur: 3.2, tdelay: 0.6, warm: true  },
            { left: "18%", size: 3, dur: 11, delay: 1.6, tdur: 2.4, tdelay: 1.1, warm: false },
            { left: "26%", size: 5, dur: 15, delay: 5.0, tdur: 3.4, tdelay: 0.4, warm: false },
            { left: "34%", size: 3, dur: 13, delay: 2.4, tdur: 2.6, tdelay: 0.9, warm: true  },
            { left: "42%", size: 4, dur: 12, delay: 6.2, tdur: 3.0, tdelay: 1.3, warm: false },
            { left: "50%", size: 3, dur: 14, delay: 0.8, tdur: 2.8, tdelay: 0.3, warm: false },
            { left: "58%", size: 5, dur: 13, delay: 3.7, tdur: 3.6, tdelay: 1.0, warm: true  },
            { left: "66%", size: 3, dur: 12, delay: 1.2, tdur: 2.4, tdelay: 0.7, warm: false },
            { left: "74%", size: 4, dur: 15, delay: 4.6, tdur: 3.2, tdelay: 0.5, warm: false },
            { left: "82%", size: 3, dur: 11, delay: 2.0, tdur: 2.6, tdelay: 1.2, warm: true  },
            { left: "88%", size: 5, dur: 13, delay: 5.4, tdur: 3.0, tdelay: 0.6, warm: false },
            { left: "94%", size: 3, dur: 12, delay: 1.8, tdur: 2.8, tdelay: 1.1, warm: false },
          ].map((d, i) => {
            const core = d.warm ? "rgba(255,232,196,0.95)" : "rgba(220,200,255,0.92)";
            const glow = d.warm ? "rgba(255,210,160,0.7)" : "rgba(202,166,255,0.7)";
            return (
              <Box
                key={`dust-${i}`}
                sx={{
                  position: "absolute",
                  top: "8%",
                  left: d.left,
                  width: d.size,
                  height: d.size,
                  borderRadius: "50%",
                  bgcolor: core,
                  boxShadow: `0 0 ${d.size + 5}px ${glow}, 0 0 ${d.size * 2 + 10}px ${glow}`,
                  animation: `stardustFall ${d.dur}s linear ${d.delay}s infinite, stardustTwinkle ${d.tdur}s ease-in-out ${d.tdelay}s infinite`,
                  mixBlendMode: "screen",
                  willChange: "transform, opacity, filter",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* Hero content */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "82vh", sm: "88vh", md: "92vh" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: { xs: 2, sm: 3, md: 4 },
              zIndex: 2,
            }}
          >
            {/* Italic display title */}
            <Typography
              component="h1"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 500,
                color: "#fff",
                fontSize: {
                  xs: "2.8rem",
                  sm: "4rem",
                  md: "5.4rem",
                  lg: "6.4rem",
                  xl: "7rem",
                },
                lineHeight: 1,
                letterSpacing: "0.005em",
                textShadow:
                  "0 4px 30px rgba(50,9,83,0.55), 0 2px 6px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 350ms both",
              }}
            >
              Our Rooms &amp; Cabins
            </Typography>

            {/* Divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1.2, sm: 1.4, md: 1.6 },
                mt: { xs: 1.4, sm: 1.8, md: 2.4 },
                mb: { xs: 1.2, sm: 1.6, md: 2 },
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100, lg: 130 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)",
                  transformOrigin: "right center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 8, md: 10 },
                  height: { xs: 8, md: 10 },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "#caa6ff",
                    boxShadow: "0 0 14px rgba(202,166,255,0.85)",
                    animation:
                      "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1200ms both",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100, lg: 130 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
                  transformOrigin: "left center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
                }}
              />
            </Box>

            {/* Subtitle */}
            <Typography
              component="h2"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.45rem" },
                lineHeight: 1.4,
                letterSpacing: "0.02em",
                maxWidth: 720,
                textShadow: "0 2px 14px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1300ms both",
              }}
            >
              Comfort, convenience, and character — right in the heart of Shillong
            </Typography>
          </Box>
        </Box>

        {/* ───────────── ROOM CARDS ───────────── */}
        <Box
          ref={sectionRef}
          sx={{
            position: "relative",
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 3 },
            bgcolor: "#faf6ef",
            overflow: "hidden",
          }}
        >
          {/* Soft top ambient glow */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(202,166,255,0.18) 0%, rgba(202,166,255,0) 55%)",
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative" }}>
            {/* Decorative purely-visual divider accent (no text) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,
                mb: { xs: 4, md: 5 },
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 800ms ease, transform 800ms ease",
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 60, md: 90 },
                  background:
                    "linear-gradient(90deg, rgba(95,2,171,0) 0%, #5f02ab 100%)",
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#5f02ab",
                  transform: "rotate(45deg)",
                }}
              />
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 60, md: 90 },
                  background:
                    "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: { xs: 3, md: 4 },
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                alignItems: "stretch",
              }}
            >
              {rooms.map((room, i) => (
                <RoomCard room={room} key={room.key} index={i} />
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

RoomsPage.seo = {
  title: "Rooms & Suites",
  description:
    "Well-appointed rooms & suites at Hotel Poinisuk, Shillong. Premium AC, Deluxe AC, Deluxe Non-AC, and Executive rooms with flat-screen TV, Wi-Fi, tea/coffee maker, writing desk, and more. Book direct for best rates.",
  keywords:
    "hotel rooms Shillong, Shillong accommodation, hotel suites Shillong, premium rooms Shillong, deluxe rooms Shillong",
  ogImage: "/images/og/rooms.jpg",
  // Emit a HotelRoom schema for every room category so each one is a
  // first-class entity in Google's "Hotel rooms" carousel — same approach
  // used by Taj / Oberoi / ITC luxury properties.
  schema: ROOM_CATALOG.map((room) =>
    makeHotelRoomLd({
      slug: room.slug,
      name: room.title,
      description: room.description,
      images: room.images,
      bed: room.bed,
      occupancy: room.sleeps,
      floorSize: room.floorSize,
      amenityNames: room.amenities.map((key) => AMENITY_LABELS[key]),
    })
  ),
};

export default RoomsPage;
