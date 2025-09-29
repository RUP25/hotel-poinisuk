// lib/seo.ts
export const SITE_NAME = "Hotel Poinisuk";
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.hotelpoinisuk.com") as string;

export function routeToTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/": "Shillong",
    "/rooms": "Rooms & Suites",
    "/dine": "Dining",
    "/klong": "Klong Lounge",
    "/bar/klong": "Klong Lounge",
    "/banquet": "Banquet Hall",
    "/guest-services": "Guest Services",
    "/contact": "Contact Us",
    "/booking": "Booking",
    "/travel-desk": "Travel Desk",
  };
  if (map[pathname]) return map[pathname];

  const seg = pathname.split("/").filter(Boolean).pop() ?? "";
  return seg ? seg.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Shillong";
}

export function buildCanonical(asPath: string) {
  const clean = asPath.split("#")[0].split("?")[0];
  return `${SITE_URL}${clean || "/"}`;
}

export function makeBreadcrumbLd(asPath: string) {
  const parts = asPath.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    ...parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: p.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      item: `${SITE_URL}/${parts.slice(0, i + 1).join("/")}`,
    })),
  ];
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

export const HOTEL_LD = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Hotel Poinisuk in Shillong offers well-appointed rooms, Dopwai rooftop dining, Klong Lounge, a 200-guest banquet hall, and easy access to Ward’s Lake & Lady Hydari Park.",
  image: `${SITE_URL}/images/og/home-hero.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lady Veronica Lane, Nongkynrih, Laitumkhrah (Police Point)",
    addressLocality: "Shillong",
    addressRegion: "Meghalaya",
    postalCode: "793003",
    addressCountry: "IN",
  },
  checkinTime: "14:00",
  checkoutTime: "11:00",
  hasMap: "https://www.google.com/maps?q=Hotel+Poinisuk+Shillong",
};
