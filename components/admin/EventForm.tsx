// components/admin/EventForm.tsx
//
// Shared form component used by both /admin/events/new and
// /admin/events/[id]. Mobile-first so the hotel owner can post a new
// event from a phone in under a minute.
//
// Fields:
//   - Title (required)            • Subtitle (optional)
//   - Date (required, YYYY-MM-DD) • Start time (required, HH:mm)
//   - End time (optional)         • Category (required)
//   - Cover charge (optional)     • Featured toggle
//   - Past highlights toggle      (shows on karaoke after date passes)
//   - Description (required, ~3 paragraphs)
//   - Image (optional, uploaded to S3 via presigned URL)
//
// All field-level styling matches the dashboard's dark brand surface so the
// form feels like part of the same product, not a tacked-on admin page.

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid, parseISO } from "date-fns";
import {
  EVENT_CATEGORY_LABELS,
  validateEventInput,
  type EventCategory,
  type EventInput,
  type EventRecord,
} from "@/types/events";
import {
  createEvent,
  updateEvent,
  uploadEventImage,
} from "@/lib/events";

const cinzel =
  "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
const cormorant =
  "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const montserrat =
  "var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif";

const BRAND_DEEP = "#320953";
const BRAND_PURPLE = "#5f02ab";
const BRAND_LAVENDER = "#caa6ff";

const CATEGORIES: EventCategory[] = [
  "karaoke",
  "live-music",
  "dj-night",
  "festival",
  "private-event",
  "other",
];

interface EventFormProps {
  /** Pass an existing record to put the form in edit mode. */
  initial?: EventRecord;
  /** Page title shown at the top of the form. */
  title: string;
  /** Subtitle shown beneath the page title. */
  subtitle: string;
}

const EventForm: React.FC<EventFormProps> = ({ initial, title, subtitle }) => {
  const router = useRouter();
  const isEdit = Boolean(initial);

  // Form state — initialised from `initial` when editing.
  const [form, setForm] = useState<EventInput>(() => ({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    date: initial?.date ?? "",
    startTime: initial?.startTime ?? "20:00",
    endTime: initial?.endTime ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    category: initial?.category ?? "karaoke",
    isHighlighted: initial?.isHighlighted ?? false,
    showInPastHighlights: initial?.showInPastHighlights ?? false,
    cover: initial?.cover ?? "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Keep the form in sync if the initial record loads asynchronously
  // (the edit page fetches the record and re-renders this component).
  useEffect(() => {
    if (!initial) return;
    setForm({
      title: initial.title,
      subtitle: initial.subtitle ?? "",
      date: initial.date,
      startTime: initial.startTime,
      endTime: initial.endTime ?? "",
      description: initial.description,
      imageUrl: initial.imageUrl ?? "",
      category: initial.category,
      isHighlighted: initial.isHighlighted ?? false,
      showInPastHighlights: initial.showInPastHighlights ?? false,
      cover: initial.cover ?? "",
    });
  }, [initial]);

  const update = <K extends keyof EventInput>(key: K, value: EventInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadEventImage(file);
    setUploading(false);
    if (url) {
      update("imageUrl", url);
      setSnack({
        open: true,
        severity: "success",
        message: "Image uploaded.",
      });
    } else {
      setSnack({
        open: true,
        severity: "error",
        message:
          "Image upload failed. Check your connection and that the AWS bucket is configured.",
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validateEventInput(form);
    if (validationError) {
      setSnack({ open: true, severity: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    const result = isEdit
      ? await updateEvent(initial!.id, form)
      : await createEvent(form);
    setSubmitting(false);

    setSnack({
      open: true,
      severity: result.ok ? "success" : "error",
      message: result.message,
    });

    if (result.ok) {
      setTimeout(() => router.push("/admin"), 600);
    }
  };

  // Shared field styling — dark brand surface.
  const fieldSx = {
    "& .MuiInputBase-root": {
      fontFamily: montserrat,
      color: "#fff",
      bgcolor: "rgba(202,166,255,0.04)",
    },
    "& .MuiInputLabel-root": {
      fontFamily: montserrat,
      color: "rgba(236,230,245,0.72)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: BRAND_LAVENDER },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(202,166,255,0.28)",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(202,166,255,0.55)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor: BRAND_LAVENDER,
        borderWidth: 1.5,
      },
    "& .MuiSvgIcon-root": { color: "rgba(236,230,245,0.65)" },
  } as const;

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
      {/* Top bar */}
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
          py: { xs: 1.4, md: 1.6 },
          display: "flex",
          alignItems: "center",
          gap: 1.4,
        }}
      >
        <IconButton
          component={Link}
          href="/admin"
          aria-label="Back to dashboard"
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
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography
            sx={{
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: "0.62rem",
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
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              color: "#fff",
              mt: 0.4,
              lineHeight: 1.1,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 880,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, md: 4 },
        }}
      >
        <Typography
          sx={{
            fontFamily: cormorant,
            fontStyle: "italic",
            color: "rgba(236,230,245,0.78)",
            fontSize: { xs: "1rem", md: "1.08rem" },
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            bgcolor: "rgba(20,12,38,0.55)",
            border: "1px solid rgba(202,166,255,0.18)",
            borderRadius: 1.4,
            p: { xs: 2.2, sm: 3, md: 3.4 },
          }}
        >
          {/* Title */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              required
              label="Event title"
              placeholder="e.g. Saturday Night Karaoke"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              disabled={submitting}
              sx={fieldSx}
            />
          </Box>

          {/* Subtitle */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              label="Subtitle (optional)"
              placeholder="e.g. feat. DJ Khasi Beats"
              value={form.subtitle ?? ""}
              onChange={(e) => update("subtitle", e.target.value)}
              disabled={submitting}
              sx={fieldSx}
            />
          </Box>

          {/* Date — calendar popover + explicit picker button */}
          <DatePicker
            label="Date"
            value={
              form.date
                ? (() => {
                    const parsed = parseISO(form.date);
                    return isValid(parsed) ? parsed : null;
                  })()
                : null
            }
            onChange={(d) =>
              update(
                "date",
                d != null && isValid(d) ? format(d, "yyyy-MM-dd") : ""
              )
            }
            disabled={submitting}
            format="dd/MM/yyyy"
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                sx: fieldSx,
                slotProps: { inputLabel: { shrink: true } },
              },
              openPickerButton: {
                "aria-label": "Open calendar and choose date",
                sx: {
                  color: BRAND_LAVENDER,
                  border: "1px solid rgba(202,166,255,0.42)",
                  borderRadius: 1,
                  mr: 0.25,
                  "&:hover": {
                    bgcolor: "rgba(202,166,255,0.12)",
                    borderColor: BRAND_LAVENDER,
                  },
                },
              },
            }}
          />

          {/* Category */}
          <TextField
            fullWidth
            select
            required
            label="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value as EventCategory)}
            disabled={submitting}
            sx={fieldSx}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontFamily: montserrat }}>
                {EVENT_CATEGORY_LABELS[c]}
              </MenuItem>
            ))}
          </TextField>

          {/* Times */}
          <TextField
            fullWidth
            required
            type="time"
            label="Start time"
            value={form.startTime}
            onChange={(e) => update("startTime", e.target.value)}
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            type="time"
            label="End time (optional)"
            value={form.endTime ?? ""}
            onChange={(e) => update("endTime", e.target.value)}
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />

          {/* Cover charge */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              label="Cover / entry (optional)"
              placeholder='e.g. "Free entry" or "₹500 cover"'
              value={form.cover ?? ""}
              onChange={(e) => update("cover", e.target.value)}
              disabled={submitting}
              sx={fieldSx}
            />
          </Box>

          {/* Description */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              required
              label="Description"
              placeholder="A short pitch — line-up, vibe, what to expect."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              disabled={submitting}
              multiline
              minRows={4}
              sx={fieldSx}
            />
          </Box>

          {/* Image upload */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography
              sx={{
                fontFamily: cinzel,
                fontWeight: 600,
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                color: BRAND_LAVENDER,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Event image (optional)
            </Typography>
            {form.imageUrl ? (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 480,
                  aspectRatio: "16 / 9",
                  border: "1px solid rgba(202,166,255,0.28)",
                  bgcolor: "rgba(202,166,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={form.imageUrl}
                  alt="Event preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => update("imageUrl", "")}
                  disabled={submitting}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                component="label"
                variant="outlined"
                disabled={submitting || uploading}
                startIcon={
                  uploading ? (
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                  ) : (
                    <ImageOutlinedIcon />
                  )
                }
                sx={{
                  color: BRAND_LAVENDER,
                  borderColor: "rgba(202,166,255,0.4)",
                  fontFamily: cinzel,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  fontSize: "0.74rem",
                  textTransform: "uppercase",
                  px: 2.4,
                  py: 1.1,
                  borderRadius: 1.1,
                  borderWidth: 1.5,
                  borderStyle: "dashed",
                  "&:hover": {
                    borderColor: BRAND_LAVENDER,
                    bgcolor: "rgba(202,166,255,0.06)",
                  },
                }}
              >
                {uploading ? "Uploading…" : "Upload Image"}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFile}
                />
              </Button>
            )}
            <Typography
              sx={{
                fontFamily: montserrat,
                color: "rgba(236,230,245,0.55)",
                fontSize: "0.78rem",
                mt: 1,
              }}
            >
              JPG / PNG / WEBP up to ~5 MB. Square or landscape works best.
            </Typography>
          </Box>

          {/* Featured */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(form.isHighlighted)}
                  onChange={(e) => update("isHighlighted", e.target.checked)}
                  disabled={submitting}
                  icon={<StarRoundedIcon sx={{ color: "rgba(236,230,245,0.5)" }} />}
                  checkedIcon={<StarRoundedIcon sx={{ color: "#ffd56a" }} />}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: montserrat,
                    color: "rgba(236,230,245,0.92)",
                    fontSize: "0.95rem",
                  }}
                >
                  Feature this event{" "}
                  <Box
                    component="span"
                    sx={{
                      fontFamily: cormorant,
                      fontStyle: "italic",
                      color: "rgba(236,230,245,0.68)",
                      ml: 0.5,
                    }}
                  >
                    (it'll float to the top of the karaoke page)
                  </Box>
                </Typography>
              }
            />
          </Box>

          {/* Past highlights */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(form.showInPastHighlights)}
                  onChange={(e) => update("showInPastHighlights", e.target.checked)}
                  disabled={submitting}
                  icon={<HistoryRoundedIcon sx={{ color: "rgba(236,230,245,0.5)" }} />}
                  checkedIcon={<HistoryRoundedIcon sx={{ color: BRAND_LAVENDER }} />}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: montserrat,
                    color: "rgba(236,230,245,0.92)",
                    fontSize: "0.95rem",
                  }}
                >
                  Show in Past highlights{" "}
                  <Box
                    component="span"
                    sx={{
                      fontFamily: cormorant,
                      fontStyle: "italic",
                      color: "rgba(236,230,245,0.68)",
                      ml: 0.5,
                    }}
                  >
                    (karaoke page archive — only after the event date has passed)
                  </Box>
                </Typography>
              }
            />
          </Box>
        </Box>
        </LocalizationProvider>

        {/* Actions */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.4,
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            href="/admin"
            disabled={submitting}
            sx={{
              color: "rgba(236,230,245,0.85)",
              border: "1px solid rgba(202,166,255,0.22)",
              fontFamily: cinzel,
              fontWeight: 600,
              letterSpacing: "0.2em",
              fontSize: "0.78rem",
              px: 2.4,
              py: 1.1,
              borderRadius: 1.1,
              textTransform: "uppercase",
              "&:hover": {
                borderColor: BRAND_LAVENDER,
                color: BRAND_LAVENDER,
                bgcolor: "rgba(202,166,255,0.06)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || uploading}
            startIcon={
              submitting ? (
                <CircularProgress size={16} sx={{ color: "inherit" }} />
              ) : (
                <SaveOutlinedIcon />
              )
            }
            sx={{
              bgcolor: BRAND_PURPLE,
              "&:hover": { bgcolor: "#76046b" },
              "&.Mui-disabled": {
                bgcolor: "rgba(95,2,171,0.5)",
                color: "#fff",
              },
              fontFamily: cinzel,
              fontWeight: 700,
              letterSpacing: "0.22em",
              fontSize: "0.8rem",
              px: 3,
              py: 1.2,
              borderRadius: 1.1,
              textTransform: "uppercase",
              boxShadow: "0 8px 22px rgba(95,2,171,0.4)",
            }}
          >
            {submitting
              ? "Saving…"
              : isEdit
              ? "Update Event"
              : "Publish Event"}
          </Button>
        </Box>
      </Box>

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

export default EventForm;
