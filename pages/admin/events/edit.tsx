// pages/admin/events/edit.tsx
//
// Edit an existing event. Reads the event ID from `?id=...` instead of
// using a dynamic `[id]` route — this is necessary because the site is
// statically exported (`output: "export"`) and dynamic routes need their
// paths known at build time. Since events are added at runtime, we can't
// pre-generate paths, so we use a query string instead.
//
// The dashboard links here as `/admin/events/edit?id=<eventId>`.

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AdminGuard from "@/components/AdminGuard";
import EventForm from "@/components/admin/EventForm";
import { fetchEventById } from "@/lib/events";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";
import type { EventRecord } from "@/types/events";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

const cinzel =
  "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";
const cormorant =
  "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";

const BRAND_LAVENDER = "#caa6ff";
const BRAND_PURPLE = "#5f02ab";
const BRAND_DEEP = "#320953";

const EditEventInner: React.FC = () => {
  const router = useRouter();
  const idQuery = router.query.id;
  const id = typeof idQuery === "string" ? idQuery : Array.isArray(idQuery) ? idQuery[0] : undefined;

  const [record, setRecord] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const r = await fetchEventById(id);
      if (cancelled) return;
      if (!r) {
        setNotFound(true);
      } else {
        setRecord(r);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: `calc(100dvh - ${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          background:
            "radial-gradient(80% 120% at 50% 0%, rgba(95,2,171,0.18) 0%, rgba(50,9,83,0.08) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
          color: "#ece6f5",
        }}
      >
        <CircularProgress size={32} thickness={3} sx={{ color: BRAND_LAVENDER }} />
        <Typography
          sx={{
            fontFamily: cinzel,
            fontWeight: 500,
            fontSize: "0.74rem",
            letterSpacing: "0.32em",
            color: "rgba(236,230,245,0.7)",
            textTransform: "uppercase",
          }}
        >
          Loading event
        </Typography>
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box
        sx={{
          minHeight: `calc(100dvh - ${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2.4,
          textAlign: "center",
          px: 3,
          background:
            "radial-gradient(80% 120% at 50% 0%, rgba(95,2,171,0.18) 0%, rgba(50,9,83,0.08) 35%, rgba(12,8,21,0) 70%), linear-gradient(180deg, #100a1e 0%, #0c0815 60%, #07050d 100%)",
          color: "#ece6f5",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: cormorant,
            fontWeight: 700,
            fontSize: { xs: "1.4rem", md: "1.7rem" },
            color: "#fff",
          }}
        >
          We couldn't find that event.
        </Typography>
        <Typography
          sx={{
            fontFamily: cormorant,
            fontStyle: "italic",
            color: "rgba(236,230,245,0.7)",
            fontSize: "1rem",
            maxWidth: 460,
          }}
        >
          It may have been deleted, or the link is no longer valid. Head back
          to the dashboard to see all current events.
        </Typography>
        <Button
          component={Link}
          href="/admin"
          variant="contained"
          sx={{
            bgcolor: BRAND_PURPLE,
            "&:hover": { bgcolor: "#76046b" },
            fontFamily: cinzel,
            fontWeight: 700,
            letterSpacing: "0.22em",
            fontSize: "0.78rem",
            textTransform: "uppercase",
            px: 3,
            py: 1.2,
            borderRadius: 1.1,
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <EventForm
      initial={record!}
      title="Edit event"
      subtitle="Update any details and save — the public karaoke page refreshes automatically."
    />
  );
};

const EditEventPage: NextPageWithSeo = () => (
  <AdminGuard>
    <EditEventInner />
  </AdminGuard>
);

EditEventPage.seo = {
  title: "Admin · Edit Event",
  noindex: true,
};

export default EditEventPage;
