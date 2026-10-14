// pages/admin/index.tsx
//
// Hotel Poinisuk — Admin dashboard.
//
// Lists every event the backend knows about, with quick actions to:
//   - Add a new event (→ /admin/events/new)
//   - Edit an event (→ /admin/events/[id])
//   - Delete an event (with a confirmation step)
//   - Toggle / remove "Past highlights" without opening the full editor
//   - Open the public karaoke page in a new tab to verify the change
//
// The page is wrapped in <AdminGuard /> so unauthenticated visits get
// redirected straight to /admin/login. The Lambda is also the real
// gatekeeper — every protected request needs a valid JWT.

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AdminGuard from "@/components/AdminGuard";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";
import { logoutAdmin } from "@/lib/admin-auth";
import { deleteEvent, fetchPublicEvents, updateEvent, eventRecordToInput } from "@/lib/events";
import {
  EVENT_CATEGORY_LABELS,
  type EventRecord,
} from "@/types/events";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

const cinzel =
  "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
const cormorant =
  "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const montserrat =
  "var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif";

const BRAND_DEEP = "#320953";
const BRAND_PURPLE = "#5f02ab";
const BRAND_LAVENDER = "#caa6ff";

function isPast(iso: string): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return iso < today;
}

function formatDateLong(iso: string): string {
  try {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const AdminDashboardInner: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Delete confirmation modal state.
  const [pendingDelete, setPendingDelete] = useState<EventRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pastStrippingId, setPastStrippingId] = useState<string | null>(null);

  // Toasts.
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    const list = await fetchPublicEvents();
    setEvents(list);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = () => {
    logoutAdmin();
    router.replace("/admin/login");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await deleteEvent(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    setSnack({
      open: true,
      severity: result.ok ? "success" : "error",
      message: result.message,
    });
    if (result.ok) load(true);
  };

  const removePastHighlight = async (ev: EventRecord) => {
    setPastStrippingId(ev.id);
    const input = eventRecordToInput(ev);
    input.showInPastHighlights = false;
    const result = await updateEvent(ev.id, input);
    setPastStrippingId(null);
    setSnack({
      open: true,
      severity: result.ok ? "success" : "error",
      message: result.message,
    });
    if (result.ok) load(true);
  };

  // Sort: upcoming highlighted first, then upcoming, then past (descending).
  const sorted = [...events].sort((a, b) => {
    const aPast = isPast(a.date);
    const bPast = isPast(b.date);
    if (aPast !== bPast) return aPast ? 1 : -1;
    if (!aPast && a.isHighlighted !== b.isHighlighted) {
      return a.isHighlighted ? -1 : 1;
    }
    return aPast ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });

  const pastHighlightRows = sorted.filter((e) => e.showInPastHighlights);

  return (
    <Box
      sx={{
        minHeight: `calc(100dvh - ${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px)`,
        background:
          "radial-gradient(70% 90% at 50% 0%, rgba(95,2,171,0.18) 0%, rgba(50,9,83,0.06) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
        color: "#ece6f5",
        pb: { xs: 6, md: 8 },
      }}
    >
      {/* ───────── Top bar ───────── */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: ADMIN_GLOBAL_HEADER_HEIGHT_PX,
          zIndex: 10,
          bgcolor: "rgba(12,8,21,0.85)",
          backdropFilter: "saturate(140%) blur(10px)",
          WebkitBackdropFilter: "saturate(140%) blur(10px)",
          borderBottom: "1px solid rgba(202,166,255,0.16)",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1.4, md: 1.8 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: "0.66rem",
              letterSpacing: "0.32em",
              color: BRAND_LAVENDER,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Hotel Poinisuk · Admin
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: cormorant,
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#fff",
              mt: 0.4,
              lineHeight: 1.1,
            }}
          >
            Live Events Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Open public page">
            <IconButton
              component="a"
              href="/karaoke"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "rgba(236,230,245,0.85)",
                border: "1px solid rgba(202,166,255,0.22)",
                "&:hover": {
                  color: BRAND_LAVENDER,
                  borderColor: BRAND_LAVENDER,
                  bgcolor: "rgba(202,166,255,0.08)",
                },
              }}
            >
              <OpenInNewRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => load(true)}
                disabled={refreshing || loading}
                sx={{
                  color: "rgba(236,230,245,0.85)",
                  border: "1px solid rgba(202,166,255,0.22)",
                  "&:hover": {
                    color: BRAND_LAVENDER,
                    borderColor: BRAND_LAVENDER,
                    bgcolor: "rgba(202,166,255,0.08)",
                  },
                }}
              >
                {refreshing ? (
                  <CircularProgress size={16} sx={{ color: BRAND_LAVENDER }} />
                ) : (
                  <RefreshRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: "rgba(236,230,245,0.85)",
              borderColor: "rgba(202,166,255,0.22)",
              border: "1px solid",
              fontFamily: cinzel,
              fontWeight: 600,
              letterSpacing: "0.22em",
              fontSize: "0.7rem",
              px: 1.6,
              py: 0.7,
              borderRadius: 1,
              textTransform: "uppercase",
              "&:hover": {
                borderColor: BRAND_LAVENDER,
                color: BRAND_LAVENDER,
                bgcolor: "rgba(202,166,255,0.08)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* ───────── Main ───────── */}
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, md: 5 },
        }}
      >
        {/* Action bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.6,
            mb: { xs: 3, md: 4 },
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: cormorant,
                fontWeight: 700,
                fontSize: { xs: "1.4rem", md: "1.7rem" },
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              All events
            </Typography>
            <Typography
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                color: "rgba(236,230,245,0.7)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                mt: 0.4,
              }}
            >
              {loading
                ? "Loading…"
                : `${sorted.length} event${sorted.length === 1 ? "" : "s"} on file`}
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/admin/events/new"
            variant="contained"
            startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: 20 }} />}
            sx={{
              bgcolor: BRAND_PURPLE,
              color: "#fff",
              fontFamily: cinzel,
              fontWeight: 700,
              letterSpacing: "0.22em",
              fontSize: { xs: "0.74rem", md: "0.8rem" },
              textTransform: "uppercase",
              px: { xs: 2.6, md: 3.2 },
              py: { xs: 1.1, md: 1.25 },
              borderRadius: 1.1,
              boxShadow: "0 8px 22px rgba(95,2,171,0.4)",
              "&:hover": {
                bgcolor: "#76046b",
                boxShadow: "0 12px 28px rgba(95,2,171,0.5)",
              },
            }}
          >
            New Event
          </Button>
        </Box>

        {/* Past highlights (quick manage) */}
        {!loading && pastHighlightRows.length > 0 && (
          <Box
            sx={{
              mb: { xs: 3, md: 4 },
              p: { xs: 2, md: 2.4 },
              borderRadius: 1.4,
              border: "1px solid rgba(202,166,255,0.22)",
              bgcolor: "rgba(95,2,171,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.2,
              }}
            >
              <HistoryRoundedIcon sx={{ color: BRAND_LAVENDER, fontSize: 22 }} />
              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  color: "#fff",
                }}
              >
                Past highlights
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: cormorant,
                color: "rgba(236,230,245,0.72)",
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                lineHeight: 1.55,
                mb: 1.8,
              }}
            >
              These events are flagged for the archive strip on the public karaoke page (after their
              date has passed). Remove them here anytime without deleting the record.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {pastHighlightRows.map((ev) => {
                const waiting = !isPast(ev.date);
                return (
                  <Box
                    key={`ph-${ev.id}`}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1.2,
                      py: 1,
                      px: 1.2,
                      borderRadius: 1,
                      bgcolor: "rgba(12,8,21,0.35)",
                      border: "1px solid rgba(202,166,255,0.12)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: cormorant,
                        fontWeight: 600,
                        color: "#fff",
                        flex: "1 1 180px",
                        minWidth: 0,
                      }}
                    >
                      {ev.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: montserrat,
                        fontSize: "0.82rem",
                        color: "rgba(236,230,245,0.65)",
                      }}
                    >
                      {formatDateLong(ev.date)}
                    </Typography>
                    {waiting && (
                      <Chip
                        size="small"
                        label="Upcoming date"
                        sx={{
                          bgcolor: "rgba(255,213,106,0.12)",
                          color: "#ffd56a",
                          fontFamily: cinzel,
                          fontSize: "0.58rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          height: 22,
                          border: "1px solid rgba(255,213,106,0.25)",
                        }}
                      />
                    )}
                    <Box sx={{ display: "flex", gap: 0.8, ml: { xs: 0, sm: "auto" } }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/admin/events/edit?id=${encodeURIComponent(ev.id)}`}
                        sx={{
                          color: BRAND_LAVENDER,
                          borderColor: "rgba(202,166,255,0.35)",
                          fontFamily: cinzel,
                          fontSize: "0.62rem",
                          letterSpacing: "0.14em",
                          py: 0.5,
                          minWidth: 0,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={pastStrippingId === ev.id}
                        onClick={() => removePastHighlight(ev)}
                        sx={{
                          bgcolor: "rgba(236,230,245,0.12)",
                          color: "#ece6f5",
                          fontFamily: cinzel,
                          fontSize: "0.62rem",
                          letterSpacing: "0.14em",
                          py: 0.5,
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "rgba(236,230,245,0.2)",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {pastStrippingId === ev.id ? "Removing…" : "Remove from archive"}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Body */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress size={36} thickness={3} sx={{ color: BRAND_LAVENDER }} />
          </Box>
        ) : sorted.length === 0 ? (
          <Box
            sx={{
              border: "1px solid rgba(202,166,255,0.18)",
              borderRadius: 1.4,
              bgcolor: "rgba(202,166,255,0.04)",
              textAlign: "center",
              py: { xs: 6, md: 8 },
              px: 3,
            }}
          >
            <CalendarMonthOutlinedIcon
              sx={{ fontSize: 44, color: BRAND_LAVENDER, mb: 1.4 }}
            />
            <Typography
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                color: "#fff",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                mb: 0.6,
              }}
            >
              No events yet.
            </Typography>
            <Typography
              sx={{
                fontFamily: cormorant,
                color: "rgba(236,230,245,0.7)",
                fontSize: { xs: "0.96rem", md: "1.06rem" },
                lineHeight: 1.6,
                mb: 2.4,
              }}
            >
              Add your first karaoke or live music night — it'll appear on the
              public karaoke page within seconds.
            </Typography>
            <Button
              component={Link}
              href="/admin/events/new"
              variant="contained"
              startIcon={<AddCircleOutlineRoundedIcon />}
              sx={{
                bgcolor: BRAND_PURPLE,
                color: "#fff",
                fontFamily: cinzel,
                fontWeight: 700,
                letterSpacing: "0.22em",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                px: 3,
                py: 1.2,
                borderRadius: 1.1,
                "&:hover": { bgcolor: "#76046b" },
              }}
            >
              Create First Event
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid rgba(202,166,255,0.16)",
              borderRadius: 1.4,
              overflow: "hidden",
              bgcolor: "rgba(20,12,38,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {sorted.map((ev, idx) => {
              const past = isPast(ev.date);
              return (
                <Box
                  key={ev.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "auto 1fr auto",
                    },
                    alignItems: { md: "center" },
                    gap: { xs: 1.2, md: 2.4 },
                    px: { xs: 2, md: 2.6 },
                    py: { xs: 2, md: 2 },
                    borderTop:
                      idx === 0 ? "none" : "1px solid rgba(202,166,255,0.10)",
                    transition: "background-color 220ms ease",
                    opacity: past ? 0.65 : 1,
                    "&:hover": {
                      bgcolor: "rgba(202,166,255,0.05)",
                    },
                  }}
                >
                  {/* Date pill */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 60,
                        px: 1.2,
                        py: 0.6,
                        border: past
                          ? "1px solid rgba(236,230,245,0.18)"
                          : "1px solid rgba(202,166,255,0.4)",
                        bgcolor: past
                          ? "rgba(236,230,245,0.05)"
                          : "rgba(202,166,255,0.08)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: cinzel,
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          letterSpacing: "0.22em",
                          color: past ? "rgba(236,230,245,0.6)" : BRAND_LAVENDER,
                          textTransform: "uppercase",
                        }}
                      >
                        {new Date(`${ev.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          { weekday: "short" }
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: cormorant,
                          fontWeight: 700,
                          fontSize: "1.4rem",
                          color: "#fff",
                          lineHeight: 1,
                          my: 0.2,
                        }}
                      >
                        {String(
                          new Date(`${ev.date}T00:00:00`).getDate()
                        ).padStart(2, "0")}
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
                        {new Date(`${ev.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          { month: "short" }
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title + meta */}
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 0.8,
                        mb: 0.4,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: cormorant,
                          fontWeight: 600,
                          color: "#fff",
                          fontSize: { xs: "1.1rem", md: "1.2rem" },
                          lineHeight: 1.2,
                        }}
                      >
                        {ev.title}
                      </Typography>
                      {ev.isHighlighted && (
                        <Tooltip title="Featured on the karaoke page">
                          <StarRoundedIcon
                            sx={{ fontSize: 18, color: "#ffd56a" }}
                          />
                        </Tooltip>
                      )}
                      {past && (
                        <Chip
                          size="small"
                          label="Past"
                          sx={{
                            bgcolor: "rgba(236,230,245,0.12)",
                            color: "rgba(236,230,245,0.78)",
                            fontFamily: cinzel,
                            fontSize: "0.58rem",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            height: 18,
                            border: "1px solid rgba(236,230,245,0.18)",
                            "& .MuiChip-label": { px: 0.8 },
                          }}
                        />
                      )}
                      {ev.showInPastHighlights && (
                        <Tooltip title="Shows on the karaoke page Past highlights after this date">
                          <span>
                            <Chip
                              size="small"
                              label="Archive strip"
                              sx={{
                                bgcolor: "rgba(202,166,255,0.12)",
                                color: BRAND_LAVENDER,
                                fontFamily: cinzel,
                                fontSize: "0.58rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                height: 18,
                                border: "1px solid rgba(202,166,255,0.28)",
                                "& .MuiChip-label": { px: 0.8 },
                              }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    </Box>

                    {ev.subtitle && (
                      <Typography
                        sx={{
                          fontFamily: cormorant,
                          fontStyle: "italic",
                          color: "rgba(236,230,245,0.78)",
                          fontSize: "0.96rem",
                          mb: 0.4,
                        }}
                      >
                        {ev.subtitle}
                      </Typography>
                    )}

                    <Typography
                      sx={{
                        fontFamily: montserrat,
                        color: "rgba(236,230,245,0.7)",
                        fontSize: "0.84rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {formatDateLong(ev.date)} · {ev.startTime}
                      {ev.endTime ? ` – ${ev.endTime}` : ""} ·{" "}
                      {EVENT_CATEGORY_LABELS[ev.category] || ev.category}
                      {ev.cover ? ` · ${ev.cover}` : ""}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.8,
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        href={`/admin/events/edit?id=${encodeURIComponent(ev.id)}`}
                        size="small"
                        sx={{
                          color: BRAND_LAVENDER,
                          border: "1px solid rgba(202,166,255,0.28)",
                          "&:hover": {
                            bgcolor: "rgba(202,166,255,0.08)",
                            borderColor: BRAND_LAVENDER,
                          },
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => setPendingDelete(ev)}
                        sx={{
                          color: "#ff8b8b",
                          border: "1px solid rgba(255,139,139,0.3)",
                          "&:hover": {
                            bgcolor: "rgba(255,139,139,0.08)",
                            borderColor: "#ff8b8b",
                          },
                        }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => (deleting ? null : setPendingDelete(null))}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#140c26",
              color: "#ece6f5",
              border: "1px solid rgba(202,166,255,0.22)",
              borderRadius: 1.4,
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: cormorant,
            fontWeight: 700,
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          Delete this event?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: cormorant,
              color: "rgba(236,230,245,0.78)",
              fontSize: "1.02rem",
              lineHeight: 1.6,
            }}
          >
            <Box component="strong" sx={{ color: "#fff" }}>
              {pendingDelete?.title}
            </Box>{" "}
            on {pendingDelete && formatDateLong(pendingDelete.date)} will be
            removed from the karaoke page immediately. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.4 }}>
          <Button
            onClick={() => setPendingDelete(null)}
            disabled={deleting}
            sx={{
              color: "rgba(236,230,245,0.85)",
              fontFamily: cinzel,
              fontWeight: 600,
              letterSpacing: "0.2em",
              fontSize: "0.74rem",
              textTransform: "uppercase",
              "&:hover": { bgcolor: "rgba(236,230,245,0.06)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            variant="contained"
            startIcon={
              deleting ? (
                <CircularProgress size={14} sx={{ color: "inherit" }} />
              ) : (
                <DeleteOutlineRoundedIcon fontSize="small" />
              )
            }
            sx={{
              bgcolor: "#b13838",
              "&:hover": { bgcolor: "#8c2727" },
              fontFamily: cinzel,
              fontWeight: 700,
              letterSpacing: "0.2em",
              fontSize: "0.74rem",
              textTransform: "uppercase",
              px: 2.4,
            }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%", fontFamily: montserrat }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const AdminDashboardPage: NextPageWithSeo = () => (
  <AdminGuard>
    <AdminDashboardInner />
  </AdminGuard>
);

AdminDashboardPage.seo = {
  title: "Admin · Dashboard",
  noindex: true,
};

export default AdminDashboardPage;
