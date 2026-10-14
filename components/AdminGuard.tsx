// components/AdminGuard.tsx
//
// Client-side route guard for admin pages. Because the site is statically
// exported (no SSR / middleware), we cannot enforce auth on the server. The
// Lambda backend is the actual gatekeeper — every admin API call is rejected
// without a valid JWT.
//
// What this component does is purely a UX nicety:
//   1. Checks for a non-expired JWT in localStorage on mount.
//   2. Redirects to /admin/login if missing or expired.
//   3. Renders a polished brand-themed loading state during the check so we
//      never flash protected content to an unauthenticated user.
//
// Use it as a wrapper around any page that lives under /admin.
//
// Note: `_app.tsx` already adds `noindex` for any route starting with /admin
// so search engines won't crawl these pages.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";

const cinzel =
  "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed">("checking");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setStatus("authed");
      return;
    }
    // Preserve the intended path so we can return after login.
    const next = router.asPath.startsWith("/admin")
      ? router.asPath
      : "/admin";
    router.replace({ pathname: "/admin/login", query: { next } });
  }, [router]);

  if (status === "checking") {
    return (
      <Box
        sx={{
          minHeight: `calc(100dvh - ${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2.5,
          background:
            "radial-gradient(80% 120% at 50% 0%, rgba(95,2,171,0.18) 0%, rgba(50,9,83,0.08) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
          color: "#ece6f5",
        }}
      >
        <CircularProgress
          size={36}
          thickness={3}
          sx={{ color: "#caa6ff" }}
        />
        <Typography
          sx={{
            fontFamily: cinzel,
            fontWeight: 500,
            fontSize: "0.78rem",
            letterSpacing: "0.32em",
            color: "rgba(236,230,245,0.7)",
            textTransform: "uppercase",
          }}
        >
          Verifying session
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
