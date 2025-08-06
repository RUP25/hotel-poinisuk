import React, { useState } from "react";
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import EventIcon from "@mui/icons-material/Event";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Custom styled InputLabel for always-white color
const WhiteInputLabel = styled(InputLabel)({
  color: '#fff !important',
  fontSize: '1.1rem',
  '&.Mui-focused': {
    color: '#fff !important',
  },
});

// Custom styled TextField for DatePicker
const WhiteBorderTextField = styled(TextField)({
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },
  '& .MuiInputLabel-root': {
    color: '#fff',
    fontSize: '1.2rem',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#fff',
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
    fontSize: '1.2rem',
  },
  '& input::placeholder': {
    color: '#fff',
    opacity: 1,
    fontSize: '1.2rem',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: '#fff',
    fontSize: 28,
  },
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
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  // Default to "" for placeholder!
  const [guests, setGuests] = useState<number | "">("");
  const [children, setChildren] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckRates(checkIn, checkOut, guests, children);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: { xs: 2, sm: 4, md: 6 },
        width: "100%",
        maxWidth: { xs: 400, sm: 700, md: 1000 },
        mx: "auto",
        bgcolor: "transparent",
        backdropFilter: "blur(2px)",
        borderRadius: 1,
        boxShadow: theme.shadows[4],
        mt:7,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Check-in */}
        <DatePicker
          label="Check-in"
          value={checkIn}
          onChange={setCheckIn}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: WhiteBorderTextField,
          }}
          slotProps={{
            textField: {
              size: "medium",
              variant: "outlined",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon />
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        {/* Check-out */}
        <DatePicker
          label="Check-out"
          value={checkOut}
          onChange={setCheckOut}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: WhiteBorderTextField,
          }}
          slotProps={{
            textField: {
              size: "medium",
              variant: "outlined",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon />
                  </InputAdornment>
                ),
              },
            },
          }}
        />
      </LocalizationProvider>

      {/* Guests */}
      <FormControl
        size="medium"
        variant="outlined"
        sx={{
          width: { xs: 90, sm: 130, md: 180 },
          "& .MuiInputLabel-root": {
            color: "#fff !important",
            fontSize: "1.1rem",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#fff !important",
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
      >
        <WhiteInputLabel id="guests-label">Guests</WhiteInputLabel>
        <Select
          labelId="guests-label"
          label="Guests"
          value={guests}
          displayEmpty
          onChange={(e) =>
            setGuests(e.target.value === "" ? "" : Number(e.target.value))
          }
          renderValue={(selected) =>
            selected === "" ? (
              <span style={{ color: "#fff", opacity: 0.7 }}></span>
            ) : (
              `${selected} ${selected === 1 ? "Guest" : "Guests"}`
            )
          }
          sx={{
            fontSize: "1.1rem",
            minHeight: 48,
            color: "#fff",
            "& .MuiSelect-icon": { color: "#fff" },
          }}
        >
          <MenuItem value="" disabled sx={{ color: "#fff", opacity: 0.7 }}>
            Select guests
          </MenuItem>
          {[1, 2, 3, 4].map((n) => (
            <MenuItem key={n} value={n} sx={{ fontSize: "1.1rem", color: "#000" }}>
              {n} {n === 1 ? "Guest" : "Guests"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Children */}
      <FormControl
        size="medium"
        variant="outlined"
        sx={{
          width: { xs: 80, sm: 120, md: 200 },
          "& .MuiInputLabel-root": {
            color: "#fff !important",
            fontSize: "1.1rem",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#fff !important",
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
      >
        <WhiteInputLabel id="children-label">Children</WhiteInputLabel>
        <Select
          labelId="children-label"
          label="Children"
          value={children}
          displayEmpty
          onChange={(e) =>
            setChildren(e.target.value === "" ? "" : Number(e.target.value))
          }
          renderValue={(selected) =>
            selected === "" ? (
              <span style={{ color: "#fff", opacity: 0.2 }}></span>
            ) : (
              `${selected} ${selected === 1 ? "Child" : "Children"}`
            )
          }
          sx={{
            fontSize: "1.1rem",
            minHeight: 48,
            color: "#fff",
            "& .MuiSelect-icon": { color: "#fff" },
          }}
        >
          <MenuItem value="" disabled sx={{ color: "#000", opacity: 0.7 }}>
            Select children
          </MenuItem>
          {[1, 2, 3, 4].map((n) => (
            <MenuItem key={n} value={n} sx={{ fontSize: "1.1rem", color: "#000" }}>
              {n} {n === 1 ? "Child" : "Children"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        sx={{
          ml: "auto",
          whiteSpace: "nowrap",
          px: { xs: 2, sm: 3, md: 5 },
          fontSize: "1.2rem",
          bgcolor: "#5f02ab",
          "&:hover": {
      bgcolor: "#320953ff", // Darker purple on hover
    },
        }}
      >
        CHECK RATES
      </Button>
    </Paper>
  );
};

export default AvailabilityForm;
