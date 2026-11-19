import type { Character } from "./wow-types";

export type ModelKey = "knight" | "raider" | "soldier" | "undead" | "caster" | "dwarf" | "orc" | "human";
export type HandItem = "sword" | "shield" | "bow" | null;

/** Picks which 3D figure represents a character: race first, then class. */
export function chooseModel(race: string, className: string): ModelKey {
  const r = race.toLowerCase();
  const c = className.toLowerCase();
  if (["orc", "troll", "tauren"].some((x) => r.includes(x))) return "orc";
  if (r.includes("undead") || r.includes("forsaken") || r.includes("scourge")) return "undead";
  if (r.includes("dwarf") || r.includes("gnome")) return "dwarf";
  if (c === "warrior" || c === "paladin") return "knight";
  if (c === "rogue") return "raider";
  if (c === "hunter") return "soldier";
  if (c === "mage" || c === "priest" || c === "warlock") return "caster";
  return "human";
}

/** What the 3D figure holds, based on the equipped weapons. */
export function chooseHands(character: Pick<Character, "items" | "className">): { right: HandItem; left: HandItem } {
  const main = character.items.find((i) => i.slot === "MAIN_HAND");
  const off = character.items.find((i) => i.slot === "OFF_HAND");
  const ranged = character.items.find((i) => i.slot === "RANGED");
  const isBow = (s?: string) => !!s && /bow|crossbow|gun/i.test(s);

  const right: HandItem = main ? "sword" : null;
  let left: HandItem = null;
  if (off && /shield/i.test(off.subclass ?? "")) left = "shield";
  else if (character.className.toLowerCase() === "hunter" && ranged && isBow(ranged.subclass)) left = "bow";
  return { right, left };
}
