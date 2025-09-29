// components/Masthead.tsx
import React from "react";
import { Box } from "@mui/material";

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

interface MastheadProps {
  image: string;
  /** Responsive heights (default { xs: 200, md: 300 }) */
  height?: ResponsiveNum;
  /** Overlay color over the image (default rgba(0,0,0,0.5)) */
  overlayColor?: string;
  /** CSS duration for the Ken Burns animation (default "20s") */
  animationDuration?: string;
  /** Max scale reached at the end of the animation (default 1.12) */
  scale?: number;
  /** Optional content on top of the masthead (centered) */
  children?: React.ReactNode;
  /** Override content alignment (default center) */
  align?: "start" | "center" | "end";
  /** Optional padding inside content box */
  contentPadding?: {
    xs?: number; sm?: number; md?: number; lg?: number; xl?: number;
  };
}

const Masthead: React.FC<MastheadProps> = ({
  image,
  height = { xs: 200, md: 300 },
  overlayColor = "rgba(0,0,0,0.5)",
  animationDuration = "20s",
  scale = 1.12,
  children,
  align = "center",
  contentPadding = { xs: 2, md: 3 },
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
      }}
    >
      {/* Animated background layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transformOrigin: "center",
          animation: `kenburns ${animationDuration} ease-in-out infinite alternate`,
          willChange: "transform",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
      {/* Dark overlay for contrast */}
      <Box sx={{ position: "absolute", inset: 0, bgcolor: overlayColor }} />

      {/* Content layer */}
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

      {/* Ken Burns keyframes (scoped) */}
      <style jsx>{`
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(${scale}) translate(-2%, -2%);
          }
        }
      `}</style>
    </Box>
  );
};

export default Masthead;
