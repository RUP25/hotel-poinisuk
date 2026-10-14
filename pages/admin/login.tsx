// pages/admin/login.tsx
//
// Hotel Poinisuk — Admin login.
//
// Single-field password login. The password is checked server-side by the
// AWS Lambda backend (bcrypt-hashed in an env var); on success the Lambda
// returns a JWT which we cache in localStorage via `lib/admin-auth.ts`.
//
// _app.tsx already adds `noindex` for any route under /admin so this page
// is never crawled by search engines.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  isAdminAuthenticated,
  loginAdmin,
} from "@/lib/admin-auth";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";
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

const AdminLoginPage: NextPageWithSeo = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // If already signed in, bounce straight to the dashboard (or to ?next).
  useEffect(() => {
    if (isAdminAuthenticated()) {
      const next = (router.query.next as string) || "/admin";
      router.replace(next);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const result = await loginAdmin({ password });
    setSubmitting(false);

    setSnack({
      open: true,
      severity: result.ok ? "success" : "error",
      message: result.message,
    });

    if (result.ok) {
      const next = (router.query.next as string) || "/admin";
      // Tiny delay so the success toast is visible before navigation.
      setTimeout(() => router.replace(next), 400);
    }
  };

  return (
    <Box
      sx={{
        minHeight: `calc(100dvh - ${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 5, md: 8 },
        position: "relative",
        background:
          "radial-gradient(80% 120% at 50% 0%, rgba(95,2,171,0.22) 0%, rgba(50,9,83,0.10) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
        color: "#ece6f5",
        overflow: "hidden",
        "@keyframes panelIn": {
          "0%": { opacity: 0, transform: "translateY(18px) scale(0.985)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      }}
    >
      {/* Soft ambient orb behind the panel */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "120%", md: "70%" },
          height: { xs: 360, md: 460 },
          background:
            "radial-gradient(closest-side, rgba(95,2,171,0.22) 0%, rgba(95,2,171,0) 75%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          bgcolor: "rgba(20,12,38,0.65)",
          border: "1px solid rgba(202,166,255,0.22)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderRadius: 1.4,
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 5 },
          animation: "panelIn 700ms cubic-bezier(.2,.7,.2,1) both",
          // Top accent line
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_LAVENDER} 50%, ${BRAND_PURPLE} 100%)`,
          },
        }}
      >
        {/* Lock icon + small label */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(202,166,255,0.10)",
              border: "1px solid rgba(202,166,255,0.32)",
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 26, color: BRAND_LAVENDER }} />
          </Box>
          <Typography
            sx={{
              fontFamily: cinzel,
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.32em",
              color: BRAND_LAVENDER,
              textTransform: "uppercase",
              mb: 0.6,
            }}
          >
            Hotel Poinisuk · Admin
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: cormorant,
              fontWeight: 600,
              fontSize: { xs: "1.7rem", sm: "1.95rem" },
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            Sign in to manage events
          </Typography>
          <Typography
            sx={{
              fontFamily: cormorant,
              fontStyle: "italic",
              color: "rgba(236,230,245,0.7)",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              mt: 1,
            }}
          >
            Enter the admin password to add, edit, or remove karaoke and live
            music nights.
          </Typography>
        </Box>

        {/* Password field */}
        <TextField
          fullWidth
          required
          autoFocus
          autoComplete="current-password"
          name="password"
          label="Admin password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    sx={{ color: "rgba(236,230,245,0.7)" }}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
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
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: BRAND_LAVENDER,
              borderWidth: 1.5,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          fullWidth
          sx={{
            mt: 3,
            bgcolor: BRAND_PURPLE,
            "&:hover": { bgcolor: "#76046b" },
            "&.Mui-disabled": {
              bgcolor: "rgba(95,2,171,0.5)",
              color: "#fff",
            },
            py: 1.4,
            borderRadius: 1.1,
            fontFamily: cinzel,
            fontWeight: 700,
            letterSpacing: "0.22em",
            fontSize: "0.82rem",
            textTransform: "uppercase",
            boxShadow: "0 8px 22px rgba(95,2,171,0.4)",
            transition:
              "background-color 240ms ease, box-shadow 240ms ease, transform 240ms ease",
          }}
          startIcon={
            submitting ? (
              <CircularProgress size={16} sx={{ color: "inherit" }} />
            ) : null
          }
        >
          {submitting ? "Signing in…" : "Sign In"}
        </Button>

        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
            fontFamily: cinzel,
            fontWeight: 500,
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            color: "rgba(236,230,245,0.5)",
            textTransform: "uppercase",
          }}
        >
          © Hotel Poinisuk {new Date().getFullYear()}
        </Typography>
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

AdminLoginPage.seo = {
  title: "Admin · Sign In",
  noindex: true,
};

export default AdminLoginPage;
