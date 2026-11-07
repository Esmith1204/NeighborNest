// Photos in /public/images: free-license files from Wikimedia Commons, downloaded once (no hotlinking),
// resized to <=1600px and re-encoded (camera metadata stripped). Each one is credited in the footer
// with its author, licence and source page. Checked 2026-11-07.

export type ImageKey = "hero" | "neighborhood" | "cottage" | "homeowner" | "renter" | "partner";

export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export interface ImageInfo {
  src: string;
  alt: string;
  credit: ImageCredit;
}

/** Flat fill shown while a photo loads. */
export const PHOTO_FILL = "#e2d4c3";

export const IMAGES: Record<ImageKey, ImageInfo> = {
  hero: {
    src: "/images/hero.jpg",
    alt: "A row of small bungalows with gardens in a Los Angeles bungalow court",
    credit: {
      title: "St. Andrews Bungalow Court, Los Angeles",
      author: "Los Angeles (Wikimedia Commons user)",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      source: "https://commons.wikimedia.org/wiki/File:St._Andrews_Bungalow_Court,_Los_Angeles.JPG",
    },
  },
  homeowner: {
    src: "/images/homeowner.jpg",
    alt: "A 1920s California bungalow behind a low brick fence",
    credit: {
      title: "1920s Californian Bungalow style home",
      author: "Bidgee",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0",
      source: "https://commons.wikimedia.org/wiki/File:1920s_Californian_Bungalow_style_home.jpg",
    },
  },
  renter: {
    src: "/images/renter.jpg",
    alt: "Small homes with front doors facing a shared garden path",
    credit: {
      title: "Example of a bungalow court in Alameda, CA",
      author: "Jennvirskus",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      source: "https://commons.wikimedia.org/wiki/File:Example_of_a_bungalow_court_in_Alameda,_CA.jpg",
    },
  },
  partner: {
    src: "/images/partner.jpg",
    alt: "A city welcome sign on a tree-lined street in Fountain Valley, Orange County",
    credit: {
      title: "Fountain Valley, California",
      author: "Ken Lund",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
      source: "https://commons.wikimedia.org/wiki/File:Fountain_Valley,_California.jpg",
    },
  },
  cottage: {
    src: "/images/cottage.jpg",
    alt: "A craftsman house with a small backyard cottage beside it",
    credit: {
      title: "Craftsman with Backyard Cottage (Converted Garage)",
      author: "Sightline Institute: Missing Middle Homes Photo Library",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      source: "https://commons.wikimedia.org/wiki/File:Craftsman_with_Backyard_Cottage_(Converted_Garage).jpg",
    },
  },
  neighborhood: {
    src: "/images/neighborhood.jpg",
    alt: "Aerial view of Orange County neighborhoods with mountains in the distance",
    credit: {
      title: "Fountain Valley, California (aerial)",
      author: "Ken Lund",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
      source: "https://commons.wikimedia.org/wiki/File:Fountain_Valley,_California_(6013249267).jpg",
    },
  },
};
