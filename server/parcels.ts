import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Parcel } from "../src/lib/feasibility.js";

// The server never trusts parcel data sent by the browser; it looks parcels up here by id.
const file = fileURLToPath(new URL("../src/data/parcels.json", import.meta.url));
const parcels: Parcel[] = JSON.parse(readFileSync(file, "utf8"));

export function getParcel(id: number): Parcel | undefined {
  return parcels.find((p) => p.id === id);
}
