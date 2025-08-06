// components/TopBar.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion, AnimatePresence } from 'framer-motion';
import HamburgerMenu from './HamburgerMenu'; // <== Import here

const TOP_BAR_HEIGHT = 48;

const barVariants = {
  hidden: { y: -TOP_BAR_HEIGHT, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1, duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const TopBar: React.FC = () => {
  const theme = useTheme();
  const [atTop, setAtTop] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // control hamburger drawer

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY === 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {atTop && (
          <motion.div
            variants={barVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'fixed',
              top: 45,
              left: 0,
              right: 0,
              height: TOP_BAR_HEIGHT,
              zIndex: theme.zIndex.appBar + 2,
              display: 'flex',
              alignItems: 'center',
              padding: '0 25px 5px',
              backgroundColor: 'transparent',
            }}
          >
            {/* Left: HamburgerMenu trigger */}
            <motion.div variants={itemVariants}>
              <HamburgerMenu open={drawerOpen} setOpen={setDrawerOpen} />
            </motion.div>

            {/* Center: Logo */}
            <Box sx={{ flex: 1, textAlign: 'center', mt: 5, ml: 15 }}>
              <motion.img
                src="/images/logo1.png"
                alt="Hotel Poinisuk"
                variants={itemVariants}
                style={{
                  maxHeight: '190px',
                  height: 'auto',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Right: Book + Phone */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                href="#availability"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  lineHeight: 1.5,
                  fontSize: '1.4rem',
                }}
              >
                Book Now
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                <PhoneIcon sx={{ mr: 0.5, fontSize: '1.3rem' }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  (209) 379-2606
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
