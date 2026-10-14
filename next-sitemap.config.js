/** @type {import('next-sitemap').IConfig} */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.hotelpoinisuk.com";

// Per-route SEO weighting — same shape Taj/Oberoi/ITC use to bias crawler
// budgets toward revenue-driving pages (booking funnel + room categories).
const ROUTE_PRIORITY = {
  "/": 1.0,
  "/booking": 0.95,
  "/rooms": 0.9,
  "/dine": 0.9,
  "/banquet": 0.9,
  "/karaoke": 0.85,
  "/klong": 0.85,
  "/about": 0.7,
  "/terms": 0.5,
};

const ROUTE_CHANGEFREQ = {
  "/": "weekly",
  "/booking": "daily",
  "/rooms": "weekly",
  "/dine": "monthly",
  "/banquet": "monthly",
  // Karaoke is the most-frequently-updated landing page (new events
  // every week) — tell crawlers to come back often.
  "/karaoke": "weekly",
  "/klong": "monthly",
  "/about": "monthly",
  "/terms": "yearly",
};

module.exports = {
  siteUrl: SITE_URL,
  // robots.txt is hand-curated in /public so we keep this off
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  changefreq: "monthly",
  priority: 0.7,
  autoLastmod: true,
  exclude: ["/admin/*", "/api/*", "/404", "/500"],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: ROUTE_CHANGEFREQ[path] || config.changefreq,
      priority: ROUTE_PRIORITY[path] ?? config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
