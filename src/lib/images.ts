// Photos live in /public/images (see public/images/README.md). Until a file exists, <Photo> shows a
// dark gradient placeholder, so nothing breaks. No hotlinking or scraping: free-license files only,
// each credited on the Sources page (`credit`).

export type ImageKey = "hero" | "neighborhood" | "cottage" | "homeowner" | "renter" | "partner";

export interface ImageInfo {
  src: string;
  alt: string;
  /** Photographer + licence + link, filled in when the photo is added. Shown on /sources. */
  credit?: string;
  /** Placeholder gradient while the photo is missing. */
  placeholder: string;
}

export const IMAGES: Record<ImageKey, ImageInfo> = {
  hero: {
    src: "/images/hero.jpg",
    alt: "A small backyard cottage behind a family home",
    placeholder: "linear-gradient(135deg, #2b2b2b 0%, #0a0a0a 70%)",
  },
  neighborhood: {
    src: "/images/neighborhood.jpg",
    alt: "A quiet residential street with single-family homes",
    placeholder: "linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)",
  },
  cottage: {
    src: "/images/cottage.jpg",
    alt: "A detached backyard home with a small porch",
    placeholder: "linear-gradient(160deg, #333 0%, #111 100%)",
  },
  homeowner: {
    src: "/images/homeowner.jpg",
    alt: "A backyard with room for a second small home",
    placeholder: "linear-gradient(150deg, #3a3a3a 0%, #0f0f0f 100%)",
  },
  renter: {
    src: "/images/renter.jpg",
    alt: "The front door of a small backyard home",
    placeholder: "linear-gradient(150deg, #2e2e2e 0%, #0c0c0c 100%)",
  },
  partner: {
    src: "/images/partner.jpg",
    alt: "A row of neighborhood homes",
    placeholder: "linear-gradient(150deg, #353535 0%, #0d0d0d 100%)",
  },
};
