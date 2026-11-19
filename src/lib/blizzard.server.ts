import { SLOT_LABELS, type Character, type EquippedItem, type Quality, type Realm, type SlotType } from "./wow-types";

const API = "https://eu.api.blizzard.com";
const LOCALE = "en_GB";
export const NAMESPACES = {
  profile: "profile-forever-eu",
  dynamic: "dynamic-forever-eu",
  static: "static-forever-eu",
};

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    console.error("Blizzard token request failed", res.status, await res.text());
    throw new Error("Could not sign in to Blizzard");
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function bnet<T>(path: string, namespace: string, token: string): Promise<{ status: number; data?: T }> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${API}${path}${sep}namespace=${namespace}&locale=${LOCALE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { status: res.status };
  return { status: res.status, data: (await res.json()) as T };
}

interface BnetName { name: string; type?: string }
interface BnetProfile {
  name: string;
  surname?: string;
  name_search?: string;
  level: number;
  race: BnetName;
  character_class: BnetName;
  active_spec?: BnetName;
  faction: BnetName & { type: string };
  gender?: BnetName;
  guild?: { name: string };
  /** Absent on Forever; ruleset replaces realm. */
  realm?: { name: string; slug: string };
  ruleset?: { name: string; id: number };
  equipped_item_level?: number;
  average_item_level?: number;
  last_login_timestamp?: number;
}
interface BnetEquipment {
  equipped_items: Array<{
    item: { id: number };
    slot: { type: string; name: string };
    quality: { type: string };
    name: string;
    level?: { value: number };
    item_subclass?: { name: string };
    stats?: Array<{ display?: { display_string: string } }>;
    weapon?: { damage?: { display_string: string } };
    armor?: { display?: { display_string: string } };
    media?: { id: number };
  }>;
}
interface BnetMedia { assets?: Array<{ key: string; value: string }> }

async function itemIcon(mediaId: number, token: string): Promise<string | undefined> {
  const r = await bnet<BnetMedia>(`/data/wow/media/item/${mediaId}`, NAMESPACES.static, token);
  return r.data?.assets?.find((a) => a.key === "icon")?.value;
}

/** Forever character slug: lowercase `{firstname}-{lastname}` (unique per region, no realm). */
export function foreverCharacterSlug(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}-${lastName.trim().toLowerCase()}`;
}

interface BnetCharacterMedia {
  assets?: Array<{ key: string; value: string }>;
}

function pickMediaAsset(assets: Array<{ key: string; value: string }> | undefined, keys: string[]): string | undefined {
  if (!assets?.length) return undefined;
  for (const key of keys) {
    const hit = assets.find((a) => a.key === key)?.value;
    if (hit) return hit;
  }
  return undefined;
}

export async function fetchCharacter(
  firstName: string,
  lastName: string,
  token: string,
): Promise<Character | null> {
  const slug = foreverCharacterSlug(firstName, lastName);
  const base = `/profile/wow/character/${encodeURIComponent(slug)}`;
  const [profile, equipment, media] = await Promise.all([
    bnet<BnetProfile>(base, NAMESPACES.profile, token),
    bnet<BnetEquipment>(`${base}/equipment`, NAMESPACES.profile, token),
    bnet<BnetCharacterMedia>(`${base}/character-media`, NAMESPACES.profile, token),
  ]);
  if (profile.status === 404) return null;
  if (!profile.data) throw new Error(`Blizzard profile request failed (${profile.status})`);

  const p = profile.data;
  const raw = equipment.data?.equipped_items ?? [];
  const items: EquippedItem[] = await Promise.all(
    raw
      .filter((i) => i.slot.type in SLOT_LABELS)
      .map(async (i) => {
        const stats = [
          i.weapon?.damage?.display_string,
          i.armor?.display?.display_string,
          ...(i.stats ?? []).map((s) => s.display?.display_string),
        ].filter((s): s is string => !!s);
        return {
          id: i.item.id,
          slot: i.slot.type as SlotType,
          slotName: SLOT_LABELS[i.slot.type as SlotType],
          name: i.name,
          quality: (i.quality?.type ?? "COMMON") as Quality,
          itemLevel: i.level?.value,
          subclass: i.item_subclass?.name,
          stats,
          iconUrl: i.media ? await itemIcon(i.media.id, token).catch(() => undefined) : undefined,
        };
      }),
  );

  const faction = p.faction?.type === "HORDE" ? "HORDE" : p.faction?.type === "ALLIANCE" ? "ALLIANCE" : "NEUTRAL";
  const rulesetOrRealm = p.ruleset?.name ?? p.realm?.name ?? "Forever";
  const rulesetOrRealmSlug = p.realm?.slug ?? rulesetOrRealm.toLowerCase().replace(/\s+/g, "-");
  const assets = media.data?.assets;
  return {
    name: p.name,
    surname: p.surname ?? lastName.trim(),
    realm: rulesetOrRealm,
    realmSlug: rulesetOrRealmSlug,
    level: p.level,
    race: p.race?.name ?? "Unknown",
    className: p.character_class?.name ?? "Adventurer",
    spec: p.active_spec?.name,
    faction,
    gender: p.gender?.name,
    guild: p.guild?.name,
    itemLevel: p.equipped_item_level ?? p.average_item_level,
    lastLogin: p.last_login_timestamp,
    renderUrl: pickMediaAsset(assets, ["main-raw", "main-sd-raw", "main"]),
    avatarUrl: pickMediaAsset(assets, ["avatar", "avatar-sd"]),
    items,
  };
}

export async function fetchRealms(token: string): Promise<Realm[]> {
  const r = await bnet<{ realms: Array<{ name: string; slug: string }> }>(
    "/data/wow/realm/index",
    NAMESPACES.dynamic,
    token,
  );
  return (r.data?.realms ?? [])
    .map((x) => ({ name: x.name, slug: x.slug }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
