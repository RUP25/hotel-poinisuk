// pages/terms.tsx
import React from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Divider,
} from "@mui/material";
import Footer from "@/components/Footer";

const APP_BAR_H = { xs: 90, sm: 120, md: 150 }; // keep aligned with your layout

const TermsPage: React.FC = () => {
  return (
    <main>
      <Head>
        <title>Terms & Conditions | Hotel Poinisuk</title>
        <meta
          name="description"
          content="Hotel Poinisuk — Terms & Conditions, cancellation policies, house rules, and important guest information."
        />
      </Head>

      {/* ───────── Masthead (same as About) ───────── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: "28vh", sm: "29vh", md: "32vh", lg: "42vh" },
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), radial-gradient(80% 60% at 50% 40%, #5e5e5e 0%, #444 35%, #2b2b2b 100%)",
        }}
      >
        {/* Background Image */}
        <Box sx={{ position: "absolute", inset: 0 }}>
          <Image
            className="kb-img"
            src="/images/image6.webp"
            alt="Hotel Poinisuk — panoramic view"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
            onError={(e) => {
              (e.currentTarget as any).style.display = "none";
            }}
          />
        </Box>

        {/* Ken Burns */}
        <style>{`
          .kb-img { transform-origin: center; animation: kenburns 12s ease-in-out infinite alternate; }
          @media (prefers-reduced-motion: reduce) { .kb-img { animation: none !important; } }
          @keyframes kenburns {
            0% { transform: scale(1) }
            100% { transform: scale(1.08) translate(-1.5%,-1.5%) }
          }
        `}</style>

        {/* Overlay */}
        <Box aria-hidden sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.28)" }} />

        {/* Headline */}
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            textAlign: "center",
            px: { xs: 1, sm: 2, md: 2 },
            pt: {
              xs: `${APP_BAR_H.xs + 12}px`,
              sm: `${APP_BAR_H.sm + 14}px`,
              md: `${APP_BAR_H.md + 18}px`,
            },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                textShadow: "0 6px 28px rgba(0,0,0,0.45)",
                fontSize: { xs: "1.2rem", sm: "2.3rem", md: "2.6rem", lg: "3rem" },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              Terms & Conditions
            </Typography>
            <Typography
              sx={{
                opacity: 0.95,
                textShadow: "0 4px 16px rgba(0,0,0,0.45)",
                fontSize: { xs: "0.7rem", sm: "1rem", md: "1.1rem" },
                mx: "auto",
                maxWidth: 760,
              }}
            >
              Please review our policies before booking your stay at Hotel Poinisuk.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ───────── Content ───────── */}
      <Container sx={{ py: { xs: 5, sm: 6, md: 8 }, maxWidth: "md" }}>
        {/* Cancellation — Individuals / Normal Rooms */}
        <Box sx={{ mb: 5 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 1 }}>
            Cancellation for Individuals / Normal Rooms
          </Typography>
          <Divider sx={{ width: 80, borderBottomWidth: 2, mb: 2 }} />
          <Box component="ul" sx={{ pl: 3, m: 0, lineHeight: 1.8, color: "text.secondary" }}>
            <li>Before <strong>10 days</strong> prior: <strong>No</strong> cancellation charges.</li>
            <li>Before <strong>72 hours</strong> of cancellation: <strong>25%</strong> of the payment amount will be charged.</li>
            <li>Before <strong>48 hours</strong> of cancellation: <strong>50%</strong> of the payment amount will be charged.</li>
            <li>Before <strong>24 hours</strong> of cancellation: <strong>100%</strong> retention charges will be charged.</li>
          </Box>
        </Box>

        {/* Cancellation — Group Booking */}
        <Box sx={{ mb: 5 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 1 }}>
            Cancellation for Group Booking
          </Typography>
          <Divider sx={{ width: 80, borderBottomWidth: 2, mb: 2 }} />
          <Box component="ul" sx={{ pl: 3, m: 0, lineHeight: 1.8, color: "text.secondary" }}>
            <li>Before <strong>20 days</strong> prior: <strong>No</strong> cancellation charges.</li>
            <li>Before <strong>15 days</strong> prior: <strong>20%</strong> cancellation charges will be applicable.</li>
            <li>Before <strong>7 days</strong> prior: <strong>50%</strong> cancellation charges will be applicable.</li>
            <li>After <strong>7 days</strong>: <strong>100%</strong> retention charges will be applicable.</li>
          </Box>
        </Box>

        {/* Terms & Conditions */}
        <Box sx={{ mb: 5 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 1 }}>
            General Terms & Conditions
          </Typography>
          <Divider sx={{ width: 80, borderBottomWidth: 2, mb: 2 }} />
          <Box component="ul" sx={{ pl: 3, m: 0, lineHeight: 1.8, color: "text.secondary" }}>
            <li>Check‑in time is <strong>14:00 hrs</strong> and check‑out time is <strong>12:00 Noon</strong>. Early check‑in/late check‑out are subject to availability; check‑out after <strong>13:00 hrs</strong> may incur extra charges.</li>
            <li>The net amount needs to be settled before the check‑in date. Non‑payment may be charged directly at the time of check‑out.</li>
            <li>No payment will be kept on a credit basis. If there are pending bills, future bookings will not be entertained until the previous bill is cleared.</li>
            <li>Children above <strong>08 years</strong> will be charged as an extra adult; meal plan charges apply accordingly.</li>
          </Box>
        </Box>

        {/* Special Instructions */}
        <Box sx={{ mb: 6 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 1 }}>
            Special Instructions (ID Proof Required)
          </Typography>
          <Divider sx={{ width: 80, borderBottomWidth: 2, mb: 2 }} />
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
            As per Government norms, it is mandatory for all guests (Foreign Nationals, NRI’s, and Indian Nationals) to present a valid photo ID with address proof at the time of check‑in. <strong>PAN Card is not a valid ID</strong> and cannot be accepted.
          </Typography>
        </Box>

        {/* House Rules & Information */}
        <Box sx={{ mb: 1 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 2 }}>
            House Rules & Information
          </Typography>

          {/* MUST READ RULES */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Must Read Rules</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li>Primary guest should be at least <strong>18 years</strong> of age.</li>
            <li><strong>Passport, Aadhaar, Driving License, and Govt. ID</strong> are accepted as ID proofs.</li>
            <li><strong>Pets are not allowed.</strong></li>
            <li><strong>Outside food is not allowed.</strong></li>
          </Box>

          {/* GUEST PROFILE */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Guest Profile</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li>Unmarried couples allowed.</li>
            <li>Primary guest should be at least <strong>18 years</strong> of age.</li>
            <li>Groups with only male guests are <strong>not allowed</strong> at this property.</li>
          </Box>

          {/* ID PROOF RELATED */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>ID Proof Related</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li><strong>Passport, Aadhaar, Driving License, and Govt. ID</strong> are accepted.</li>
          </Box>

          {/* SMOKING/ALCOHOL */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Smoking/Alcohol Consumption Rules</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li>There are <strong>no restrictions</strong> on alcohol consumption.</li>
            <li><strong>Smoking is allowed</strong> within the premises (in designated areas, where applicable).</li>
          </Box>

          {/* ACCESSIBILITY */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Property Accessibility</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li>This property is accessible to guests who use a wheelchair. Guests are requested to carry their own wheelchair.</li>
          </Box>

          {/* PETS */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Pet(s) Related</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li><strong>Pets are not allowed.</strong></li>
            <li>There are <strong>no pets</strong> living on the property.</li>
          </Box>

          {/* OTHER RULES */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Other Rules</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
            <li>Private parties or events are allowed (subject to prior approval and venue availability).</li>
            <li>Guests are requested <strong>not to invite outside visitors</strong> to the room during their stay.</li>
            <li><strong>Check‑in:</strong> 14:00 &nbsp;|&nbsp; <strong>Check‑out:</strong> 12:00</li>
          </Box>

          {/* CHILD & EXTRA BED POLICY */}
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Child & Extra Bed Policy</Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, color: "text.secondary", lineHeight: 1.8 }}>
            <li>An extra bed may be provided for any child included in the booking (subject to availability).</li>
            <li><strong>INR 1500</strong> will be charged for an extra mattress per child (to be paid at the property).</li>
            <li>An extra bed may be provided for any additional guest included in the booking (subject to availability).</li>
            <li><strong>INR 1500</strong> will be charged for an extra cot per guest (to be paid at the property).</li>
            <li><strong>INR 1500</strong> will be charged for an extra mattress per guest (to be paid at the property).</li>
          </Box>
        </Box>

        {/* Contact/help line */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ color: "text.secondary" }}>
            For any clarification or assistance, please contact our reservations team.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </main>
  );
};

export default TermsPage;
