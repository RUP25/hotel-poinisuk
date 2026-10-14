import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";
import Footer from "@/components/Footer";
import Seo from "@/components/seo";
import { ROOM_CATALOG, getRoomBySlug, type RoomAmenityKey } from "@/lib/room-catalog";
import { SITE_NAME, makeHotelRoomLd } from "@/lib/seo";

const AMENITY_LABELS: Record<RoomAmenityKey, string> = {
  cityView: "City View",
  airConditioning: "Air Conditioning",
  flatScreenTv: "Flat-Screen TV",
  teaCoffee: "Tea / Coffee Maker",
  wifi: "Free Wi-Fi",
  telephone: "Telephone",
  desk: "Writing Desk",
  laundry: "Laundry Service",
  bathtub: "Bathtub",
};

type RoomPageProps = {
  room: NonNullable<ReturnType<typeof getRoomBySlug>>;
};

const BOOKING_URL =
  "https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg=";

const RoomDetailPage: NextPageWithSeo<InferGetStaticPropsType<typeof getStaticProps>> = ({ room }) => {
  const roomSeo = buildRoomSeo(room);

  return (
    <>
      <Seo
        pageName={roomSeo.title}
        description={roomSeo.description}
        ogImage={roomSeo.ogImage}
        keywords={roomSeo.keywords}
        schema={roomSeo.schema}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ mb: 3 }}>
          <Button component={Link} href="/rooms" variant="text" sx={{ pl: 0 }}>
            Back to all rooms
          </Button>
        </Box>

        <Typography component="h1" variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {room.title}
        </Typography>
        <Typography component="p" color="text.secondary" sx={{ mb: 3 }}>
          {room.subtitle}
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Image src={room.images[0]} alt={room.title} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          <Chip label={`Sleeps ${room.sleeps}`} />
          <Chip label={room.bed} />
          <Chip label={room.hasAC ? "Air conditioned" : "Non-AC"} />
          <Chip label={room.hasWindow ? "Window room" : "No window"} />
          <Chip label={room.floorSize} />
        </Box>

        <Typography component="p" sx={{ mb: 3 }}>
          {room.description}
        </Typography>

        <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Room Policies
        </Typography>
        <Box sx={{ display: "grid", gap: 1, mb: 4 }}>
          {room.policies.map((policy) => (
            <Typography key={policy} component="p" color="text.secondary">
              - {policy}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button component={Link} href="/booking" variant="outlined">
            Go to booking page
          </Button>
          <Button
            component="a"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            sx={{ "&:hover": { bgcolor: "#76046b" } }}
          >
            Book this room
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ROOM_CATALOG.map((room) => ({ params: { slug: room.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<RoomPageProps> = async ({ params }) => {
  const slug = String(params?.slug || "");
  const room = getRoomBySlug(slug);

  if (!room) {
    return { notFound: true };
  }

  return {
    props: {
      room,
    },
  };
};

export default RoomDetailPage;

export function buildRoomSeo(room: RoomPageProps["room"]) {
  return {
    title: `Hotel in Shillong | ${room.title} | ${SITE_NAME}`,
    description: `${room.title} at ${SITE_NAME}, Shillong. ${room.description}`,
    ogImage: room.images[0],
    keywords: `${room.title}, hotel room in Shillong, ${SITE_NAME} rooms, Shillong accommodation`,
    schema: makeHotelRoomLd({
      slug: room.slug,
      name: room.title,
      description: room.description,
      images: room.images,
      bed: room.bed,
      occupancy: room.sleeps,
      floorSize: room.floorSize,
      amenityNames: room.amenities.map((key) => AMENITY_LABELS[key]),
    }),
  };
}
