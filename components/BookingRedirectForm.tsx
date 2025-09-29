"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Paper, FormControl, Select, MenuItem, Button,
  InputAdornment, useTheme, useMediaQuery, Box, Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import EventIcon from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

/** Transparent + white styled fields */
const WhiteInputLabel = styled(InputLabel)({
  color: "#fff",
  "&.Mui-focused": { color: "#fff" },
});

const WhiteBorderTextField = styled(TextField)({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiInputLabel-root": { color: "#fff" },
  "& .MuiOutlinedInput-input": { color: "#fff" },
  "& input::placeholder": { color: "#fff", opacity: 1 },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "#fff" },
});

/** —— SwiftBook constants (from your working deep link) —— */
const BASE = "https://www.swiftbook.io/inst/";
const PROPERTY_ID = "223NTUo30r6ZPJm6O5Mzg=";
const GS_ID = "223NTUo30r6ZPJm6O5Mzg=";
const ROOM_IDS = "226166,226165,226164,226163,226162";

/** Optional date format helper if/when SwiftBook shares date keys */
// function pad2(n: number) { return String(n).padStart(2, "0"); }
// function formatDDMMYYYY(d: Date) {
//   return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

export default function BookingRedirectForm() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  // default dates: today / tomorrow (kept for UI only; remove if you don’t want)
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(today);
    setCheckOut(tomorrow);
  }, []);

  // ensure checkout > checkin
  useEffect(() => {
    if (checkIn && (!checkOut || checkOut <= checkIn)) {
      const next = new Date(checkIn);
      next.setDate(next.getDate() + 1);
      setCheckOut(next);
    }
  }, [checkIn, checkOut]);

  const containerEl = useMemo(
    () => (typeof document !== "undefined" ? document.body : undefined),
    []
  );

  const controlFontSize = "clamp(0.9rem, 2.2vw, 1.1rem)";
  const baseFieldHeight = "clamp(40px, 6vw, 52px)";
  const iconSize = isMdUp ? 28 : isSmUp ? 24 : 22;

  const commonDateFieldSx = {
    "& .MuiInputBase-root": { minHeight: baseFieldHeight as any, borderRadius: 1.25 },
    "& .MuiOutlinedInput-input": { fontSize: controlFontSize, cursor: "pointer", py: 1, px: 1.5 },
    "& .MuiInputLabel-root": { fontSize: controlFontSize },
  } as const;

  const checkInError = Boolean(attempted && !checkIn);
  const checkOutError = Boolean(attempted && (!checkOut || (checkIn && checkOut! <= checkIn)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation (dates optional if SwiftBook doesn’t accept date params)
    const valid = !!checkIn && !!checkOut && checkOut > checkIn;
    if (!valid) {
      setAttempted(true);
      setSnackOpen(true);
      return;
    }

    // IMPORTANT: build the query string MANUALLY to avoid over-encoding commas/equals
    // If SwiftBook shares date keys later (e.g., checkin/checkout), append them here.
    const qs =
      `propertyId=${PROPERTY_ID}` +
      `&JDRN=Y` +
      `&RoomID=${ROOM_IDS}` +         // keep commas unencoded
      `&noofrooms=1` +
      `&adult0=${adults}` +           // adults for room 0
      `&child0=${children}` +         // children for room 0
      `&ap=1` +
      `&gsId=${GS_ID}`;

    const url = `${BASE}#/home?${qs}`;
    console.log("SwiftBook URL =>", url);
    window.location.href = url;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          display: "grid",
          gridTemplateAreas: {
            md: `"checkin checkout adults children button"`,
            xs: `"checkin" "checkout" "adults" "children" "button"`,
          },
          gridTemplateColumns: { md: "1.25fr 1.25fr 1fr 1fr 0.9fr", xs: "1fr" },
          gap: { xs: 1.25, sm: 1.5, md: 2.5 },
          alignItems: "center",
          p: { xs: 1.25, sm: 2, md: 0 },
          width: "100%",
          bgcolor: "transparent",
          color: "#fff",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* Check-in */}
          <Box sx={{ gridArea: "checkin", minWidth: 0 }}>
            <DatePicker
              label="Check-in"
              value={checkIn}
              onChange={setCheckIn}
              minDate={new Date()}
              open={openIn}
              onOpen={() => setOpenIn(true)}
              onClose={() => setOpenIn(false)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: WhiteBorderTextField, openPickerIcon: () => <></> }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: isSmUp ? "medium" : "small",
                  variant: "outlined",
                  inputProps: { "aria-label": "Check-in date", readOnly: true },
                  onClick: () => setOpenIn(true),
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ cursor: "pointer" }} onClick={() => setOpenIn(true)}>
                        <EventIcon sx={{ fontSize: iconSize, color: "#fff" }} />
                      </InputAdornment>
                    ),
                  },
                  error: checkInError,
                  helperText: checkInError ? "Required" : undefined,
                  sx: { ...commonDateFieldSx, minWidth: 0 },
                },
                popper: { container: containerEl as any },
              }}
            />
          </Box>

          {/* Check-out */}
          <Box sx={{ gridArea: "checkout", minWidth: 0 }}>
            <DatePicker
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn ?? new Date()}
              open={openOut}
              onOpen={() => setOpenOut(true)}
              onClose={() => setOpenOut(false)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: WhiteBorderTextField, openPickerIcon: () => <></> }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: isSmUp ? "medium" : "small",
                  variant: "outlined",
                  inputProps: { "aria-label": "Check-out date", readOnly: true },
                  onClick: () => setOpenOut(true),
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ cursor: "pointer" }} onClick={() => setOpenOut(true)}>
                        <EventIcon sx={{ fontSize: iconSize, color: "#fff" }} />
                      </InputAdornment>
                    ),
                  },
                  error: checkOutError,
                  helperText: checkOutError ? "Must be after check-in" : undefined,
                  sx: { ...commonDateFieldSx, minWidth: 0 },
                },
                popper: { container: containerEl as any },
              }}
            />
          </Box>
        </LocalizationProvider>

        {/* Adults */}
        <Box sx={{ gridArea: "adults", minWidth: 0 }}>
          <FormControl
            size={isSmUp ? "medium" : "small"}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": { color: "#fff", fontSize: controlFontSize },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "& .MuiInputBase-root": { minHeight: baseFieldHeight as any, borderRadius: 1.25, color: "#fff" },
            }}
          >
            <WhiteInputLabel id="adults-label">Adults</WhiteInputLabel>
            <Select<number>
              labelId="adults-label"
              label="Adults"
              value={adults}
              onChange={(e) => setAdults(e.target.value as number)}
              sx={{
                fontSize: controlFontSize,
                minHeight: baseFieldHeight as any,
                color: "#fff",
                "& .MuiSelect-icon": { color: "#fff" },
              }}
            >
              {[1,2,3,4,5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Children */}
        <Box sx={{ gridArea: "children", minWidth: 0 }}>
          <FormControl
            size={isSmUp ? "medium" : "small"}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": { color: "#fff", fontSize: controlFontSize },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "& .MuiInputBase-root": { minHeight: baseFieldHeight as any, borderRadius: 1.25, color: "#fff" },
            }}
          >
            <WhiteInputLabel id="children-label">Children</WhiteInputLabel>
            <Select<number>
              labelId="children-label"
              label="Children"
              value={children}
              onChange={(e) => setChildren(e.target.value as number)}
              sx={{
                fontSize: controlFontSize,
                minHeight: baseFieldHeight as any,
                color: "#fff",
                "& .MuiSelect-icon": { color: "#fff" },
              }}
            >
              {[0,1,2,3,4].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Submit */}
        <Box sx={{ gridArea: "button", display: "flex", justifyContent: isMdUp ? "flex-end" : "stretch" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: { xs: "100%", md: 220 },
              whiteSpace: "nowrap",
              px: { xs: 2.25, sm: 3, md: 0 },
              py: { xs: 1.1, sm: 1.25, md: 2 },
              fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
              bgcolor: "#5f02ab",
              borderRadius: 1.25,
              "&:hover": { bgcolor: "#320953" },
            }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2600}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="warning" onClose={() => setSnackOpen(false)} sx={{ width: "100%" }}>
          Please fill all details.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
