// components/ContactDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { submitContactForm, validateContactInput } from "@/lib/contact";

// Hotel Poinisuk brand font stacks (mirror the rest of the site).
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const cinzel =
  "var(--font-cinzel), var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const montserrat =
  "var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif";

const BRAND_PURPLE = "#5f02ab";
const BRAND_DEEP = "#320953";
const BRAND_INK = "#3f2a2a";

export interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  /** Optional analytics label so we can tell which CTA opened the form. */
  source?: string;
  /** Optional override for the dialog headline. */
  title?: string;
  /** Optional override for the dialog subtitle. */
  subtitle?: string;
  /** Pre-fills the Subject field so the enquiry arrives already labelled. */
  defaultSubject?: string;
}

/**
 * Brand-styled popup version of the contact form.
 *
 * Submits to the SAME AWS Lambda endpoint (and uses the SAME payload shape
 * + response handling) as the full-page <ContactSection /> by routing
 * through `lib/contact.ts`. UX details:
 *   - Cream/white surface to fit the dine page palette.
 *   - Cinzel button + Montserrat inputs to match the rest of the brand.
 *   - Snackbar feedback rendered at the document root so it's visible
 *     even after the dialog has been auto-closed on success.
 *   - Resets the form fields after a successful submission.
 */
const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  source = "hotelpoinisuk.com / contact-dialog",
  title = "Contact Us",
  subtitle = "Have a question or feedback? Send us a note and our team at Hotel Poinisuk will get back to you shortly.",
  defaultSubject,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleCloseSnack = () => setSnack((s) => ({ ...s, open: false }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const input = {
      name: (fd.get("name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      subject: (fd.get("subject") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
      source,
    };

    const validationError = validateContactInput(input);
    if (validationError) {
      setSnack({ open: true, severity: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    const result = await submitContactForm(input);
    setSubmitting(false);

    setSnack({
      open: true,
      severity: result.ok ? "success" : "error",
      message: result.message,
    });

    if (result.ok) {
      form.reset();
      // Close after the user has had a moment to see the success toast.
      setTimeout(onClose, 900);
    }
  };

  // Shared TextField styling — Montserrat input, brand-purple focus state.
  const fieldSx = {
    "& .MuiInputBase-root": {
      fontFamily: montserrat,
      bgcolor: "rgba(95,2,171,0.03)",
    },
    "& .MuiInputLabel-root": { fontFamily: montserrat },
    "& .MuiInputLabel-root.Mui-focused": { color: BRAND_PURPLE },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(50,9,83,0.25)",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(95,2,171,0.55)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND_PURPLE,
      borderWidth: 1.5,
    },
  } as const;

  return (
    <>
      <Dialog
        open={open}
        onClose={submitting ? undefined : onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="contact-dialog-title"
        slotProps={{
          paper: {
            elevation: 12,
            sx: {
              borderRadius: { xs: 1.5, sm: 2 },
              overflow: "hidden",
              bgcolor: "#fffaf2",
              border: "1px solid rgba(95,2,171,0.10)",
              // Subtle brand glow at the top edge.
              boxShadow:
                "0 24px 48px rgba(50,9,83,0.18), 0 4px 12px rgba(50,9,83,0.10)",
            },
          },
        }}
      >
        {/* Brand accent line at the top of the dialog */}
        <Box
          aria-hidden
          sx={{
            height: "3px",
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_DEEP} 50%, ${BRAND_PURPLE} 100%)`,
          }}
        />

        <DialogTitle
          id="contact-dialog-title"
          sx={{
            fontFamily: cormorant,
            fontWeight: 700,
            color: BRAND_DEEP,
            fontSize: { xs: "1.45rem", sm: "1.7rem" },
            pr: 6,
            pb: 0.5,
          }}
        >
          {title}
          <IconButton
            aria-label="Close contact form"
            onClick={onClose}
            disabled={submitting}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: BRAND_DEEP,
              "&:hover": { bgcolor: "rgba(95,2,171,0.08)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5, pb: { xs: 2, sm: 3 } }}>
          <Typography
            sx={{
              fontFamily: cormorant,
              color: BRAND_INK,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              lineHeight: 1.55,
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            {subtitle}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="grid"
            gap={{ xs: 1.4, sm: 1.8 }}
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            noValidate
          >
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              variant="outlined"
              size="small"
              required
              autoComplete="name"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              size="small"
              required
              autoComplete="email"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              variant="outlined"
              size="small"
              autoComplete="tel"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              variant="outlined"
              size="small"
              defaultValue={defaultSubject}
              sx={fieldSx}
            />

            <Box gridColumn="1 / -1">
              <TextField
                fullWidth
                label="Message"
                name="message"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                required
                sx={fieldSx}
              />
            </Box>

            <Box
              gridColumn="1 / -1"
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
                mt: { xs: 0.5, sm: 1 },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                fullWidth
                sx={{
                  bgcolor: BRAND_PURPLE,
                  "&:hover": { bgcolor: "#76046b" },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(95,2,171,0.45)",
                    color: "#fff",
                  },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.1, sm: 1.25 },
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: 1.2,
                  fontFamily: cinzel,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  fontSize: { xs: "0.78rem", sm: "0.85rem" },
                }}
                startIcon={
                  submitting ? (
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                  ) : null
                }
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar lives outside the Dialog so it remains visible after the
          dialog auto-closes on a successful submit. */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%", fontFamily: montserrat }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactDialog;
