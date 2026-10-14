// pages/admin/events/new.tsx
//
// "Add a new event" page. Renders the shared <EventForm /> with no
// `initial` record so the form starts empty.

import React from "react";
import AdminGuard from "@/components/AdminGuard";
import EventForm from "@/components/admin/EventForm";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

const NewEventPage: NextPageWithSeo = () => (
  <AdminGuard>
    <EventForm
      title="Add a new event"
      subtitle="Fill in the details — the event will appear on the public karaoke page as soon as you publish."
    />
  </AdminGuard>
);

NewEventPage.seo = {
  title: "Admin · New Event",
  noindex: true,
};

export default NewEventPage;
