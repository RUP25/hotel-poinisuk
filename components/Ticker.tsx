// components/Ticker.tsx

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@emotion/react';

const scroll = keyframes`
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

interface TickerProps {
  /** Array of headlines to scroll */
  items: string[];
  /** Duration of one full scroll cycle (e.g. "20s") */
  duration?: string;
}

const Ticker: React.FC<TickerProps> = ({ items, duration = '2s' }) => {
  const theme = useTheme();
  const text = items.map((i) => `• ${i}`).join('   ');

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 0.5,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: `${scroll} ${duration} linear infinite`,
        }}
      >
        <Typography variant="body2" component="span" sx={{ pl: 6, pr: 6 }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default Ticker;
