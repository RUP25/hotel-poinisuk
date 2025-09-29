// types/next-page-with-seo.ts
import type { NextPage } from "next";

export type PageSeo = {
  title?: string;        // Page name only (e.g., "Dining"). Home must be "Shillong".
  description?: string;  // Meta description
  ogImage?: string;      // "/images/og/xyz.jpg" or absolute URL
  noindex?: boolean;     // Optional
};

export type NextPageWithSeo<P = {}, IP = P> = NextPage<P, IP> & {
  seo?: PageSeo;
};
