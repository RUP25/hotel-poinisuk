// components/StickyAppBar.tsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion, AnimatePresence } from 'framer-motion';
import HamburgerMenu from './HamburgerMenu';

const TOP_BAR_HEIGHT = 100;
const BAR_HEIGHT = 100;

const barVariants = {
  hidden: { y: -(BAR_HEIGHT + TOP_BAR_HEIGHT), opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1, duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const StickyAppBar: React.FC = () => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'fixed',
            top: TOP_BAR_HEIGHT,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar + 1,
          }}
        >
          <AppBar
            sx={{
              height: BAR_HEIGHT,
              backgroundColor: 'rgba(217, 193, 241, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            elevation={4}
          >
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: BAR_HEIGHT,
                px: 3,
              }}
            >
              {/* Left: HamburgerMenu */}
              <motion.div variants={itemVariants}>
                <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
              </motion.div>

              {/* Center: Logo */}
              <motion.div variants={itemVariants}>
                <Box
                  component="img"
                  src="/images/logo1.png"
                  alt="Hotel Poinisuk"
                  sx={{ height: 185, objectFit: 'contain', mt: 2, ml: 11 }}
                />
              </motion.div>

              {/* Right: Book Now + Phone */}
              <motion.div
                variants={itemVariants}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
              >
                <Button variant="contained" color="primary" sx={{ fontSize: '1.1rem' }}>
                  Book Now
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                  <PhoneIcon sx={{ mr: 0.5 }} />
                  <Typography sx={{ color: 'gray', fontSize: '1.1rem', fontWeight: 'bold' }} variant="body2">
                    (209) 379-2606
                  </Typography>
                </Box>
              </motion.div>
            </Toolbar>
          </AppBar>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAppBar;
