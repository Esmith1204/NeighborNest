// "See an example" cards. Fictional composites for demos; NOT the user base.
// They open the dashboard with the matching example loaded.
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
    summary: "A Fullerton homeowner whose bank said no to an ADU loan, and a neighbor who needs a stable home and an address.",
    image: "homeowner",
    to: "/dashboard?example=linda-karl",
  },
  {
    id: "senior-clt",
    title: "A senior homeowner + a land trust",
    summary: "A cash-strapped senior in Buena Park partners with a community land trust.",
    image: "partner",
    to: "/dashboard?example=senior-clt",
  },
];
