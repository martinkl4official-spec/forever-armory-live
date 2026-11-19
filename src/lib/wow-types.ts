export type Quality = "POOR" | "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ARTIFACT" | "HEIRLOOM";

export type SlotType =
  | "HEAD" | "NECK" | "SHOULDER" | "BACK" | "CHEST" | "SHIRT" | "TABARD" | "WRIST"
  | "HANDS" | "WAIST" | "LEGS" | "FEET" | "FINGER_1" | "FINGER_2" | "TRINKET_1" | "TRINKET_2"
  | "MAIN_HAND" | "OFF_HAND" | "RANGED";

export interface EquippedItem {
  id: number;
  slot: SlotType;
  slotName: string;
  name: string;
  quality: Quality;
  itemLevel?: number | undefined;
  subclass?: string | undefined;
  stats: string[];
  iconUrl?: string | undefined;
}

export interface Character {
  name: string;
  surname?: string | undefined;
  /** Ruleset name on Forever (e.g. Normal), or sample realm label. */
  realm: string;
  realmSlug: string;
  level: number;
  race: string;
  className: string;
  spec?: string | undefined;
  faction: "ALLIANCE" | "HORDE" | "NEUTRAL";
  gender?: string | undefined;
  guild?: string | undefined;
  itemLevel?: number | undefined;
  lastLogin?: number | undefined;
  /** Official Blizzard Forever render (main-raw), when character-media is available. */
  renderUrl?: string | undefined;
  avatarUrl?: string | undefined;
  items: EquippedItem[];
}

export function characterFullName(c: Pick<Character, "name" | "surname">): string {
  return c.surname ? `${c.name} ${c.surname}` : c.name;
}

export type LookupResult =
  | { status: "ok"; source: "blizzard" | "sample"; character: Character }
  | { status: "not_found"; source: "blizzard" | "sample" }
  | { status: "error"; message: string };

export interface Realm {
  name: string;
  slug: string;
}

export const LEFT_SLOTS: SlotType[] = ["HEAD", "NECK", "SHOULDER", "BACK", "CHEST", "SHIRT", "TABARD", "WRIST"];
export const RIGHT_SLOTS: SlotType[] = ["HANDS", "WAIST", "LEGS", "FEET", "FINGER_1", "FINGER_2", "TRINKET_1", "TRINKET_2"];
export const WEAPON_SLOTS: SlotType[] = ["MAIN_HAND", "OFF_HAND", "RANGED"];

export const SLOT_LABELS: Record<SlotType, string> = {
  HEAD: "Head", NECK: "Neck", SHOULDER: "Shoulders", BACK: "Back", CHEST: "Chest", SHIRT: "Shirt",
  TABARD: "Tabard", WRIST: "Wrists", HANDS: "Hands", WAIST: "Waist", LEGS: "Legs", FEET: "Feet",
  FINGER_1: "Ring", FINGER_2: "Ring", TRINKET_1: "Trinket", TRINKET_2: "Trinket",
  MAIN_HAND: "Main Hand", OFF_HAND: "Off Hand", RANGED: "Ranged",
};
