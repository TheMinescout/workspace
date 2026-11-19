import type { MetaDescriptor } from "@tanstack/react-router";
import type * as React from "react";
import { productSeo, quoteFor, type Product } from "./products.ts";

/**
 * Canonical origin for the site. Used for absolute canonical links, the
 * sitemap, and JSON-LD, none of which can rely on the request host in a
 * static-ish build.
 */
export const SITE_URL = "https://chop-lab.com";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * Canonical href for a path. The root keeps the bare origin so the homepage
 * canonical is exactly `https://chop-lab.com`, matching the sitemap entry.
 */
export function canonicalUrl(path: string) {
  return path === "/" ? SITE_URL : absoluteUrl(path);
}

/**
 * The `<head>` payload a route's `head()` accepts. The React adapter types
 * `meta` as the plain `<meta>` element, which does not include the
 * `script:ld+json` descriptor that the router does render — hence the cast
 * inside `pageHead`.
 */
export type PageHead = {
  meta: React.JSX.IntrinsicElements["meta"][];
  links: React.JSX.IntrinsicElements["link"][];
};

type PageHeadInput = {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/tools" or "/tools/custom-chop-complex". */
  path: string;
  /** JSON-LD structured data for this page — one block or several. */
  ld?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Per-route `<head>` payload: page title, description, a self-referencing
 * canonical link, and optional JSON-LD. `og:*` / `twitter:*` are deliberately
 * omitted — the platform's PWA injector strips and rewrites them on every
 * response, so the document title is what it reads to build the share card.
 */
export function pageHead({ title, description, path, ld }: PageHeadInput): PageHead {
  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
  ];
  if (ld) {
    for (const block of Array.isArray(ld) ? ld : [ld]) {
      meta.push({ "script:ld+json": block });
    }
  }
  return {
    meta: meta as unknown as PageHead["meta"],
    links: [{ rel: "canonical", href: canonicalUrl(path) }],
  };
}

/** Local business facts shared by the Organization and LocalBusiness JSON-LD. */
export const BUSINESS = {
  name: "The Chop Lab",
  email: "thomas@chop-lab.com",
  locality: "Sammamish",
  region: "WA",
  country: "US",
  priceRange: "$$",
  areaServed: [
    "Sammamish",
    "Bellevue",
    "Redmond",
    "Issaquah",
    "Kirkland",
    "Snoqualmie",
    "Eastside, Washington",
  ],
} as const;

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: BUSINESS.locality,
  addressRegion: BUSINESS.region,
  addressCountry: BUSINESS.country,
} as const;

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BUSINESS.name,
  url: SITE_URL,
  logo: absoluteUrl("/logo-512.png"),
  description:
    "Custom engineered pottery tools — chops, texture rollers, and studio tools printed in PLA Matte.",
  email: BUSINESS.email,
  address: POSTAL_ADDRESS,
  sameAs: [] as string[],
} satisfies Record<string, unknown>;

/**
 * LocalBusiness block for the 3D printing landing page. `areaServed` is what
 * ties the page to Sammamish and the Eastside, which is the point of the route.
 */
export const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": absoluteUrl("/3d-printing#business"),
  name: BUSINESS.name,
  url: absoluteUrl("/3d-printing"),
  image: absoluteUrl("/images/printer-action.jpg"),
  logo: absoluteUrl("/logo-512.png"),
  email: BUSINESS.email,
  description:
    "Custom 3D printing, CAD design, and rapid prototyping for potters and makers in Sammamish and the Eastside of Washington.",
  address: POSTAL_ADDRESS,
  areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
  priceRange: BUSINESS.priceRange,
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Custom pottery tools and maker's marks",
        url: absoluteUrl("/tools"),
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Replacement parts and custom fixtures",
        url: absoluteUrl("/configure"),
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Rapid prototyping and CAD modeling",
        url: absoluteUrl("/engineering-drawings"),
      },
    },
  ],
} satisfies Record<string, unknown>;

/**
 * Product image for structured data: the product shot when there is one,
 * otherwise the closest studio shot so the `image` property is never missing —
 * Google needs it for a product rich result.
 */
export function productImageUrl(product: Product) {
  if (product.image) return absoluteUrl(product.image);
  if (product.digital) return absoluteUrl("/images/printer-action.jpg");
  const byDrawing: Record<Product["drawing"], string> = {
    chop: "/images/chop-complex.jpg",
    "roller-10": "/images/roller-hex-10in.jpg",
    "roller-4": "/images/roller-mason-4in.jpg",
    basket: "/images/packaging.jpg",
    rails: "/images/chop-complex-cad.jpg",
    cutter: "/images/packaging.jpg",
  };
  return absoluteUrl(byDrawing[product.drawing]);
}

/** `Product` JSON-LD with the fields Google's product snippets require. */
export function productLd(product: Product): Record<string, unknown> {
  const seo = productSeo(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seo.heading,
    alternateName: product.name,
    sku: product.slug,
    description: seo.description,
    image: [productImageUrl(product)],
    url: absoluteUrl(`/tools/${product.slug}`),
    brand: { "@type": "Brand", name: BUSINESS.name },
    category: product.digital ? "Digital 3D file" : "Pottery tool",
    keywords: seo.keywords.join(", "),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: quoteFor(product).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: absoluteUrl(`/tools/${product.slug}`),
      seller: { "@type": "Organization", name: BUSINESS.name },
    },
  };
}

/** Head payload for a product route: title, description, canonical, JSON-LD. */
export function productHead(product: Product) {
  const seo = productSeo(product);
  return pageHead({
    title: seo.title,
    description: seo.description,
    path: `/tools/${product.slug}`,
    ld: productLd(product),
  });
}
