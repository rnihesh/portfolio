import type { ImageMetadata } from "astro";

import p1 from "../assets/photos/1.jpg";
import p2 from "../assets/photos/2.jpg";
import p4 from "../assets/photos/4.jpg";
import p5 from "../assets/photos/5.jpg";
import p6 from "../assets/photos/6.jpg";
import p7 from "../assets/photos/7.jpg";
import p8 from "../assets/photos/8.jpg";
import p9 from "../assets/photos/9.jpg";

import h1 from "../assets/photos/hi/1.jpg";
import h2 from "../assets/photos/hi/2.jpg";
import h4 from "../assets/photos/hi/4.jpg";
import h6 from "../assets/photos/hi/6.jpg";
import h7 from "../assets/photos/hi/7.jpg";
import h8 from "../assets/photos/hi/8.jpg";
import h9 from "../assets/photos/hi/9.jpg";

export interface Photo {
  id: string;
  image: ImageMetadata;
  /** Higher quality source used for the lightbox. Falls back to `image`. */
  full?: ImageMetadata;
  alt: string;
}

export const photosUrl = "https://vsco.co/niheshr/";

// Photo 3 (the brush signature) is now the hero name, so it's not listed here.
export const photos: Photo[] = [
  { id: "1", image: p1, full: h1, alt: "Croton leaves glowing against a dark wall" },
  { id: "2", image: p2, full: h2, alt: "A small bird perched on the edge of a sign under a pale sky" },
  { id: "4", image: p4, full: h4, alt: "Dark rocks along a grey sea" },
  { id: "5", image: p5, alt: "A lone bird crossing a wide, empty grey sky" },
  { id: "6", image: p6, full: h6, alt: "Silhouetted leaves of a tree against a soft evening sky" },
  { id: "7", image: p7, full: h7, alt: "Broken white clouds across a deep blue sky" },
  { id: "8", image: p8, full: h8, alt: "Magenta bougainvillea reaching up into a bright sky" },
  { id: "9", image: p9, full: h9, alt: "A green tree canopy against a clear sky" },
];
