// types/next-page-with-seo.ts
import type { NextPage } from "next";

export type PageSeo = {
  title?: string;        // Page name only (e.g., "Dining") or full title with "|" for custom ordering.
  description?: string;  // Meta description
  ogImage?: string;      // "/images/og/xyz.jpg" or absolute URL
  keywords?: string;     // Meta keywords
  noindex?: boolean;     // Optional
  schema?: object | object[]; // Optional JSON-LD schema override/addition
};

export type NextPageWithSeo<P = {}, IP = P> = NextPage<P, IP> & {
  seo?: PageSeo;
};
