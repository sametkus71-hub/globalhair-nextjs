// Sitemap generation script with hreflang support
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { JSXAttribute, JSXIdentifier, JSXOpeningElement } from "@babel/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ———————————————
// CONFIGURATION
// ———————————————

const BASE_URL = "https://globalhair.institute";
const SEO_ROUTES_PATH = path.resolve(__dirname, "../components/SEORoutes.tsx");
const OUTPUT_DIR = path.resolve(__dirname, "../../public");

// Paths to ignore (exact matches or patterns with wildcards)
const IGNORE_PATHS: string[] = [
  "/admin/*",
  "/dashboard/*",
  "/chat",
  "/support/*",
  "/form",
  "/booking/*",
];

// Route mappings for hreflang (Dutch route -> English route)
const HREFLANG_MAPPINGS: Record<string, string> = {
  "/nl": "/en",
  "/nl/haartransplantatie": "/en/hair-transplant",
  "/nl/haartransplantatie/behandelingen": "/en/hair-transplant/treatments",
  "/nl/haartransplantatie/reviews": "/en/hair-transplant/reviews",
  "/nl/haartransplantatie/missie": "/en/hair-transplant/mission",
  "/nl/haartransplantatie/contact": "/en/hair-transplant/contact",
  "/nl/haartransplantatie/hoe-het-werkt": "/en/hair-transplant/how-it-works",
  "/nl/haartransplantatie/methode": "/en/hair-transplant/method",
  "/nl/haartransplantatie/traject": "/en/hair-transplant/trajectory",
  "/nl/haartransplantatie/haaranalyse": "/en/hair-transplant/hair-analysis",
  "/nl/haartransplantatie/v6-hairboost": "/en/hair-transplant/v6-hairboost",
  "/nl/haartransplantatie/dr-berkant-dural": "/en/hair-transplant/dr-berkant-dural",
  "/nl/haartransplantatie/dr-ozlem-aslan": "/en/hair-transplant/dr-ozlem-aslan",
  "/nl/haartransplantatie/nl/standard": "/en/hair-transplant/nl/standard",
  "/nl/haartransplantatie/nl/premium": "/en/hair-transplant/nl/premium",
  "/nl/haartransplantatie/nl/elite": "/en/hair-transplant/nl/elite",
  "/nl/haartransplantatie/tr/standard": "/en/hair-transplant/tr/standard",
  "/nl/haartransplantatie/tr/premium": "/en/hair-transplant/tr/premium",
  "/nl/privacy-policy": "/en/privacy-policy",
  "/nl/algemene-voorwaarden": "/en/terms-and-conditions",
  "/nl/binnenkort-1": "/en/coming-soon-1",
  "/nl/binnenkort-2": "/en/coming-soon-2",
};

// ———————————————
// SITEMAP SCRIPT
// ———————————————

const SITEMAP_PATH = path.join(OUTPUT_DIR, "sitemap.xml");

function getAttributeValue(
  astPath: NodePath<JSXOpeningElement>,
  attributeName: string
): string | null {
  const attribute = astPath.node.attributes.find(
    (attr): attr is JSXAttribute =>
      attr.type === "JSXAttribute" && attr.name.name === attributeName
  );

  if (!attribute) return null;

  const value = attribute.value;
  if (value?.type === "StringLiteral") {
    return value.value;
  }
  return null;
}

function joinPaths(paths: string[]): string {
  if (paths.length === 0) return "/";

  const joined = paths.join("/");
  const cleaned = ("/" + joined).replace(/\/+/g, "/");

  if (cleaned.length > 1 && cleaned.endsWith("/")) {
    return cleaned.slice(0, -1);
  }

  return cleaned;
}

function shouldIgnoreRoute(route: string): boolean {
  for (const ignorePattern of IGNORE_PATHS) {
    if (ignorePattern === route) return true;

    if (ignorePattern.endsWith("/*")) {
      const prefix = ignorePattern.slice(0, -2);
      if (route.startsWith(prefix + "/") || route === prefix) {
        return true;
      }
    }
  }
  return false;
}

function getHreflangAlternate(route: string): { nl: string; en: string } | null {
  // Check if it's a Dutch route
  if (HREFLANG_MAPPINGS[route]) {
    return { nl: route, en: HREFLANG_MAPPINGS[route] };
  }
  
  // Check if it's an English route (reverse lookup)
  const nlRoute = Object.entries(HREFLANG_MAPPINGS).find(([, en]) => en === route);
  if (nlRoute) {
    return { nl: nlRoute[0], en: route };
  }

  return null;
}

function createSitemapXml(routes: string[]): string {
  const today = new Date().toISOString().split("T")[0];
  const processedRoutes = new Set<string>();

  const urls = routes
    .map((route) => {
      // Skip if already processed as part of a pair
      if (processedRoutes.has(route)) return "";

      const hreflang = getHreflangAlternate(route);
      const fullUrl = new URL(route, BASE_URL).href;
      
      // Determine priority based on route depth
      let priority = "0.8";
      if (route === "/nl" || route === "/en") {
        priority = "1.0";
      } else if (route.includes("/haartransplantatie") || route.includes("/hair-transplant")) {
        if (route.split("/").length <= 3) {
          priority = "0.9";
        }
      }

      if (hreflang) {
        processedRoutes.add(hreflang.nl);
        processedRoutes.add(hreflang.en);
        
        const nlUrl = new URL(hreflang.nl, BASE_URL).href;
        const enUrl = new URL(hreflang.en, BASE_URL).href;
        
        // Generate both NL and EN entries with hreflang
        return `
  <url>
    <loc>${nlUrl}</loc>
    <xhtml:link rel="alternate" hreflang="nl" href="${nlUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="nl" href="${nlUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }

      // Single route without hreflang pair
      return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .filter(Boolean)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>
`;
}

async function generateSitemap() {
  console.log("🗺️  Generating sitemap...");

  // Read the SEORoutes.tsx file
  const content = fs.readFileSync(SEO_ROUTES_PATH, "utf-8");

  // Parse the file content into an AST
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // Traverse the AST to find routes
  const pathStack: string[] = [];
  const foundRoutes: string[] = [];

  traverse(ast, {
    JSXOpeningElement: {
      enter(astPath) {
        const nodeName = astPath.node.name as JSXIdentifier;
        if (nodeName.name !== "Route") return;

        const pathProp = getAttributeValue(astPath, "path");
        const hasElement = astPath.node.attributes.some(
          (attr) => attr.type === "JSXAttribute" && attr.name.name === "element"
        );

        if (pathProp) {
          pathStack.push(pathProp);
        }

        if (hasElement && pathProp) {
          const fullRoute = joinPaths(pathStack);
          foundRoutes.push(fullRoute);
        }
      },

      exit(astPath) {
        const nodeName = astPath.node.name as JSXIdentifier;
        if (nodeName.name !== "Route") return;

        const pathProp = getAttributeValue(astPath, "path");
        if (pathProp) {
          pathStack.pop();
        }
      },
    },
  });

  // Filter out dynamic paths, catch-alls, and ignored routes
  const staticRoutes = foundRoutes.filter(
    (route) => !route.includes(":") && !route.includes("*")
  );
  const filteredRoutes = staticRoutes.filter(
    (route) => !shouldIgnoreRoute(route)
  );

  console.log(`📊 Found ${foundRoutes.length} total routes`);
  console.log(`🚫 Filtered ${staticRoutes.length - filteredRoutes.length} ignored routes`);
  console.log(`✅ Final ${filteredRoutes.length} static routes`);

  // Generate the XML
  const sitemapXml = createSitemapXml(filteredRoutes);

  // Write the sitemap.xml file
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(SITEMAP_PATH, sitemapXml);

  console.log(`🗺️  Sitemap generated at ${SITEMAP_PATH}`);
}

generateSitemap().catch(console.error);
