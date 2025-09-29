// components/MastheadSlider.tsx
import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

// Slick must be dynamically imported to avoid SSR hydration issues
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Import slick CSS once (covers any Slider usage on pages too)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ResponsiveNum =
  | number
  | string
  | {
      xs?: number | string;
      sm?: number | string;
      md?: number | string;
      lg?: number | string;
      xl?: number | string;
    };

interface MastheadSliderProps {
  images: string[]; // e.g. ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"]
  height?: ResponsiveNum; // default { xs: 200, md: 300 }
  overlayColor?: string;  // default "rgba(0,0,0,0.45)"
  animationDuration?: string; // default "14s"
  scale?: number; // default 1.12
  children?: React.ReactNode;
  align?: "start" | "center" | "end"; // default "center"
  contentPadding?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  autoplaySpeed?: number; // default 4500
  fade?: boolean; // default true
  dots?: boolean; // default true
  arrows?: boolean; // default false
  pauseOnHover?: boolean; // default false
}

const MastheadSlider: React.FC<MastheadSliderProps> = ({
  images,
  height = { xs: 200, md: 300 },
  overlayColor = "rgba(0,0,0,0.45)",
  animationDuration = "14s",
  scale = 1.12,
  children,
  align = "center",
  contentPadding = { xs: 2, md: 3 },
  autoplaySpeed = 4500,
  fade = true,
  dots = true,
  arrows = false,
  pauseOnHover = false,
}) => {
  const settings = {
    dots,
    arrows,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed,
    pauseOnHover,
    fade,
    adaptiveHeight: false,
  };

  // Vary pan direction by slide for more natural transitions
  const pans = [
    { name: "kenburns-a", toX: "-2%", toY: "-2%" }, // up-left
    { name: "kenburns-b", toX: "2%", toY: "-2%" },  // up-right
    { name: "kenburns-c", toX: "0%", toY: "2%" },   // down
  ];

  return (
    <Box sx={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      <Slider {...settings}>
        {images.map((src, idx) => {
          const pan = pans[idx % pans.length];
          return (
            <Box key={src} sx={{ position: "relative", width: "100%", height }}>
              {/* Background with Ken Burns */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transformOrigin: "center",
                  animation: `${pan.name} ${animationDuration} ease-in-out infinite alternate`,
                  willChange: "transform",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              />
              {/* Overlay for contrast */}
              <Box sx={{ position: "absolute", inset: 0, bgcolor: overlayColor }} />
              {/* Foreground content */}
              {children && (
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center",
                    px: contentPadding,
                    color: "#fff",
                    textAlign: align === "start" ? "left" : align === "end" ? "right" : "center",
                  }}
                >
                  <Box sx={{ width: "100%" }}>{children}</Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Slider>

      {/* Scoped keyframes for the three pan directions */}
      <style jsx>{`
        @keyframes kenburns-a {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(${scale}) translate(-2%, -2%); }
        }
        @keyframes kenburns-b {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(${scale}) translate(2%, -2%); }
        }
        @keyframes kenburns-c {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(${scale}) translate(0, 2%); }
        }
      `}</style>

      {/* Optional: adjust dots */}
      <style jsx global>{`
        .slick-dots {
          bottom: 12px;
        }
        .slick-dots li button:before {
          font-size: 10px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          opacity: 0.95;
        }
      `}</style>
    </Box>
  );
};

export default MastheadSlider;
