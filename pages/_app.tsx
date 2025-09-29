// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Seo from "@/components/seo";
import { routeToTitle } from "@/lib/seo";

import TopBar from "@/components/TopBar";
import StickyAppBar from "@/components/StickyAppBar";

const theme = createTheme({
  palette: {
    primary: { main: "#6A1B9A" },
    secondary: { main: "#dfcfecff" },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pageSeo = (Component as any).seo as
    | {
        title?: string;
        description?: string;
        ogImage?: string;
        noindex?: boolean;
      }
    | undefined;

  return (
    <ThemeProvider theme={theme}>
      {/* Keep only static/global links here (fonts, preconnects, etc.) */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Global SEO applied to every page */}
      <Seo
        pageName={pageSeo?.title ?? routeToTitle(router.pathname)}
        description={pageSeo?.description}
        ogImage={pageSeo?.ogImage}
        noindex={pageSeo?.noindex || router.pathname.startsWith("/admin")}
      />

      <CssBaseline />

      <TopBar />
      <StickyAppBar />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}
