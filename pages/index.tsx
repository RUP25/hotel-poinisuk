import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import "../styles/globals.css";

const Home: React.FC = () => {
  return (
    <main>
      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "90vh", width: "100%" }}>
        <Image src="/images/hero.jpg" alt="Hotel Poinisuk" layout="fill" objectFit="cover" priority />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            px: 2
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>Hotel Poinisuk</Typography>
          <Typography variant="h5" gutterBottom>Mesmerizing views & modern comfort in the heart of Shillong</Typography>
          <Link href="#welcome" passHref>
            <Button variant="contained" sx={{ mt: 2, bgcolor: "white", color: "black" }}>Explore Our Property</Button>
          </Link>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Box id="welcome" sx={{ py: 10, bgcolor: "#f5f5f5" }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} component="div">
              <Image src="/images/welcome.jpg" alt="Welcome" width={600} height={400} style={{ borderRadius: 8 }} />
            </Grid>
            <Grid item xs={12} md={6} component="div">
              <Typography variant="h4" gutterBottom>Welcome to Hotel Poinisuk</Typography>
              <Typography paragraph>
                Located on Lady Veronica Lane, our hotel offers stunning views, well-appointed rooms, and easy access to Shillong's top attractions.
              </Typography>
              <Link href="#rooms" passHref>
                <Button variant="contained" sx={{ bgcolor: "#2e7d32" }}>View Rooms</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Rooms Section */}
      <Box id="rooms" sx={{ py: 10 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>Our Rooms</Typography>
          <Grid container spacing={4}>
            {["Executive Room", "Deluxe Room", "Premium Room"].map((room, i) => (
              <Grid item xs={12} md={4} component="div" key={i}>
                <Card>
                  <CardMedia component="img" image={`/images/room${i + 1}.jpg`} height="200" alt={room} />
                  <CardContent>
                    <Typography variant="h6">{room}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Spacious {room.toLowerCase()} with flat-screen TV, Wi-Fi, tea/coffee maker, and writing desk. Deluxe & Premium include a mini-bar.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Dining Section */}
      <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>Food & Dining</Typography>
          <Grid container spacing={4}>
            {[
              { name: "Dopwai (Rooftop Resto)", desc: "Multi-cuisine restaurant with Indian, Asian, and Italian dishes.", img: "dopwai.jpg" },
              { name: "Dejavu Café (500m)", desc: "Asian, Cantonese, and Chinese cuisine just a short walk away.", img: "dejavu.jpg" },
              { name: "Munchies Shillong (300m)", desc: "Italian and American flavors served nearby.", img: "munchies.jpg" }
            ].map(({ name, desc, img }, i) => (
              <Grid item xs={12} md={4} component="div" key={i}>
                <Card>
                  <CardMedia component="img" image={`/images/${img}`} height="200" alt={name} />
                  <CardContent>
                    <Typography variant="h6">{name}</Typography>
                    <Typography variant="body2" color="text.secondary">{desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Attractions Section */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>Nearby Attractions</Typography>
          <Grid container spacing={4}>
            {["Cathedral of Mary", "Ward's Lake", "Lady Hydari Park", "Don Bosco Museum", "Spread Eagle Falls", "Wankhar Museum"].map((spot, i) => (
              <Grid item xs={12} md={4} component="div" key={i}>
                <Card>
                  <CardMedia component="img" image={`/images/attraction${i + 1}.jpg`} height="200" alt={spot} />
                  <CardContent>
                    <Typography variant="h6">{spot}</Typography>
                    <Typography variant="body2" color="text.secondary">Discover this nearby attraction within 0.5–5 km from the hotel.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Facilities Section */}
      <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>Events & Facilities</Typography>
          <Grid container spacing={4}>
            {["Banquet Hall for 200 guests – weddings & receptions", "Conference room & business centre for corporate use", "In-house Pub, Karaoke, DJ nights & Live Band"].map((facility, i) => (
              <Grid item xs={12} md={4} component="div" key={i}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{facility.split("–")[0]}</Typography>
                    <Typography variant="body2" color="text.secondary">{facility.split("–")[1]}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </main>
  );
};

export default Home;
