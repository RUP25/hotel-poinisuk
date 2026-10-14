// components/karaoke/KaraokeEventCard.tsx
//
// Event card used for both "Upcoming Nights" and "Previous Events" on the
// karaoke page — layout and styling stay in sync.

import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import {
  EVENT_CATEGORY_LABELS,
  type EventRecord,
} from "@/types/events";
import { formatEventDate, formatTime } from "@/lib/event-display";

const BRAND_PURPLE = "#5f02ab";
const BRAND_LAVENDER = "#caa6ff";

export type KaraokeEventCardVariant = "on-dark" | "on-cream";

export interface KaraokeEventCardProps {
  ev: EventRecord;
  index: number;
  inView: boolean;
  variant: KaraokeEventCardVariant;
  cormorant: string;
  cinzel: string;
  montserrat: string;
}

const KaraokeEventCard: React.FC<KaraokeEventCardProps> = ({
  ev,
  index,
  inView,
  variant,
  cormorant,
  cinzel,
  montserrat,
}) => {
  const d = formatEventDate(ev.date);

  const surfaceSx =
    variant === "on-cream"
      ? {
          background:
            "linear-gradient(165deg, rgba(32,12,48,0.96) 0%, rgba(14,8,22,0.98) 55%, rgba(10,6,18,0.99) 100%)",
          border: ev.isHighlighted
            ? "1px solid rgba(202,166,255,0.55)"
            : "1px solid rgba(202,166,255,0.22)",
        }
      : {
          bgcolor: "rgba(250,246,239,0.04)",
          border: ev.isHighlighted
            ? "1px solid rgba(202,166,255,0.55)"
            : "1px solid rgba(202,166,255,0.18)",
        };

  return (
    <Box
      sx={{
        position: "relative",
        ...surfaceSx,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        overflow: "hidden",
        transition:
          "transform 360ms cubic-bezier(.2,.6,.2,1), box-shadow 360ms ease, border-color 240ms ease",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        animation: inView
          ? `cormorantRise 800ms cubic-bezier(.2,.7,.2,1) ${200 + index * 120}ms both`
          : "none",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(202,166,255,0.7)",
          boxShadow:
            "0 24px 38px rgba(50,9,83,0.45), 0 0 22px rgba(202,166,255,0.22)",
        },
      }}
    >
      {ev.imageUrl && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 160, sm: 180, md: 200 },
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(14,17,22,0.7) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            component="img"
            src={ev.imageUrl}
            alt={ev.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}

      {ev.isHighlighted && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.2,
            py: 0.4,
            bgcolor: BRAND_PURPLE,
            color: "#fff",
            fontFamily: cinzel,
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            border: "1px solid rgba(202,166,255,0.55)",
            zIndex: 2,
          }}
        >
          <StarOutlineRoundedIcon sx={{ fontSize: 14 }} />
          Featured
        </Box>
      )}

      <Box sx={{ p: { xs: 2.4, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.2,
            mb: 1.6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 56,
              px: 1.2,
              py: 0.8,
              border: "1px solid rgba(202,166,255,0.35)",
              bgcolor: "rgba(202,166,255,0.06)",
            }}
          >
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                color: BRAND_LAVENDER,
                textTransform: "uppercase",
              }}
            >
              {d.weekday}
            </Typography>
            <Typography
              sx={{
                fontFamily: cormorant,
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "#fff",
                lineHeight: 1,
                my: 0.2,
              }}
            >
              {d.day}
            </Typography>
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                color: "rgba(236,230,245,0.7)",
                textTransform: "uppercase",
              }}
            >
              {d.month}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={EVENT_CATEGORY_LABELS[ev.category] || "Event"}
            sx={{
              bgcolor: "rgba(95,2,171,0.22)",
              color: BRAND_LAVENDER,
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              border: "1px solid rgba(202,166,255,0.28)",
              borderRadius: 0.5,
              height: 22,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>

        <Typography
          component="h3"
          sx={{
            fontFamily: cormorant,
            fontWeight: 600,
            color: "#fff",
            fontSize: { xs: "1.25rem", md: "1.4rem" },
            lineHeight: 1.2,
            mb: 0.4,
          }}
        >
          {ev.title}
        </Typography>

        {ev.subtitle && (
          <Typography
            sx={{
              fontFamily: cormorant,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.78)",
              fontSize: { xs: "0.96rem", md: "1.02rem" },
              mb: 1.2,
            }}
          >
            {ev.subtitle}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.2,
            mb: 1.4,
            mt: ev.subtitle ? 0 : 1,
          }}
        >
          {ev.startTime && (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: BRAND_LAVENDER }} />
              <Typography
                sx={{
                  fontFamily: montserrat,
                  color: "rgba(255,255,255,0.86)",
                  fontSize: "0.84rem",
                  fontWeight: 500,
                }}
              >
                {formatTime(ev.startTime)}
                {ev.endTime ? ` – ${formatTime(ev.endTime)}` : " onwards"}
              </Typography>
            </Box>
          )}
          {ev.cover && (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
              <LocalActivityOutlinedIcon sx={{ fontSize: 16, color: BRAND_LAVENDER }} />
              <Typography
                sx={{
                  fontFamily: montserrat,
                  color: "rgba(255,255,255,0.86)",
                  fontSize: "0.84rem",
                  fontWeight: 500,
                }}
              >
                {ev.cover}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            fontFamily: cormorant,
            color: "rgba(255,255,255,0.78)",
            fontSize: { xs: "0.96rem", md: "1.02rem" },
            lineHeight: 1.65,
          }}
        >
          {ev.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default KaraokeEventCard;
