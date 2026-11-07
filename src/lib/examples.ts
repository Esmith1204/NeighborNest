// "See an example" cards. Fictional composites for demos; NOT the user base.
// Phase 1: they open the legacy calculator with the matching preset. Phase 3 rewires them to
// preload the wizards and jump to results.
import type { ImageKey } from "./images";

export interface Example {
  id: string;
  title: string;
  summary: string;
  image: ImageKey;
  to: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "linda-karl",
    title: "Linda & Karl",
    summary: "A Fullerton homeowner with tuition bills, and a neighbor who needs a stable home and an address.",
    image: "homeowner",
    to: "/legacy?preset=linda-karl",
  },
  {
    id: "senior-clt",
    title: "A senior homeowner + a land trust",
    summary: "A cash-strapped senior in Buena Park partners with a community land trust.",
    image: "partner",
    to: "/legacy?preset=senior-clt",
  },
];
