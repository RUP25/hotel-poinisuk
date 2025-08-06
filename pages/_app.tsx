// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TopBar from '@/components/TopBar';
import StickyAppBar from '@/components/StickyAppBar';

const theme = createTheme({
  palette: {
    primary: { main: '#6A1B9A' },
    secondary: { main: '#dfcfecff' },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CssBaseline />

      <TopBar />
      <StickyAppBar />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}
