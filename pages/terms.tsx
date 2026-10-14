// pages/terms.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Container, Typography, GlobalStyles } from "@mui/material";
import Footer from "@/components/Footer";
import type { NextPageWithSeo } from "@/types/next-page-with-seo";

/* ────────── brand typography ────────── */
const cormorant = "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
const cinzel = "var(--font-cinzel), 'Trajan Pro', 'Georgia', 'Times New Roman', serif";

/* Reusable purple-diamond bullet list */
const PolicyList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    component="ul"
    sx={{
      listStyle: "none",
      m: 0,
      p: 0,
      display: "flex",
      flexDirection: "column",
      gap: 1.1,
      "& li": {
        fontFamily: cormorant,
        color: "#3f2a2a",
        fontSize: { xs: "1rem", md: "1.06rem" },
        lineHeight: 1.75,
        pl: "1.7em",
        position: "relative",
      },
      "& li::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "0.65em",
        width: 6,
        height: 6,
        bgcolor: "#5f02ab",
        transform: "rotate(45deg)",
      },
      "& li strong": { color: "#320953", fontWeight: 700 },
    }}
  >
    {children}
  </Box>
);

/* Policy "card" wrapper — animates into view */
const PolicySection: React.FC<{
  heading: string;
  index: number;
  children: React.ReactNode;
}> = ({ heading, index, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        background:
          "linear-gradient(180deg, #ffffff 0%, #faf8f4 100%)",
        border: "1px solid rgba(50,9,83,0.08)",
        borderRadius: "12px",
        boxShadow:
          "0 1px 2px rgba(50,9,83,0.04), 0 6px 14px rgba(50,9,83,0.06), 0 18px 36px rgba(50,9,83,0.08)",
        px: { xs: 2.6, sm: 3.4, md: 4.4 },
        py: { xs: 3, sm: 3.4, md: 4 },
        mb: { xs: 3, md: 4 },
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 850ms cubic-bezier(.2,.7,.2,1) ${index * 90}ms, transform 850ms cubic-bezier(.2,.7,.2,1) ${index * 90}ms, box-shadow 420ms ease, border-color 320ms ease`,
        "&:hover": {
          boxShadow:
            "0 2px 4px rgba(50,9,83,0.06), 0 12px 24px rgba(50,9,83,0.10), 0 28px 52px rgba(50,9,83,0.14)",
          borderColor: "rgba(95,2,171,0.20)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: 4,
        },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: cinzel,
          fontWeight: 700,
          color: "#320953",
          fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.45rem" },
          letterSpacing: { xs: "0.06em", md: "0.08em" },
          lineHeight: 1.25,
          mb: 1.2,
        }}
      >
        {heading}
      </Typography>

      {/* Divider with diamond */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2.4 }}>
        <Box
          sx={{
            height: "1px",
            width: { xs: 40, md: 60 },
            background:
              "linear-gradient(90deg, #5f02ab 0%, rgba(95,2,171,0) 100%)",
          }}
        />
        <Box
          sx={{
            width: 7,
            height: 7,
            bgcolor: "#5f02ab",
            transform: "rotate(45deg)",
          }}
        />
      </Box>

      {children}
    </Box>
  );
};

const TermsPage: NextPageWithSeo = () => {
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setParallaxY(window.scrollY * 0.28);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <GlobalStyles
        styles={{
          "*,*::before,*::after": { boxSizing: "border-box" },
          body: { margin: 0, overflowX: "hidden" },
        }}
      />

      <Box
        sx={{
          bgcolor: "#faf6ef",
          "@keyframes cormorantRise": {
            "0%": {
              opacity: 0,
              transform: "translateY(22px) scale(0.985)",
              filter: "blur(6px)",
            },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          },
          "@keyframes dividerGrow": {
            "0%": { transform: "scaleX(0)", opacity: 0 },
            "100%": { transform: "scaleX(1)", opacity: 1 },
          },
          "@keyframes diamondPop": {
            "0%": { transform: "rotate(0deg) scale(0)", opacity: 0 },
            "70%": { transform: "rotate(45deg) scale(1.3)", opacity: 1 },
            "100%": { transform: "rotate(45deg) scale(1)", opacity: 1 },
          },
          "@keyframes silkVeil": {
            "0%": { transform: "translate(-40%, -10%) rotate(-12deg)", opacity: 0 },
            "20%": { opacity: 0.55 },
            "80%": { opacity: 0.4 },
            "100%": { transform: "translate(140%, 18%) rotate(-12deg)", opacity: 0 },
          },
        }}
      >
        {/* ───────────── HERO (compact — content focus) ───────────── */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: "58vh", sm: "62vh", md: "68vh" },
            overflow: "hidden",
            bgcolor: "#05070b",
          }}
        >
          {/* Parallax background photo */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              willChange: "transform",
              transform: `translateY(${parallaxY}px)`,
              transition: "transform 90ms linear",
            }}
          >
            <Image
              src="/images/image6.webp"
              alt="Hotel Poinisuk panoramic view"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center 35%",
                filter: "brightness(0.78) contrast(1.10) saturate(1.02)",
              }}
            />
          </Box>

          {/* Night-tone gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,11,0.46) 0%, rgba(8,6,18,0.30) 35%, rgba(20,8,40,0.36) 70%, rgba(5,4,16,0.55) 100%)",
            }}
          />

          {/* Vignette */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.40) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Single subtle silken light veil — Terms signature (calm, formal) */}
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              left: 0,
              width: { xs: "75%", md: "55%" },
              height: "60%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(214,196,255,0.18) 35%, rgba(214,196,255,0.28) 50%, rgba(214,196,255,0.18) 65%, rgba(255,255,255,0) 100%)",
              filter: "blur(28px)",
              animation: "silkVeil 32s ease-in-out infinite",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />

          {/* Hero content */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "58vh", sm: "62vh", md: "68vh" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 14, sm: 16, md: 18 },
              pb: { xs: 4, sm: 5, md: 6 },
              zIndex: 2,
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 500,
                color: "#fff",
                fontSize: {
                  xs: "2.2rem",
                  sm: "3rem",
                  md: "4rem",
                  lg: "4.6rem",
                },
                lineHeight: 1,
                letterSpacing: "0.005em",
                textShadow:
                  "0 4px 30px rgba(50,9,83,0.55), 0 2px 6px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1100ms cubic-bezier(.2,.7,.2,1) 200ms both",
              }}
            >
              Terms &amp; Conditions
            </Typography>

            {/* Divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1.2, sm: 1.4, md: 1.6 },
                mt: { xs: 1.4, sm: 1.8, md: 2.4 },
                mb: { xs: 1.4, sm: 1.6, md: 2 },
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)",
                  transformOrigin: "right center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
                }}
              />
              <Box sx={{ position: "relative", width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 } }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "#caa6ff",
                    boxShadow: "0 0 14px rgba(202,166,255,0.85)",
                    animation:
                      "diamondPop 600ms cubic-bezier(.2,.7,.2,1) 1200ms both",
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "1px",
                  width: { xs: 44, sm: 72, md: 100 },
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
                  transformOrigin: "left center",
                  animation:
                    "dividerGrow 800ms cubic-bezier(.2,.7,.2,1) 800ms both",
                }}
              />
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: cormorant,
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: "0.98rem", sm: "1.15rem", md: "1.32rem" },
                lineHeight: 1.45,
                letterSpacing: "0.01em",
                maxWidth: 760,
                textShadow: "0 2px 14px rgba(0,0,0,0.4)",
                animation:
                  "cormorantRise 1000ms cubic-bezier(.2,.7,.2,1) 1300ms both",
              }}
            >
              Please review our terms, cancellation policies, and important information before
              booking your stay at Hotel Poinisuk.
            </Typography>
          </Box>
        </Box>

        {/* ───────────── CONTENT ───────────── */}
        <Box
          sx={{
            position: "relative",
            py: { xs: 6, md: 9 },
            px: { xs: 2, md: 3 },
            bgcolor: "#faf6ef",
            overflow: "hidden",
          }}
        >
          {/* Soft top ambient glow */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(202,166,255,0.16) 0%, rgba(202,166,255,0) 50%)",
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="md" sx={{ position: "relative" }}>
            {/* Cancellation Policy - Individuals */}
            <PolicySection
              heading="Cancellation for Individuals / Normal Rooms & Refund"
              index={0}
            >
              <PolicyList>
                <li>Before <strong>10 days</strong> prior: No cancellation charges and full refund.</li>
                <li>Before <strong>72 hours</strong>: <strong>25%</strong> charge, <strong>75%</strong> refunded.</li>
                <li>Before <strong>48 hours</strong>: <strong>50%</strong> charge, <strong>50%</strong> refunded.</li>
                <li>Before <strong>24 hours</strong>: <strong>100%</strong> charge, no refund.</li>
              </PolicyList>
            </PolicySection>

            {/* Cancellation Policy - Groups */}
            <PolicySection heading="Cancellation for Group Booking & Refund" index={1}>
              <PolicyList>
                <li>Before <strong>20 days</strong>: No charges and full refund.</li>
                <li>Before <strong>15 days</strong>: <strong>20%</strong> charge, <strong>80%</strong> refunded.</li>
                <li>Before <strong>7 days</strong>: <strong>50%</strong> charge, <strong>50%</strong> refunded.</li>
                <li>After <strong>7 days</strong>: <strong>100%</strong> charge, no refund.</li>
              </PolicyList>
            </PolicySection>

            {/* General Terms */}
            <PolicySection heading="General Terms & Conditions" index={2}>
              <PolicyList>
                <li>Check-in: <strong>14:00 hrs</strong> | Check-out: <strong>12:00 Noon</strong>.</li>
                <li>Early check-in or late check-out subject to availability; late checkout may incur charges.</li>
                <li>All dues must be settled before check-in date; non-payment will be billed at check-out.</li>
                <li>Children above <strong>8 years</strong> charged as extra adult (meal plan applies).</li>
              </PolicyList>
            </PolicySection>

            {/* Special Instructions */}
            <PolicySection heading="Special Instructions (ID Proof Required)" index={3}>
              <Typography
                sx={{
                  fontFamily: cormorant,
                  color: "#3f2a2a",
                  fontSize: { xs: "1rem", md: "1.06rem" },
                  lineHeight: 1.8,
                  "& strong": { color: "#320953", fontWeight: 700 },
                }}
              >
                As per Government norms, it is mandatory for all guests (Foreign Nationals, NRI&apos;s, and Indian Nationals)
                to present a valid photo ID with address proof at the time of check-in. <strong>PAN Card is not a valid ID</strong>.
              </Typography>
            </PolicySection>

            {/* House Rules */}
            <PolicySection heading="House Rules & Information" index={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.4 }}>
                {[
                  {
                    title: "Must Read Rules",
                    items: (
                      <>
                        <li>Primary guest must be at least <strong>18 years</strong> of age.</li>
                        <li><strong>Passport, Aadhaar, Driving License, Govt. ID</strong> accepted.</li>
                        <li><strong>Pets</strong> and <strong>outside food</strong> are not allowed.</li>
                      </>
                    ),
                  },
                  {
                    title: "Guest Profile",
                    items: (
                      <>
                        <li>Unmarried couples allowed.</li>
                        <li>Groups of only male guests not allowed.</li>
                      </>
                    ),
                  },
                  {
                    title: "Smoking / Alcohol Rules",
                    items: (
                      <>
                        <li>No restrictions on alcohol consumption.</li>
                        <li>Smoking allowed in designated areas.</li>
                      </>
                    ),
                  },
                  {
                    title: "Child & Extra Bed Policy",
                    items: (
                      <>
                        <li>Extra bed/mattress available (subject to availability).</li>
                        <li>Charge per extra bed or mattress: <strong>INR 1500</strong>.</li>
                      </>
                    ),
                  },
                ].map((sub) => (
                  <Box key={sub.title}>
                    <Typography
                      sx={{
                        fontFamily: cinzel,
                        fontWeight: 600,
                        color: "#5f02ab",
                        letterSpacing: "0.18em",
                        fontSize: { xs: "0.78rem", md: "0.85rem" },
                        mb: 1.2,
                        textTransform: "uppercase",
                      }}
                    >
                      {sub.title}
                    </Typography>
                    <PolicyList>{sub.items}</PolicyList>
                  </Box>
                ))}
              </Box>
            </PolicySection>

            {/* Disclaimer Section */}
            <PolicySection heading="Disclaimer Policy" index={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.6,
                  "& p": {
                    fontFamily: cormorant,
                    color: "#3f2a2a",
                    fontSize: { xs: "1rem", md: "1.06rem" },
                    lineHeight: 1.8,
                    m: 0,
                  },
                  "& p strong": { color: "#320953", fontWeight: 700 },
                }}
              >
                <Typography component="p">
                  The information contained in this website is for general information purposes only.
                  The information is provided by <strong>Hotel Poinisuk</strong> and while we endeavor to
                  keep the information up to date and correct, we make no representations or warranties
                  of any kind, express or implied, about the completeness, accuracy, reliability,
                  suitability or availability with respect to the website or the information, products,
                  services, or related graphics contained on the website for any purpose.
                  Any reliance you place on such information is therefore strictly at your own risk.
                </Typography>

                <Typography component="p">
                  In no event will we be liable for any loss or damage including without limitation,
                  indirect or consequential loss or damage, or any loss or damage whatsoever arising
                  from loss of data or profits arise out of, or in connection with, the use of this website.
                </Typography>

                <Typography component="p">
                  Through this website you are able to link to other websites which are not under
                  the control of <strong>Hotel Poinisuk</strong>. We have no control over the nature,
                  content and availability of those sites. The inclusion of any links does not necessarily
                  imply a recommendation or endorse the views expressed within them.
                </Typography>

                <Typography component="p">
                  Every effort is made to keep the website up and running smoothly. However,
                  <strong> Hotel Poinisuk</strong> takes no responsibility for, and will not be liable for,
                  the website being temporarily unavailable due to technical issues beyond our control.
                </Typography>
              </Box>
            </PolicySection>

            {/* Contact Section */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px dashed rgba(95,2,171,0.22)",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: cormorant,
                  fontStyle: "italic",
                  color: "#5f02ab",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.7,
                }}
              >
                For any clarification or assistance, please contact our reservations team.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </main>
  );
};

TermsPage.seo = {
  title: "Terms & Conditions",
  description:
    "Hotel Poinisuk terms & conditions, cancellation policies, house rules, and important information. Review before booking your stay in Shillong.",
  keywords:
    "Hotel Poinisuk terms, cancellation policy, hotel booking terms, Shillong hotel policies",
  ogImage: "/images/og/terms.jpg",
  noindex: false,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions — Hotel Poinisuk",
    url: "https://www.hotelpoinisuk.com/terms",
    description:
      "Hotel Poinisuk terms & conditions, cancellation policies, and house rules.",
    isPartOf: { "@id": "https://www.hotelpoinisuk.com#website" },
    about: { "@id": "https://www.hotelpoinisuk.com#hotel" },
    inLanguage: "en-IN",
  },
};

export default TermsPage;
