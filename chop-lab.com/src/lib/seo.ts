import type { MetaDescriptor } from "@tanstack/react-router";
import type * as React from "react";
import { quoteFor, type Product } from "./products.ts";

/**
 * Canonical origin for the site. Used for absolute canonical links, the
 * sitemap, and JSON-LD, none of which can rely on the request host in a
 * static-ish build.
 */
export const SITE_URL = "https://chop-lab.com";

/** Absolute URL for a root-relative path; the site root has no trailing slash. */
export function absoluteUrl(path: string) {
  const url = new URL(path, SITE_URL).toString();
  return url === `${SITE_URL}/` ? SITE_URL : url;
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
  /** Optional JSON-LD structured data for this page. */
  ld?: Record<string, unknown>;
};

/**
 * Per-route `<head>` payload: page title, description, a canonical link, and
 * optional JSON-LD. `og:*` / `twitter:*` are deliberately omitted — the
 * platform's PWA injector strips and rewrites them on every response, so the
 * document title is what it reads to build the share card.
 */
export function pageHead({ title, description, path, ld }: PageHeadInput): PageHead {
  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
  ];
  if (ld) meta.push({ "script:ld+json": ld });
  return {
    meta: meta as unknown as PageHead["meta"],
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}

/**
 * `Product` structured data for a tool page. `price` is the quote target the
 * page renders (`quoteFor`), so Product Snippets and Merchant Center advertise
 * the same starting price a shopper sees instead of the bare base fee.
 */
export function productLd(product: Product) {
  const url = absoluteUrl(`/tools/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.headline,
    description: product.seoDescription,
    sku: product.slug,
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    brand: { "@type": "Brand", name: "The Chop Lab" },
    category: product.digital ? "Digital 3D file" : "Pottery tool",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: quoteFor(product),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url,
      seller: { "@type": "Organization", name: "The Chop Lab", url: SITE_URL },
    },
  } satisfies Record<string, unknown>;
}

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Chop Lab",
  url: SITE_URL,
  logo: absoluteUrl("/logo-512.png"),
  description:
    "Custom engineered pottery tools — chops, texture rollers, and studio tools printed in PLA Matte.",
  email: "thomas@chop-lab.com",
  sameAs: [] as string[],
} satisfies Record<string, unknown>;
