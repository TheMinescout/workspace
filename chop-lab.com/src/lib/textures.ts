export type TextureId = "hex" | "mason" | "torque";

export const TEXTURES: {
  id: TextureId;
  name: string;
  note: string;
  /** Full roller / impression shot. */
  image: string;
  /** Tight detail shot of the pattern itself. */
  closeup: string;
}[] = [
  {
    id: "hex",
    name: "Honeycomb",
    note: "Cellular hex-lattice, even cell walls",
    image: "/images/roller-hex-10in.jpg",
    closeup: "/images/roller-hex-closeup.jpg",
  },
  {
    id: "mason",
    name: "Mason Block",
    note: "Running masonry-block texture",
    image: "/images/roller-mason-4in.jpg",
    closeup: "/images/roller-mason-closeup.jpg",
  },
  {
    id: "torque",
    name: "Torque Flute",
    note: "Fluted spiral, gentle curved channels",
    image: "/images/roller-torque.jpg",
    closeup: "/images/roller-torque-closeup.jpg",
  },
];

