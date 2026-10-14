// lib/seo.ts
// =============================================================================
// Hotel Poinisuk — SEO single source of truth
// Modeled after the JSON-LD / meta playbook used by top luxury chains
// (Taj, Oberoi, ITC, Marriott Luxury Collection) so Google can render the hotel
// as a first-class entity with sitelinks search, Hotel knowledge panel, room
// offers, restaurant menu rich-result, breadcrumbs, FAQ rich-result, etc.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// 1. Site-wide constants
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_NAME = "Hotel Poinisuk";
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.hotelpoinisuk.com") as string;
export const SITE_LOCALE = "en_IN";
export const SITE_LANG = "en-IN";

// Canonical reservations link (matches Book Now buttons across the site)
export const RESERVATION_URL =
  "https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg=";

// ─────────────────────────────────────────────────────────────────────────────
// 2. Brand / property metadata (edit here to update the hotel knowledge panel)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hotel star rating. Adjust to match the rating used in your Google Business
 * Profile and on OTA listings (Booking.com / MakeMyTrip / Goibibo) so the
 * structured data does not contradict third-party signals.
 */
export const HOTEL_STAR_RATING = 3;

/**
 * Total number of rooms across all categories. Used by Hotel.numberOfRooms.
 */
export const HOTEL_ROOM_COUNT = 30;

/**
 * Aggregate review data — render ONLY if you have live numbers from your
 * Google Business Profile. Hardcoding ratings that don't match third-party
 * data is a Google manual-penalty risk. Set both to non-empty strings via
 * `.env.local` to enable AggregateRating in JSON-LD:
 *
 *     NEXT_PUBLIC_AGGREGATE_RATING=4.6
 *     NEXT_PUBLIC_AGGREGATE_REVIEW_COUNT=128
 */
export const AGGREGATE_RATING = process.env.NEXT_PUBLIC_AGGREGATE_RATING || "";
export const AGGREGATE_REVIEW_COUNT =
  process.env.NEXT_PUBLIC_AGGREGATE_REVIEW_COUNT || "";

/**
 * Social profiles — Google uses `sameAs` for entity disambiguation. Populate
 * via `.env.local` once you have live profiles to avoid 404s.
 */
export const SOCIAL_PROFILES: string[] = [
  process.env.NEXT_PUBLIC_FACEBOOK_URL,
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  process.env.NEXT_PUBLIC_TWITTER_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
  process.env.NEXT_PUBLIC_TRIPADVISOR_URL,
].filter((u): u is string => Boolean(u));

/**
 * Twitter @handle (without the @). Set to a real handle or leave blank.
 */
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "";

// ─────────────────────────────────────────────────────────────────────────────
// 3. Keywords & contact
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_KEYWORDS = [
  "Hotel Poinisuk",
  "Hotel in Shillong",
  "Shillong hotel",
  "Meghalaya hotel",
  "hotel near Ward's Lake",
  "hotel near Lady Hydari Park",
  "Shillong accommodation",
  "hotel booking Shillong",
  "Dopwai restaurant",
  "Klong Lounge Shillong",
  "banquet hall Shillong",
  "wedding venue Shillong",
  "Shillong tourism",
  "best hotel Shillong",
  "luxury hotel Shillong",
  "boutique hotel Shillong",
  "rooftop restaurant Shillong",
  "hotel Laitumkhrah",
  "Police Point hotel Shillong",
  "karaoke Shillong",
  "live music Shillong",
  "karaoke night Shillong",
  "open mic Shillong",
  "music venue Shillong",
].join(", ");

export const CONTACT_INFO = {
  phone: "+91-8794726831",
  phoneAlt: "+91-3647100030",
  email: "reservation@hotelpoinisuk.com",
  streetAddress:
    "Lady Veronica Lane, Nongkynrih, Laitumkhrah (Police Point)",
  addressLocality: "Shillong",
  addressRegion: "Meghalaya",
  postalCode: "793003",
  addressCountry: "IN",
  geo: {
    latitude: "25.57154",
    longitude: "91.896645",
  },
} as const;

// Reusable schema sub-objects so every entity stays consistent
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: CONTACT_INFO.streetAddress,
  addressLocality: CONTACT_INFO.addressLocality,
  addressRegion: CONTACT_INFO.addressRegion,
  postalCode: CONTACT_INFO.postalCode,
  addressCountry: CONTACT_INFO.addressCountry,
};

const GEO_COORDS = {
  "@type": "GeoCoordinates",
  latitude: CONTACT_INFO.geo.latitude,
  longitude: CONTACT_INFO.geo.longitude,
};

const HOTEL_OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  opens: "00:00",
  closes: "23:59",
};

// Restaurant / Bar typically operate fixed hours — adjust if Dopwai or Klong
// change their hours.
const RESTAURANT_OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "12:30",
    closes: "22:30",
  },
];

const BAR_OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "12:00",
    closes: "23:00",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function routeToTitle(pathname: string): string {
  const path = pathname || "/";
  const map: Record<string, string> = {
    "/": "Shillong",
    "/rooms": "Rooms & Suites",
    "/dine": "Dining",
    "/klong": "Klong Lounge",
    "/bar/klong": "Klong Lounge",
    "/karaoke": "Live Music & Karaoke",
    "/banquet": "Banquet Hall",
    "/about": "About Us",
    "/guest-services": "Guest Services",
    "/contact": "Contact Us",
    "/booking": "Booking",
    "/travel-desk": "Travel Desk",
    "/terms": "Terms & Conditions",
  };
  if (map[path]) return map[path];

  const seg = path.split("/").filter(Boolean).pop() ?? "";
  return seg
    ? seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Shillong";
}

export function buildCanonical(asPath: string) {
  const raw = asPath ?? "";
  const clean = raw.split("#")[0].split("?")[0];
  return `${SITE_URL}${clean || "/"}`;
}

/**
 * Map each route to the most specific Open Graph type so social previews use
 * the right card layout (Facebook still treats `hotel` and `restaurant` as
 * `website`-equivalent but the Knowledge Graph reads them as hints).
 */
export function getOgType(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/rooms") || pathname === "/about")
    return "hotel";
  if (pathname === "/dine") return "restaurant.menu";
  if (pathname === "/klong") return "bar";
  if (pathname === "/banquet") return "event.venue";
  if (pathname === "/karaoke") return "event.venue";
  return "website";
}

export function makeBreadcrumbLd(asPath: string) {
  const raw = asPath ?? "";
  const parts = raw.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    ...parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: routeToTitle(`/${parts.slice(0, i + 1).join("/")}`),
      item: `${SITE_URL}/${parts.slice(0, i + 1).join("/")}`,
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Top-level entity schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WebSite + SearchAction — eligible for Google Sitelinks Search Box.
 */
export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: SITE_LANG,
  publisher: { "@id": `${SITE_URL}#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Organization — entity backbone for `sameAs` (social profiles), contact, logo.
 */
export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo1.png`,
    width: 1019,
    height: 473,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      contactType: "Reservations",
      areaServed: ["IN", "Shillong", "Meghalaya"],
      availableLanguage: ["English", "Hindi", "Khasi"],
    },
    {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phoneAlt,
      contactType: "Customer Service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Khasi"],
    },
  ],
  address: POSTAL_ADDRESS,
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
};

/**
 * Hotel — the primary entity. Includes star rating, room count, amenities,
 * sub-properties (Restaurant / Bar / EventVenue) via `containsPlace`, payment
 * methods, languages, currencies — same shape as Taj/Oberoi pages.
 */
export const HOTEL_LD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": `${SITE_URL}#hotel`,
  name: SITE_NAME,
  url: SITE_URL,
  brand: { "@type": "Brand", name: SITE_NAME },
  parentOrganization: { "@id": `${SITE_URL}#organization` },
  logo: `${SITE_URL}/images/logo1.png`,
  image: [
    `${SITE_URL}/images/og/home-hero.jpg`,
    `${SITE_URL}/images/hero-exterior.jpg`,
    `${SITE_URL}/images/hero-lobby-2k.jpg`,
    `${SITE_URL}/images/hero-lounge-2k.jpg`,
    `${SITE_URL}/images/hero-rooftop-2k.jpg`,
    `${SITE_URL}/images/hero-dining-2k.jpg`,
    `${SITE_URL}/images/hero-klong-2k.jpg`,
    `${SITE_URL}/images/image1.webp`,
    `${SITE_URL}/images/image2.webp`,
    `${SITE_URL}/images/image5.webp`,
    `${SITE_URL}/images/image6.webp`,
    `${SITE_URL}/images/og/rooms.jpg`,
    `${SITE_URL}/images/og/dine.jpg`,
    `${SITE_URL}/images/og/banquet.jpg`,
    `${SITE_URL}/images/og/klong.jpg`,
  ],
  description:
    "Hotel Poinisuk in Shillong offers well-appointed rooms, Dopwai rooftop dining, Klong Lounge, a 200-guest banquet hall, and easy access to Ward's Lake & Lady Hydari Park.",
  slogan: "Where Shillong begins.",
  address: POSTAL_ADDRESS,
  geo: GEO_COORDS,
  hasMap: "https://www.google.com/maps?q=Hotel+Poinisuk+Shillong",
  telephone: CONTACT_INFO.phone,
  email: CONTACT_INFO.email,
  faxNumber: "",
  priceRange: "₹₹–₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
  starRating: {
    "@type": "Rating",
    ratingValue: String(HOTEL_STAR_RATING),
    bestRating: "5",
    worstRating: "1",
  },
  numberOfRooms: HOTEL_ROOM_COUNT,
  petsAllowed: false,
  smokingAllowed: false,
  checkinTime: "14:00",
  checkoutTime: "11:00",
  availableLanguage: ["English", "Hindi", "Khasi"],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
    { "@type": "LocationFeatureSpecification", name: "Banquet Hall", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Room Service", value: true },
    { "@type": "LocationFeatureSpecification", name: "Laundry Service", value: true },
    { "@type": "LocationFeatureSpecification", name: "24-hour Front Desk", value: true },
    { "@type": "LocationFeatureSpecification", name: "Travel Desk", value: true },
    { "@type": "LocationFeatureSpecification", name: "Family Rooms", value: true },
  ],
  containsPlace: [
    {
      "@type": "Restaurant",
      "@id": `${SITE_URL}/dine#restaurant`,
      name: "Dopwai Rooftop Restaurant",
      url: `${SITE_URL}/dine`,
    },
    {
      "@type": "BarOrPub",
      "@id": `${SITE_URL}/klong#bar`,
      name: "Klong Lounge",
      url: `${SITE_URL}/klong`,
    },
    {
      "@type": "EventVenue",
      "@id": `${SITE_URL}/banquet#venue`,
      name: "Hotel Poinisuk Banquet Hall",
      url: `${SITE_URL}/banquet`,
    },
  ],
  openingHoursSpecification: HOTEL_OPENING_HOURS,
  isAccessibleForFree: false,
  publicAccess: true,
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: RESERVATION_URL,
      inLanguage: SITE_LANG,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "LodgingReservation",
      name: "Hotel Poinisuk Reservation",
    },
  },
  tourBookingPage: RESERVATION_URL,
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
  ...(AGGREGATE_RATING && AGGREGATE_REVIEW_COUNT
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: AGGREGATE_RATING,
          reviewCount: AGGREGATE_REVIEW_COUNT,
          bestRating: "5",
          worstRating: "1",
        },
      }
    : {}),
};

/**
 * LocalBusiness duplicate of the Hotel — improves local-pack rendering on
 * Google Maps / "hotels near me" queries. Schema.org allows both types to
 * coexist when you really are a hotel that is also a local business.
 */
export const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "LodgingBusiness"],
  "@id": `${SITE_URL}#localbusiness`,
  name: SITE_NAME,
  image: `${SITE_URL}/images/og/home-hero.jpg`,
  logo: `${SITE_URL}/images/logo1.png`,
  url: SITE_URL,
  telephone: CONTACT_INFO.phone,
  email: CONTACT_INFO.email,
  address: POSTAL_ADDRESS,
  geo: GEO_COORDS,
  hasMap: "https://www.google.com/maps?q=Hotel+Poinisuk+Shillong",
  openingHoursSpecification: HOTEL_OPENING_HOURS,
  priceRange: "₹₹–₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
};

/**
 * Restaurant — Dopwai. Eligible for Restaurant rich-result with menu / hours /
 * reservation action. Mirrors the structure that Taj Falaknuma and Oberoi
 * Wildflower Hall use for their signature restaurants.
 */
export const RESTAURANT_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/dine#restaurant`,
  name: "Dopwai Rooftop Restaurant",
  alternateName: "Dopwái",
  url: `${SITE_URL}/dine`,
  description:
    "Dopwai rooftop restaurant at Hotel Poinisuk — Indian, Asian, and Italian cuisine with panoramic Shillong views, live music, and curated beverages.",
  image: [
    `${SITE_URL}/images/og/dine.jpg`,
    `${SITE_URL}/images/dine/dine5.jpg`,
    `${SITE_URL}/images/dine/dine3.jpg`,
    `${SITE_URL}/images/dine/dine11.jpeg`,
    `${SITE_URL}/images/dine/masthead2.jpeg`,
    `${SITE_URL}/images/dine/dinemasthead.png`,
  ],
  servesCuisine: ["Indian", "Asian", "Italian", "Continental"],
  acceptsReservations: true,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI"],
  smokingAllowed: false,
  hasMenu: `${SITE_URL}/dine#menu`,
  address: POSTAL_ADDRESS,
  geo: GEO_COORDS,
  telephone: CONTACT_INFO.phone,
  containedInPlace: { "@id": `${SITE_URL}#hotel` },
  openingHoursSpecification: RESTAURANT_OPENING_HOURS,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Rooftop Seating", value: true },
    { "@type": "LocationFeatureSpecification", name: "Live Music", value: true },
    { "@type": "LocationFeatureSpecification", name: "Family Friendly", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wheelchair Accessible", value: true },
  ],
};

/**
 * BarOrPub — Klong Lounge. New: the Klong page previously had no schema.
 */
export const BAR_LD = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "@id": `${SITE_URL}/klong#bar`,
  name: "Klong Lounge",
  alternateName: "Klong",
  url: `${SITE_URL}/klong`,
  description:
    "Klong Lounge at Hotel Poinisuk, Shillong — handcrafted cocktails, mocktail shooters inspired by the Khasi tradition of Um Klong, live music, karaoke, and a relaxed atmosphere.",
  image: [
    `${SITE_URL}/images/og/klong.jpg`,
    `${SITE_URL}/images/bar/klong-sign.png`,
  ],
  servesCuisine: ["Cocktails", "Mocktails", "Bar Food"],
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI"],
  smokingAllowed: false,
  address: POSTAL_ADDRESS,
  geo: GEO_COORDS,
  telephone: CONTACT_INFO.phone,
  containedInPlace: { "@id": `${SITE_URL}#hotel` },
  openingHoursSpecification: BAR_OPENING_HOURS,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Live Music", value: true },
    { "@type": "LocationFeatureSpecification", name: "Karaoke", value: true },
    { "@type": "LocationFeatureSpecification", name: "Cocktail Bar", value: true },
  ],
};

/**
 * EventVenue — Banquet Hall. Replaces the previous generic `Service` entry.
 * Eligible for `Event` rich-results when paired with EventListing schema.
 */
export const BANQUET_VENUE_LD = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "@id": `${SITE_URL}/banquet#venue`,
  name: "Hotel Poinisuk Banquet Hall",
  url: `${SITE_URL}/banquet`,
  description:
    "Elegant banquet hall at Hotel Poinisuk in Shillong — capacity up to 200 guests for weddings, receptions, corporate events, and conferences. Curated multi-cuisine catering by Dopwai, AV/DJ/karaoke, and decor support.",
  image: [
    `${SITE_URL}/images/og/banquet.jpg`,
  ],
  address: POSTAL_ADDRESS,
  geo: GEO_COORDS,
  telephone: CONTACT_INFO.phone,
  maximumAttendeeCapacity: 200,
  containedInPlace: { "@id": `${SITE_URL}#hotel` },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "AV Equipment", value: true },
    { "@type": "LocationFeatureSpecification", name: "DJ / Karaoke", value: true },
    { "@type": "LocationFeatureSpecification", name: "Catering", value: true },
    { "@type": "LocationFeatureSpecification", name: "Decor Support", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wedding Friendly", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wheelchair Accessible", value: true },
  ],
};

// Backward compatibility — keep the old export name for any imports we may have
// missed. New code should reference BANQUET_VENUE_LD.
export const BANQUET_SERVICE_LD = BANQUET_VENUE_LD;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Generators (per-page dynamic schema)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a HotelRoom schema for one room category.
 * Use on `/rooms` and `/rooms/[slug]` pages so each room is a first-class
 * entity that can appear in Google's room-listing carousel.
 */
export function makeHotelRoomLd(args: {
  slug: string;
  name: string;
  description: string;
  images: string[];
  bed: string;
  occupancy: number;
  floorSize?: string; // e.g. "216 sq.ft."
  amenityNames: string[];
}) {
  const url = `${SITE_URL}/rooms/${args.slug}`;
  // Try to extract a number from "216 sq.ft." -> 216 sq ft
  const floorSizeValue = args.floorSize?.match(/(\d+(?:\.\d+)?)/)?.[1];

  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${url}#room`,
    name: args.name,
    description: args.description,
    url,
    image: args.images.map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`
    ),
    containedInPlace: { "@id": `${SITE_URL}#hotel` },
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: args.occupancy,
      unitCode: "C62", // UN/CEFACT code for "one"
    },
    bed: { "@type": "BedDetails", typeOfBed: args.bed, numberOfBeds: 1 },
    ...(floorSizeValue && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: floorSizeValue,
        unitCode: "FTK", // square feet
      },
    }),
    amenityFeature: args.amenityNames.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: RESERVATION_URL,
        inLanguage: SITE_LANG,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };
}

/**
 * FAQ schema — used on Home + any page with an FAQ block.
 */
export function makeFaqLd(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * AboutPage / ContactPage / WebPage schema — useful if you want a specific
 * `@type` on auxiliary pages (helps Google understand intent).
 */
export function makeWebPageLd(args: {
  type?: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  url: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": args.type || "WebPage",
    name: args.name,
    url: args.url,
    ...(args.description && { description: args.description }),
    isPartOf: { "@id": `${SITE_URL}#website` },
    inLanguage: SITE_LANG,
    publisher: { "@id": `${SITE_URL}#organization` },
  };
}
