import type { ImageKey } from "./images";
import { loadJson, saveJson } from "./storage";

export type Role = "homeowner" | "renter" | "partner";

export const ROLES: Role[] = ["homeowner", "renter", "partner"];

export interface RoleMeta {
  role: Role;
  path: string;
  /** First-person choice on /start. */
  choice: string;
  /** Short name for menus and breadcrumbs. */
  short: string;
  /** One plain-language line. */
  blurb: string;
  image: ImageKey;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  homeowner: {
    role: "homeowner",
    path: "/homeowner",
    choice: "I'm a homeowner",
    short: "Homeowners",
    blurb: "You have space for a backyard home. See if the numbers work, and how rent could pay it off.",
    image: "homeowner",
  },
  renter: {
    role: "renter",
    path: "/renter",
    choice: "I'm looking for a home",
    short: "Renters",
    blurb: "You need a stable, affordable place. See what you could pay and which homes might fit.",
    image: "renter",
  },
  partner: {
    role: "partner",
    path: "/partner",
    choice: "I represent a community partner",
    short: "Partners",
    blurb: "You fund or run a housing program. See how far your budget goes and who it houses.",
    image: "partner",
  },
};

export const isRole = (v: unknown): v is Role => v === "homeowner" || v === "renter" || v === "partner";

export function loadRole(): Role | null {
  const r = loadJson<unknown>("role", null);
  return isRole(r) ? r : null;
}

export function saveRole(role: Role): void {
  saveJson("role", role);
}
