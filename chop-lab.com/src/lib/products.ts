export type ProductKind = "chop" | "roller" | "basket" | "rails" | "stl";
export type ProductCategory = "chops" | "storage" | "slab" | "digital";
export type ToolDrawing = "chop" | "roller-10" | "roller-4" | "basket" | "rails" | "cutter";

export type Product = {
  slug: string;
  name: string;
  kind: ProductKind;
  category: ProductCategory;
  drawing: ToolDrawing;
  tagline: string;
  description: string;
  longDescription: string;
  basePrice: number;
  hourlyRate: number;
  estimatedHours: number;
  bestSeller?: boolean;
  image?: string;
  stlFile?: string;
  features: string[];
  digital?: boolean;
  specs: { label: string; value: string }[];
};

export const CATEGORIES: { id: ProductCategory; name: string; blurb: string }[] = [
  {
    id: "chops",
    name: "Chops & textures",
    blurb: "Custom stamps, logos, and continuous texture rollers.",
  },
  {
    id: "storage",
    name: "Storage",
    blurb: "Breathable hex-lattice baskets and lab organizers.",
  },
  {
    id: "slab",
    name: "Slab & handbuilding",
    blurb: "Interlocking rails, custom thickness and width.",
  },
  {
    id: "digital",
    name: "Digital files",
    blurb: "Download CAD models to print in your own studio.",
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "custom-chop-complex",
    name: "Custom Chop — Complex",
    kind: "chop",
    category: "chops",
    drawing: "chop",
    tagline: "High-fidelity detail from logos and original artwork.",
    description:
      "High-fidelity detail extraction for complex logos and original artwork. Our most requested piece.",
    longDescription:
      "The tool that defines your studio. We extract high-fidelity detail from your logos or original artwork and engineer it into a custom, ergonomic stamp — printed in specialized PLA Matte for clean, low-friction clay release every time.",
    basePrice: 3,
    hourlyRate: 20,
    estimatedHours: 2,
    bestSeller: true,
    image: "/images/chop-complex.jpg",
    features: [
      "Any logo, monogram, or original artwork",
      "Consistent depth and crisp edges on leather-hard clay",
      "Durable matte finish — no slipping, no sticking",
      "Ergonomic handle in your choice of color",
    ],
    specs: [
      { label: "Material", value: "PLA Matte" },
      { label: "Turnaround", value: "3–5 business days after approval" },
      { label: "Best for", value: "Logos, crests, illustrated marks" },
    ],
  },
  {
    slug: "custom-chop-simple",
    name: "Custom Chop — Simple",
    kind: "chop",
    category: "chops",
    drawing: "chop",
    tagline: "Initials, text, or a clean logo mark.",
    description:
      "Initials, text, or clean logo marks engineered for crisp, consistent impressions.",
    longDescription:
      "Standard text, initials, or a clean logo mark, modeled so the impression reads clearly in leather-hard clay. Best when the design is a few letters or a simple mark — more than three letters raises the chance of impression issues.",
    basePrice: 3,
    hourlyRate: 15,
    estimatedHours: 1,
    image: "/images/chop-simple.jpg",
    features: [
      "Initials, wordmarks, and simple icons",
      "Crisp, consistent impressions",
      "PLA Matte for clean clay release",
      "Ergonomic handle in your choice of color",
    ],
    specs: [
      { label: "Material", value: "PLA Matte" },
      { label: "Turnaround", value: "3–5 business days after approval" },
      { label: "Best for", value: "1–3 letters, simple marks" },
    ],
  },
  {
    slug: "texture-roller-10",
    name: "Texture Roller 10in",
    kind: "roller",
    category: "chops",
    drawing: "roller-10",
    tagline: "Seamless pattern across any slab.",
    description:
      "Continuous pattern rolling in honeycomb, brick, spiral, and more — seamless across any slab.",
    longDescription:
      "A ten-inch roller with engineered, repeating geometry so the pattern tiles cleanly as you travel across a slab. Choose from the texture library or send a pattern of your own.",
    basePrice: 3,
    hourlyRate: 12,
    estimatedHours: 1.5,
    image: "/images/roller-hex-10in.jpg",
    features: [
      "Seamless repeating geometry",
      "Honeycomb, brick, spiral, and custom patterns",
      "Ten-inch rolling length",
      "Matte surface that does not drag in clay",
    ],
    specs: [
      { label: "Length", value: "10 in / 254 mm" },
      { label: "Material", value: "PLA Matte" },
      { label: "Patterns", value: "Library or custom" },
    ],
  },
  {
    slug: "texture-roller-4",
    name: "Texture Roller 4in",
    kind: "roller",
    category: "chops",
    drawing: "roller-4",
    tagline: "Compact roller for tiles and accent work.",
    description: "Compact texture roller for smaller pieces, tiles, and accent work.",
    longDescription:
      "The same engineered patterns in a four-inch format — easier to control on tiles, rims, and smaller slabs where a full-length roller is more tool than you need.",
    basePrice: 3,
    hourlyRate: 12,
    estimatedHours: 1,
    image: "/images/roller-mason-4in.jpg",
    features: [
      "Compact four-inch body",
      "Same seamless pattern library",
      "Ideal for tiles and accent bands",
      "PLA Matte, low-friction release",
    ],
    specs: [
      { label: "Length", value: "4 in / 102 mm" },
      { label: "Material", value: "PLA Matte" },
      { label: "Patterns", value: "Library or custom" },
    ],
  },
  {
    slug: "sponge-basket",
    name: "Sponge Basket",
    kind: "basket",
    category: "storage",
    drawing: "basket",
    tagline: "Hex-lattice storage that hangs on the bucket.",
    description:
      "Shallow, breathable hex-lattice storage — lets your sponges drain right into the bucket.",
    longDescription:
      "Engineered to hang on a standard pottery water bucket. The hex lattice lets sponges drain instead of sitting sour, and the hang geometry is sized from the thickness of your bucket's top lip.",
    basePrice: 12,
    hourlyRate: 2,
    estimatedHours: 0.5,
    stlFile: "/files/sponge-basket.stl",
    features: [
      "Hangs on a standard water bucket",
      "Breathable hex lattice",
      "Custom lip thickness",
      "Drains into the bucket, not the floor",
    ],
    specs: [
      { label: "Material", value: "PLA Matte" },
      { label: "Fit", value: "Measured to your bucket lip" },
      { label: "Use", value: "Sponges, ribs, small tools" },
    ],
  },
  {
    slug: "slab-rails",
    name: "Slab Thickness Rails",
    kind: "rails",
    category: "slab",
    drawing: "rails",
    tagline: "Interlocking rails for consistent slabs.",
    description:
      "10-inch interlocking rails — custom thickness and width for consistent slabs and tiles every time.",
    longDescription:
      "A matched pair of interlocking rails, ten inches long as standard. Set the thickness you throw to — or ask for a custom height — and roll slabs that actually match from edge to edge.",
    basePrice: 3,
    hourlyRate: 10,
    estimatedHours: 1,
    stlFile: "/files/interlocking-slab-rails.stl",
    features: [
      "Interlocking 10-inch pair",
      "Custom thickness and width",
      "Repeatable slabs and tiles",
      "PLA Matte, easy to wipe down",
    ],
    specs: [
      { label: "Length", value: "10 in / 254 mm standard" },
      { label: "Thickness", value: "Your spec, or a listed height" },
      { label: "Material", value: "PLA Matte" },
    ],
  },
  {
    slug: "stl-sponge-basket",
    name: "Sponge Basket — STL",
    kind: "stl",
    category: "digital",
    drawing: "basket",
    tagline: "Print the parametric basket in your own lab.",
    description: "Download the parametric model to 3D print in your own lab.",
    longDescription:
      "The sponge basket as a digital file. You are purchasing an STL to print yourself. The file link and invoice are emailed after a short review. Pricing is a $5 base fee plus $1 per hour of quoted print time.",
    basePrice: 5,
    hourlyRate: 1,
    estimatedHours: 3,
    digital: true,
    stlFile: "/files/sponge-basket.stl",
    features: [
      "Parametric STL",
      "Print on your own machine",
      "File link emailed after review",
      "$5 base + $1 / hour of print time",
    ],
    specs: [
      { label: "Format", value: "STL" },
      { label: "Build volume max", value: "256 × 256 × 256 mm" },
      { label: "Delivery", value: "Email after quote" },
    ],
  },
  {
    slug: "stl-dual-bevel",
    name: "Dual Bevel Cutter — STL",
    kind: "stl",
    category: "digital",
    drawing: "cutter",
    tagline: "45° and 60° foot-ring cutter.",
    description: "45° & 60° foot ring cutter — download and print it yourself.",
    longDescription:
      "A dual-bevel foot-ring cutter at 45° and 60°. Digital STL only — print it on your own machine. File link and invoice are emailed after review.",
    basePrice: 5,
    hourlyRate: 1,
    estimatedHours: 2,
    digital: true,
    stlFile: "/files/bevel-cutter.stl",
    features: [
      "45° and 60° cutting edges",
      "Foot-ring work on leather-hard pots",
      "STL for your printer",
      "Emailed after quote",
    ],
    specs: [
      { label: "Format", value: "STL" },
      { label: "Angles", value: "45° / 60°" },
      { label: "Delivery", value: "Email after quote" },
    ],
  },
  {
    slug: "stl-slab-rails",
    name: "Slab Thickness Rails — STL",
    kind: "stl",
    category: "digital",
    drawing: "rails",
    tagline: "Print the standard rail pair yourself.",
    description: "Download the standard slab rail model to print yourself.",
    longDescription:
      "The standard interlocking slab-rail pair as an STL. Print it in your own lab. File link and invoice are emailed after review.",
    basePrice: 5,
    hourlyRate: 1,
    estimatedHours: 2.5,
    digital: true,
    stlFile: "/files/interlocking-slab-rails.stl",
    features: [
      "Standard interlocking pair",
      "STL for your printer",
      "File link emailed after review",
      "$5 base + $1 / hour of print time",
    ],
    specs: [
      { label: "Format", value: "STL" },
      { label: "Length", value: "10 in standard" },
      { label: "Delivery", value: "Email after quote" },
    ],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsIn(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function quoteFor(product: Product, hours = product.estimatedHours) {
  return product.basePrice + product.hourlyRate * hours;
}

export const PROCESS = [
  {
    n: "01",
    title: "Submit specs",
    body: "Use the configurator to send a logo, sketch, or exact dimensions. No back-and-forth email thread to get started.",
  },
  {
    n: "02",
    title: "CAD & quote",
    body: "Thomas reviews the request, builds the parametric model, and emails an exact quote within one to two days.",
  },
  {
    n: "03",
    title: "Fabrication",
    body: "Once you approve, the tool is printed in-lab from PLA Matte — or PETG for structural parts that need the heat resistance.",
  },
  {
    n: "04",
    title: "Shipped",
    body: "Your tool arrives ready for the studio. Digital orders get an STL link instead of a box.",
  },
] as const;

export const FAQS = [
  {
    q: "What materials do you print with?",
    a: "For pottery tools, we exclusively use PLA Matte. It offers excellent detail, low friction, and a great tactile grip. For custom structural prints, we offer PETG for higher heat resistance and durability.",
  },
  {
    q: "Are your prints food safe?",
    a: "FDM 3D prints have microscopic layer lines that can harbor bacteria. Our tools are designed for working with raw clay, not for direct long-term contact with food or drink.",
  },
  {
    q: "How long does a custom chop take?",
    a: "Usually 3 to 5 business days from the time your artwork is approved. Complex logos may require a CAD redesign which can add 1–2 days.",
  },
  {
    q: "Can I send a massive STL file?",
    a: "Our maximum build volume is 256 × 256 × 256 mm. If your part is larger, it will need to be sliced into multiple interlocking pieces before you send the STL.",
  },
  {
    q: "How do I pay?",
    a: "Payment is not collected at order time. Thomas will review your request, engineer the CAD model, and send a final invoice by email before any production begins.",
  },
] as const;

export const HANDLE_COLORS = [
  { id: "white", name: "Matte White", swatch: "bg-surface", recommended: true },
  { id: "clay", name: "Clay", swatch: "bg-clay", recommended: false },
  { id: "charcoal", name: "Charcoal", swatch: "bg-kiln", recommended: false },
  { id: "oxide", name: "Iron Oxide", swatch: "bg-primary", recommended: false },
] as const;

export const SLAB_THICKNESSES_MM = [3, 6, 8, 10, 12.7, 15, 20] as const;
