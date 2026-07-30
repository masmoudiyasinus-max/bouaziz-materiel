export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "https://bouazizmaterielagricole.tn/sitemap.xml",
  };
}
