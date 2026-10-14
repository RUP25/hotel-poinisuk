export type RoomAmenityKey =
  | "cityView"
  | "airConditioning"
  | "flatScreenTv"
  | "teaCoffee"
  | "wifi"
  | "telephone"
  | "desk"
  | "laundry"
  | "bathtub";

export type RoomCatalogItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  amenities: RoomAmenityKey[];
  policies: string[];
  sleeps: number;
  bed: string;
  hasAC: boolean;
  hasWindow: boolean;
  floorSize: string;
};

export const ROOM_CATALOG: RoomCatalogItem[] = [
  {
    slug: "premium-ac",
    title: "Premium Air Conditioned Rooms",
    subtitle: "Ideal for Families",
    description:
      "Our Premium rooms (216 sq.ft.) offer spacious comfort with modern conveniences, including a flat-screen TV, tea and coffee maker, complimentary Wi-Fi, telephone, writing desk with lamp, and a well-stocked minibar.",
    images: ["/images/rooms/PremiumAC.jpg", "/images/rooms/premium-bath.jpg", "/images/rooms/premium-bedroom.jpg"],
    amenities: [
      "cityView",
      "airConditioning",
      "flatScreenTv",
      "teaCoffee",
      "wifi",
      "telephone",
      "desk",
      "laundry",
      "bathtub",
    ],
    policies: [
      "Occupancy: up to 4 occupants; extra beds available on request (chargeable).",
      "Includes flat-screen TV, tea and coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP and CP.",
      "Safety locker, bathtub, and individual geyser provided.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries and hair dryer; centralized hot and cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 King Bed",
    hasAC: true,
    hasWindow: true,
    floorSize: "216 sq.ft.",
  },
  {
    slug: "deluxe-ac",
    title: "Deluxe Air Conditioned Rooms (No Window)",
    subtitle: "Ideal for Couples or Trios",
    description:
      "Our Deluxe AC rooms (128 sq.ft., no window) blend modern comforts with a flat-screen TV, tea and coffee maker, complimentary Wi-Fi, telephone, writing desk with lamp, and minibar option.",
    images: ["/images/rooms/DeluxeANW.jpeg", "/images/rooms/ENONAC1.webp", "/images/rooms/bath4.png"],
    amenities: ["airConditioning", "flatScreenTv", "teaCoffee", "wifi", "telephone", "desk"],
    policies: [
      "Occupancy: up to 3 occupants; extra bed available on request (chargeable).",
      "Includes flat-screen TV, tea and coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP and CP.",
      "Standard shower (no bathtub).",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries and hair dryer; centralized hot and cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 Queen Bed",
    hasAC: true,
    hasWindow: false,
    floorSize: "128 sq.ft.",
  },
  {
    slug: "deluxe-nonac",
    title: "Deluxe Non-AC Rooms (Twin)",
    subtitle: "Ideal for Twin Travelers",
    description:
      "Our Deluxe Non-AC rooms (approx. 227 sq.ft.) provide a quiet retreat with modern essentials, including flat-screen TV, tea and coffee maker, complimentary Wi-Fi, telephone, and writing desk with lamp.",
    images: ["/images/rooms/deluxe-twin-bath.jpg", "/images/rooms/deluxeTB.jpg", "/images/rooms/deluxe-twin-bedroom.jpg"],
    amenities: ["flatScreenTv", "teaCoffee", "wifi", "telephone", "desk"],
    policies: [
      "Occupancy: up to 3 occupants; extra bed available on request (chargeable).",
      "Includes flat-screen TV, tea and coffee maker, Wi-Fi, telephone, writing desk with lamp; minibar at extra charge.",
      "Plan options: EP and CP.",
      "Standard shower.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries and hair dryer; centralized hot and cold water 24/7.",
    ],
    sleeps: 3,
    bed: "2 Single Beds",
    hasAC: false,
    hasWindow: true,
    floorSize: "227 sq.ft.",
  },
  {
    slug: "executive-nonac",
    title: "Executive Non-AC Rooms",
    subtitle: "Ideal for Budget Travelers",
    description:
      "Our Executive Non-AC rooms (166 sq.ft.) offer city outlooks with flat-screen TV, tea and coffee maker, complimentary Wi-Fi, telephone, and writing desk with lamp.",
    images: ["/images/rooms/ExecutiveNonAc.jpg", "/images/rooms/NW1.jpg", "/images/rooms/bath4.png"],
    amenities: ["cityView", "flatScreenTv", "teaCoffee", "wifi", "telephone", "desk"],
    policies: [
      "Occupancy: up to 2 occupants; no extra beds available.",
      "Includes flat-screen TV, tea and coffee maker, Wi-Fi, telephone, writing desk with lamp.",
      "Plan options: EP and CP.",
      "Shower only.",
      "In-room dining last order by 10:00 pm.",
      "Bathroom amenities: toiletries and hair dryer; centralized hot and cold water 24/7.",
    ],
    sleeps: 2,
    bed: "1 Queen Bed",
    hasAC: false,
    hasWindow: true,
    floorSize: "166 sq.ft.",
  },
];

export function getRoomBySlug(slug: string) {
  return ROOM_CATALOG.find((room) => room.slug === slug);
}
