// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from "@mui/material";

import Seo from "@/components/seo";
import { routeToTitle } from "@/lib/seo";
import { montserrat } from "@/lib/fonts";
import { ADMIN_GLOBAL_HEADER_HEIGHT_PX } from "@/lib/admin-site-chrome";

import TopBar from "@/components/TopBar";
import StickyAppBar from "@/components/StickyAppBar";
import AdminMinimalSiteHeader from "@/components/AdminMinimalSiteHeader";
import AppStartupSplash from "@/components/AppStartupSplash";

// MUI baseline: route Material's `typography.fontFamily` through the
// self-hosted Montserrat font. The fallback list mirrors the next/font
// fallback chain so MUI components match the rest of the UI.
//
// Note: the four `--font-*` CSS variables are defined on the <Html>
// element via _document.tsx (the canonical Next.js pattern for static
// export), not here. Defining them in _app via styled-jsx breaks the
// `output: "export"` prerender step in Next 15.
const theme = createTheme({
  palette: {
    primary: { main: "#5f02ab" },
    secondary: { main: "#dfcfecff" },
  },
  typography: {
    fontFamily: `${montserrat.style.fontFamily}, "Helvetica Neue", Arial, sans-serif`,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const pageSeo = (Component as any).seo as
    | {
        title?: string;
        description?: string;
        ogImage?: string;
        keywords?: string;
        noindex?: boolean;
        schema?: object | object[];
      }
    | undefined;

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      {/* Global SEO applied to every page */}
      <Seo
        pageName={pageSeo?.title ?? routeToTitle(pathname)}
        description={pageSeo?.description}
        ogImage={pageSeo?.ogImage}
        keywords={pageSeo?.keywords}
        noindex={pageSeo?.noindex || pathname.startsWith("/admin")}
        schema={pageSeo?.schema}
      />

      <CssBaseline />

      {isAdminRoute ? (
        <>
          <AdminMinimalSiteHeader />
          <Box
            component="main"
            sx={{ pt: `${ADMIN_GLOBAL_HEADER_HEIGHT_PX}px` }}
          >
            <Component {...pageProps} />
          </Box>
        </>
      ) : (
        <>
          <AppStartupSplash />
          <TopBar />
          <StickyAppBar />
          <Component {...pageProps} />
        </>
      )}
    </ThemeProvider>
  );
}
