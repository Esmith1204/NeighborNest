// Photos live in /public/images (see public/images/README.md). Until a file exists, <Photo> shows a
// warm gradient with a line drawing, so nothing breaks. No hotlinking or scraping: free-license files only,
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
    placeholder: "linear-gradient(180deg, #7a6150 0%, #a07a5a 45%, #4a3426 80%, #2a1d15 100%)",
  },
  neighborhood: {
    src: "/images/neighborhood.jpg",
    alt: "A quiet residential street with single-family homes",
    placeholder: "linear-gradient(170deg, #c9a47f 0%, #8a6448 55%, #3a281c 100%)",
  },
  cottage: {
    src: "/images/cottage.jpg",
    alt: "A detached backyard home with a small porch",
    placeholder: "linear-gradient(160deg, #b08867 0%, #6a4630 60%, #2a1d15 100%)",
  },
  homeowner: {
    src: "/images/homeowner.jpg",
    alt: "A backyard with room for a second small home",
    placeholder: "linear-gradient(160deg, #d2b394 0%, #9b6b45 60%, #553825 100%)",
  },
  renter: {
    src: "/images/renter.jpg",
    alt: "The front door of a small backyard home",
    placeholder: "linear-gradient(160deg, #c7a88a 0%, #8a6448 60%, #46372d 100%)",
  },
  partner: {
    src: "/images/partner.jpg",
    alt: "A row of neighborhood homes",
    placeholder: "linear-gradient(160deg, #bfa287 0%, #7a5236 60%, #34271f 100%)",
  },
};
