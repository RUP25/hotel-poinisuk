// components/AvailabilityForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Box,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import EventIcon from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

/** Colors-only; sizes controlled via sx + responsive logic */
const WhiteInputLabel = styled(InputLabel)({
  color: "#fff",
  "&.Mui-focused": { color: "#fff" },
});
const WhiteBorderTextField = styled(TextField)({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
  "& .MuiInputLabel-root": { color: "#fff" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  "& .MuiOutlinedInput-input": { color: "#fff" },
  "& input::placeholder": { color: "#fff", opacity: 1 },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "#fff" },
});

interface AvailabilityFormProps {
  onCheckRates: (
    checkIn: Date | null,
    checkOut: Date | null,
    guests: number | "",
    children: number | ""
  ) => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onCheckRates }) => {
  const theme = useTheme();

  // Default MUI breakpoints
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // ≥600
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // ≥900

  // Micro-breakpoints inside "xs" (mobile) for finer control
  const isXsTiny  = useMediaQuery("(max-width:360px)");                 // very small phones
  const isXsSmall = useMediaQuery("(min-width:361px) and (max-width:420px)");
  const isXsLarge = useMediaQuery("(min-width:421px) and (max-width:599px)"); // large phones

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number | "">("");
  const [children, setChildren] = useState<number | "">("");

  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);

  const [attempted, setAttempted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (checkIn && (!checkOut || checkOut <= checkIn)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay);
    }
  }, [checkIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid =
      !!checkIn && !!checkOut && checkOut > (checkIn as Date) && guests !== "" && children !== "";
    if (!valid) {
      setAttempted(true);
      setSnackOpen(true);
      return;
    }
    onCheckRates(checkIn, checkOut, guests, children);
  };

  // Sizing tuned per micro-breakpoint
  const controlFontSize =
    isMdUp ? "1.1rem"
    : isSmUp ? "1.05rem"
    : isXsLarge ? "1.0rem"
    : isXsSmall ? "0.95rem"
    : "0.9rem";

  const baseFieldHeight =
    isMdUp ? 52
    : isSmUp ? 48
    : isXsLarge ? 46
    : isXsSmall ? 44
    : 40;

  const iconSize =
    isMdUp ? 28
    : isSmUp ? 24
    : isXsLarge ? 22
    : isXsSmall ? 21
    : 20;

  // Compute grid layout per size
  let gridTemplateAreas: string;
  let gridTemplateColumns: any;
  let gap = 2.5;
  let pad = 3;

  if (isMdUp) {
    gridTemplateAreas = `"checkin checkout guests children button"`;
    gridTemplateColumns = "1.25fr 1.25fr 1fr 1fr 0.9fr";
    gap = 2.5; pad = 3;
  } else if (isSmUp) {
    // tablets (600–899) → 2x2 + full-width button
    gridTemplateAreas = `
      "checkin  checkout"
      "guests   children"
      "button   button"
    `;
    gridTemplateColumns = "1fr 1fr";
    gap = 1.5; pad = 2;
  } else if (isXsLarge) {
    // large phones (421–599) → same as tablets, but tighter
    gridTemplateAreas = `
      "checkin  checkout"
      "guests   children"
      "button   button"
    `;
    gridTemplateColumns = "1fr 1fr";
    gap = 1.25; pad = 1.25;
  } else if (isXsSmall) {
    // small phones (361–420) → stacked single column
    gridTemplateAreas = `
      "checkin"
      "checkout"
      "guests"
      "children"
      "button"
    `;
    gridTemplateColumns = "1fr";
    gap = 1.0; pad = 1.0;
  } else {
    // very small phones (≤360) → ultra compact stacked
    gridTemplateAreas = `
      "checkin"
      "checkout"
      "guests"
      "children"
      "button"
    `;
    gridTemplateColumns = "1fr";
    gap = 0.75; pad = 0.9;
  }

  // portal poppers/menus to body (avoid clipping)
  const containerEl = useMemo(
    () => (typeof document !== "undefined" ? document.body : undefined),
    []
  );

  const commonDateFieldSx = {
    "& .MuiInputBase-root": { minHeight: baseFieldHeight, borderRadius: 1.25 },
    "& .MuiOutlinedInput-input": { fontSize: controlFontSize, cursor: "pointer", py: 1, px: 1.5 },
    "& .MuiInputLabel-root": { fontSize: controlFontSize },
  } as const;

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          display: "grid",
          gridTemplateAreas,
          gridTemplateColumns,
          gap,
          alignItems: "center",
          p: pad,
          width: "100%",
          maxWidth: { xs: 560, sm: 1000, md: 1200 },
          mx: "auto",
          bgcolor: "rgba(0,0,0,0.25)",
          borderRadius: { xs: 1.25, sm: 1.5, md: 1.75 },
          boxShadow: theme.shadows[4],
          minWidth: 0,

          // tiny tweaks for ultra-small
          "@media (max-width:360px)": {
            "& .MuiFormControl-root": { margin: "4px 0" },
          },
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
                      <InputAdornment
                        position="start"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setOpenIn(true)}
                      >
                        <EventIcon sx={{ fontSize: iconSize }} />
                      </InputAdornment>
                    ),
                    endAdornment: null,
                  },
                  error: attempted && !checkIn,
                  helperText: attempted && !checkIn ? "Required" : undefined,
                  sx: { ...commonDateFieldSx, minWidth: 0 },
                },
                popper: { disablePortal: false, container: containerEl as any },
                openPickerButton: { sx: { display: "none" } },
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
                      <InputAdornment
                        position="start"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setOpenOut(true)}
                      >
                        <EventIcon sx={{ fontSize: iconSize }} />
                      </InputAdornment>
                    ),
                    endAdornment: null,
                  },
                  error: attempted && (!checkOut || (checkIn && checkOut <= checkIn)),
                  helperText:
                    attempted && (!checkOut || (checkIn && checkOut <= checkIn))
                      ? "Must be after check-in"
                      : undefined,
                  sx: { ...commonDateFieldSx, minWidth: 0 },
                },
                popper: { disablePortal: false, container: containerEl as any },
                openPickerButton: { sx: { display: "none" } },
              }}
            />
          </Box>
        </LocalizationProvider>

        {/* Guests */}
        <Box sx={{ gridArea: "guests", minWidth: 0 }}>
          <FormControl
            size={isSmUp ? "medium" : "small"}
            variant="outlined"
            fullWidth
            error={attempted && guests === ""}
            sx={{
              "& .MuiInputLabel-root": { color: "#fff", fontSize: controlFontSize },
              "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "& .MuiInputBase-root": { minHeight: baseFieldHeight, borderRadius: 1.25 },
              minWidth: 0,
            }}
          >
            <WhiteInputLabel id="guests-label">Guests</WhiteInputLabel>
            <Select
              labelId="guests-label"
              label="Guests"
              value={guests}
              displayEmpty
              onChange={(e) => setGuests(e.target.value === "" ? "" : Number(e.target.value))}
              renderValue={(selected) =>
                selected === "" ? <span style={{ color: "#fff", opacity: 0.7 }} /> :
                `${selected} ${selected === 1 ? "Guest" : "Guests"}`
              }
              MenuProps={{
                disablePortal: false,
                container: containerEl,
                PaperProps: { sx: { maxHeight: 300 } },
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                transformOrigin: { vertical: "top", horizontal: "left" },
              }}
              sx={{
                fontSize: controlFontSize,
                minHeight: baseFieldHeight,
                color: "#fff",
                "& .MuiSelect-icon": { color: "#fff" },
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#777" }}>
                Select guests
              </MenuItem>
              {[1, 2, 3, 4].map((n) => (
                <MenuItem key={n} value={n} sx={{ fontSize: controlFontSize }}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Children */}
        <Box sx={{ gridArea: "children", minWidth: 0 }}>
          <FormControl
            size={isSmUp ? "medium" : "small"}
            variant="outlined"
            fullWidth
            error={attempted && children === ""}
            sx={{
              "& .MuiInputLabel-root": { color: "#fff", fontSize: controlFontSize },
              "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "& .MuiInputBase-root": { minHeight: baseFieldHeight, borderRadius: 1.25 },
              minWidth: 0,
            }}
          >
            <WhiteInputLabel id="children-label">Children</WhiteInputLabel>
            <Select
              labelId="children-label"
              label="Children"
              value={children}
              displayEmpty
              onChange={(e) => setChildren(e.target.value === "" ? "" : Number(e.target.value))}
              renderValue={(selected) =>
                selected === "" ? <span style={{ color: "#fff", opacity: 0.7 }} /> :
                `${selected} ${selected === 1 ? "Child" : "Children"}`
              }
              MenuProps={{
                disablePortal: false,
                container: containerEl,
                PaperProps: { sx: { maxHeight: 300 } },
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                transformOrigin: { vertical: "top", horizontal: "left" },
              }}
              sx={{
                fontSize: controlFontSize,
                minHeight: baseFieldHeight,
                color: "#fff",
                "& .MuiSelect-icon": { color: "#fff" },
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#777" }}>
                Select children
              </MenuItem>
              {[0, 1, 2, 3, 4].map((n) => (
                <MenuItem key={n} value={n} sx={{ fontSize: controlFontSize }}>
                  {n} {n === 1 ? "Child" : "Children"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Submit */}
        <Box
          sx={{
            gridArea: "button",
            display: "flex",
            justifyContent: isMdUp ? "flex-end" : "stretch",
            minWidth: 0,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: { xs: "100%", md: 220 },
              whiteSpace: "nowrap",
              px: { xs: 2.25, sm: 3, md: 0 },
              py: { xs: 1.1, sm: 1.25, md: 2 },
              fontSize: { xs: "1rem", sm: "1.05rem", md: "1.15rem" },
              bgcolor: "#5f02ab",
              borderRadius: 1.25,
              "&:hover": { bgcolor: "#320953" },
            }}
          >
            CHECK RATES
          </Button>
        </Box>
      </Paper>

      {/* Warning Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3200}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="warning"
          onClose={() => setSnackOpen(false)}
          sx={{ width: "100%" }}
        >
          Please fill all details: Check-in, Check-out, Guests and Children.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AvailabilityForm;
