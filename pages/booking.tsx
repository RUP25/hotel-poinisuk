// pages/booking.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EventIcon from "@mui/icons-material/Event";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";
// 🔽 Import your site chrome
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

const PurpleButton = styled(Button)({
  backgroundColor: "#5f02ab",
  borderRadius: 8,
  fontWeight: 700,
  "&:hover": { backgroundColor: "#320953" },
});

const roomTypes = [
  { value: "Executive", label: "Executive Room — 215 sq.ft." },
  { value: "Deluxe",    label: "Deluxe Room — 269 sq.ft." },
  { value: "Premium",   label: "Premium Room — 474 sq.ft." },
];

const BookingPage: React.FC = () => {
  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [message,   setMessage]   = useState("");

  const [roomType,  setRoomType]  = useState<string>("");

  const [checkIn,   setCheckIn]   = useState<Date | null>(null);
  const [checkOut,  setCheckOut]  = useState<Date | null>(null);

  // numeric sentinels to keep Select typed as number
  const [guests,    setGuests]    = useState<number>(-1);
  const [children,  setChildren]  = useState<number>(-1);

  const [attempted, setAttempted] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; kind: "success" | "error"; msg: string }>({
    open: false, kind: "success", msg: "",
  });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // keep checkout >= checkin + 1
  useEffect(() => {
    if (checkIn && (!checkOut || checkOut <= checkIn)) {
      const next = new Date(checkIn);
      next.setDate(next.getDate() + 1);
      setCheckOut(next);
    }
  }, [checkIn, checkOut]);

  // avoid popper clipping
  const containerEl = useMemo(
    () => (typeof document !== "undefined" ? document.body : undefined),
    []
  );

  // errors (booleans only)
  const checkInError   = Boolean(attempted && !checkIn);
  const checkOutError  = Boolean(attempted && (!checkOut || (checkIn && checkOut && checkOut <= checkIn)));
  const guestsError    = Boolean(attempted && guests   === -1);
  const childrenError  = Boolean(attempted && children === -1);
  const roomTypeError  = Boolean(attempted && roomType.trim() === "");
  const reqTextErr = (v: string) => Boolean(attempted && v.trim() === "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);

    const valid =
      firstName.trim() && lastName.trim() && email.trim() && phone.trim() &&
      roomType.trim() && checkIn && checkOut && checkOut > checkIn &&
      guests !== -1 && children !== -1;

    if (!valid) {
      setSnack({ open: true, kind: "error", msg: "Please fill all required fields." });
      return;
    }

    try {
      const res = await fetch("/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, message,
          roomType,
          checkIn: checkIn?.toISOString(),
          checkOut: checkOut?.toISOString(),
          guests, children,
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      setSnack({ open: true, kind: "success", msg: "Your request was sent. We’ll contact you shortly!" });
      setAttempted(false);
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setMessage("");
      setRoomType("");
      setGuests(-1); setChildren(-1);
    } catch (err: any) {
      setSnack({ open: true, kind: "error", msg: err?.message || "Sending failed. Try again." });
    }
  };

  return (
    <>
      <Head>
        <title>Booking | Hotel Poinisuk</title>
        <meta name="description" content="Book your stay at Hotel Poinisuk — share your details and dates and our team will confirm shortly." />
      </Head>

      {/* Site chrome */}
      <Masthead
        image="/images/image6.webp"
        height={{ xs: 220, md: 380 }}
        overlayColor="rgba(0,0,0,0.45)"
        animationDuration="22s"
        scale={1.12}
      >
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              fontSize: { xs: "1.6rem", sm: "clamp(1.6rem, 4.5vw, 2.6rem)" },
            }}
          >
            Booking
          </Typography>
        </Container>
      </Masthead>

      <main id="booking">
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              lineHeight: 1.15,
              fontFamily: "'Montserrat', sans-serif",
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Book Your Stay at Hotel Poinisuk
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "text.secondary", textAlign: "center", mb: 5 }}>
            Fill in your details and we’ll get back with availability &amp; best rates.
          </Typography>

          {/* No MUI Grid — native CSS Grid via Box */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mx: "auto",
              p: { xs: 2.5, md: 4 },
              maxWidth: 900,
              borderRadius: 2,
              boxShadow: 4,
              bgcolor: "background.paper",
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              "& .full": { gridColumn: { xs: "1", md: "1 / span 2" } },
            }}
          >
            {/* Name */}
            <TextField
              label="First Name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={reqTextErr(firstName)}
              helperText={reqTextErr(firstName) ? "Required" : undefined}
              slotProps={{ htmlInput: { "aria-label": "First Name" } }}
            />
            <TextField
              label="Last Name *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={reqTextErr(lastName)}
              helperText={reqTextErr(lastName) ? "Required" : undefined}
              slotProps={{ htmlInput: { "aria-label": "Last Name" } }}
            />

            {/* Contact */}
            <TextField
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={reqTextErr(email)}
              helperText={reqTextErr(email) ? "Required" : undefined}
              slotProps={{ htmlInput: { "aria-label": "Email" } }}
            />
            <TextField
              label="Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={reqTextErr(phone)}
              helperText={reqTextErr(phone) ? "Required" : undefined}
              slotProps={{ htmlInput: { "aria-label": "Phone" } }}
            />

            {/* Room Type (label overlap fix: shrink) */}
            <FormControl className="full" error={roomTypeError}>
              <InputLabel id="room-type-label" shrink>Room Type *</InputLabel>
              <Select<string>
                labelId="room-type-label"
                label="Room Type *"
                value={roomType}
                displayEmpty
                onChange={(e) => setRoomType(e.target.value)}
                renderValue={(selected) => {
                  if (!selected) return <span style={{ color: "rgba(0,0,0,0.6)" }}>Select room type</span>;
                  const rt = roomTypes.find(r => r.value === selected);
                  return rt ? rt.label : selected;
                }}
              >
                <MenuItem value="">
                  <em>Select room type</em>
                </MenuItem>
                {roomTypes.map(rt => (
                  <MenuItem key={rt.value} value={rt.value}>{rt.label}</MenuItem>
                ))}
              </Select>
              {roomTypeError && <FormHelperText>Required</FormHelperText>}
            </FormControl>

            {/* Dates */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-in *"
                value={checkIn}
                onChange={setCheckIn}
                minDate={new Date()}
                enableAccessibleFieldDOMStructure={false}
                slotProps={{
                  textField: {
                    slotProps: {
                      htmlInput: { "aria-label": "Check-in date", readOnly: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: undefined,
                      },
                    },
                    error: checkInError,
                    helperText: checkInError ? "Required" : undefined,
                  },
                  popper: { container: containerEl as any },
                }}
              />

              <DatePicker
                label="Check-out *"
                value={checkOut}
                onChange={setCheckOut}
                minDate={checkIn ?? new Date()}
                enableAccessibleFieldDOMStructure={false}
                slotProps={{
                  textField: {
                    slotProps: {
                      htmlInput: { "aria-label": "Check-out date", readOnly: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: undefined,
                      },
                    },
                    error: checkOutError,
                    helperText: checkOutError ? "Must be after check-in" : undefined,
                  },
                  popper: { container: containerEl as any },
                }}
              />
            </LocalizationProvider>

            {/* Guests & Children (labels forced to float with shrink) */}
            <FormControl error={guestsError}>
              <InputLabel id="guests-label" shrink>Guests *</InputLabel>
              <Select<number>
                labelId="guests-label"
                label="Guests *"
                value={guests}
                displayEmpty
                onChange={(e) => setGuests(e.target.value as number)}
                renderValue={(selected) =>
                  selected === -1
                    ? <span style={{ color: "rgba(0,0,0,0.6)" }}>Select guests</span>
                    : `${selected} ${selected === 1 ? "Guest" : "Guests"}`
                }
              >
                <MenuItem value={-1} disabled>Select guests</MenuItem>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </MenuItem>
                ))}
              </Select>
              {guestsError && <FormHelperText>Required</FormHelperText>}
            </FormControl>

            <FormControl error={childrenError}>
              <InputLabel id="children-label" shrink>Children *</InputLabel>
              <Select<number>
                labelId="children-label"
                label="Children *"
                value={children}
                displayEmpty
                onChange={(e) => setChildren(e.target.value as number)}
                renderValue={(selected) =>
                  selected === -1
                    ? <span style={{ color: "rgba(0,0,0,0.6)" }}>Select children</span>
                    : `${selected} ${selected === 1 ? "Child" : "Children"}`
                }
              >
                <MenuItem value={-1} disabled>Select children</MenuItem>
                {[0, 1, 2, 3, 4].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} {n === 1 ? "Child" : "Children"}
                  </MenuItem>
                ))}
              </Select>
              {childrenError && <FormHelperText>Required</FormHelperText>}
            </FormControl>

            {/* Message */}
            <TextField
              className="full"
              label="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              minRows={4}
              slotProps={{ htmlInput: { "aria-label": "Message" } }}
            />

            {/* Submit row */}
            <Box className="full" sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <PurpleButton type="submit" variant="contained" sx={{ px: 4, py: 1.25 }}>
                Submit Request
              </PurpleButton>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "text.secondary" }}>
            By submitting, you agree that our reservations team may contact you via email/phone.
          </Typography>
        </Container>
      </main>

      <Footer />

      <Snackbar open={snack.open} autoHideDuration={3200} onClose={closeSnack} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <MuiAlert elevation={6} variant="filled" severity={snack.kind} onClose={closeSnack} sx={{ width: "100%" }}>
          {snack.msg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

(BookingPage as any).seo = {
  title: "Booking",
  description:
    "Book your stay at Hotel Poinisuk, Shillong — best rates, secure reservations, and flexible dates.",
  ogImage: "/images/og/booking.jpg",
};
export default BookingPage;
