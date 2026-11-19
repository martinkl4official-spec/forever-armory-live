import { SLOT_LABELS, type Character, type EquippedItem, type Quality, type Realm, type SlotType } from "./wow-types";

const ICON = (name: string) => `https://wow.zamimg.com/images/wow/icons/large/${name}.jpg`;

let nextId = 1;
function it(
  slot: SlotType,
  name: string,
  quality: Quality,
  itemLevel: number,
  icon: string,
  stats: string[],
  subclass?: string,
): EquippedItem {
  return { id: nextId++, slot, slotName: SLOT_LABELS[slot], name, quality, itemLevel, iconUrl: ICON(icon), stats, subclass };
}

export const SAMPLE_REALMS: Realm[] = [
  { name: "Everlight", slug: "everlight" },
  { name: "Stormreach", slug: "stormreach" },
];

export const SAMPLE_CHARACTERS: Character[] = [
  {
    name: "Thrallgar", surname: "Doomhammer", realm: "Normal", realmSlug: "normal", level: 60, race: "Orc", className: "Warrior",
    spec: "Protection", faction: "HORDE", gender: "Male", guild: "Blood of the Wolf", itemLevel: 74, lastLogin: 1795100000000,
    items: [
      it("HEAD", "Helm of Wrath", "EPIC", 76, "inv_helmet_71", ["+40 Stamina", "+17 Strength", "+848 Armor"]),
      it("NECK", "Onyxia Tooth Pendant", "EPIC", 74, "inv_jewelry_necklace_09", ["+12 Agility", "+9 Stamina"]),
      it("SHOULDER", "Pauldrons of Wrath", "EPIC", 76, "inv_shoulder_34", ["+27 Stamina", "+13 Strength"]),
      it("BACK", "Cloak of Draconic Might", "EPIC", 70, "inv_misc_cape_20", ["+16 Strength", "+16 Agility"]),
      it("CHEST", "Breastplate of Wrath", "EPIC", 76, "inv_chest_plate16", ["+40 Stamina", "+17 Strength", "+1047 Armor"]),
      it("SHIRT", "Red Linen Shirt", "COMMON", 10, "inv_shirt_red_01", []),
      it("TABARD", "Tabard of the Horde", "COMMON", 1, "inv_shirt_guildtabard_01", []),
      it("WRIST", "Bracelets of Wrath", "EPIC", 76, "inv_bracer_19", ["+27 Stamina", "+11 Strength"]),
      it("HANDS", "Gauntlets of Wrath", "EPIC", 76, "inv_gauntlets_29", ["+28 Stamina", "+15 Strength"]),
      it("WAIST", "Waistband of Wrath", "EPIC", 76, "inv_belt_09", ["+20 Stamina", "+20 Strength"]),
      it("LEGS", "Legplates of Wrath", "EPIC", 76, "inv_pants_04", ["+40 Stamina", "+19 Strength"]),
      it("FEET", "Sabatons of Wrath", "EPIC", 76, "inv_boots_plate_06", ["+30 Stamina", "+13 Strength"]),
      it("FINGER_1", "Band of Accuria", "EPIC", 78, "inv_jewelry_ring_15", ["+16 Agility", "+10 Stamina"]),
      it("FINGER_2", "Quick Strike Ring", "EPIC", 67, "inv_jewelry_ring_03", ["+5 Strength", "+8 Stamina"]),
      it("TRINKET_1", "Hand of Justice", "RARE", 58, "inv_jewelry_talisman_01", ["Chance on hit: extra attack"]),
      it("TRINKET_2", "Diamond Flask", "RARE", 60, "inv_drink_01", ["Use: +75 Strength for 60 sec"]),
      it("MAIN_HAND", "Thunderfury, Blessed Blade of the Windseeker", "LEGENDARY", 80, "inv_sword_39", ["16 – 30 Damage", "+5 Agility", "+8 Stamina"], "Sword"),
      it("OFF_HAND", "Elementium Reinforced Bulwark", "EPIC", 77, "inv_shield_05", ["+24 Stamina", "+2153 Armor"], "Shield"),
      it("RANGED", "Striker's Mark", "EPIC", 69, "inv_weapon_bow_08", ["+2 Agility"], "Bow"),
    ],
  },
  {
    name: "Elunara", surname: "Moonwhisper", realm: "Normal", realmSlug: "normal", level: 60, race: "Night Elf", className: "Priest",
    spec: "Holy", faction: "ALLIANCE", gender: "Female", guild: "Moonwell Keepers", itemLevel: 68, lastLogin: 1795050000000,
    items: [
      it("HEAD", "Halo of Transcendence", "EPIC", 76, "inv_crown_01", ["+27 Intellect", "+22 Spirit"]),
      it("NECK", "Choker of Enlightenment", "EPIC", 66, "inv_jewelry_necklace_10", ["+10 Intellect", "+10 Stamina"]),
      it("SHOULDER", "Mantle of Prophecy", "EPIC", 66, "inv_shoulder_02", ["+23 Intellect", "+10 Spirit"]),
      it("BACK", "Shroud of Pure Thought", "EPIC", 71, "inv_misc_cape_16", ["+11 Intellect", "+10 Spirit"]),
      it("CHEST", "Robes of Prophecy", "EPIC", 66, "inv_chest_cloth_03", ["+27 Intellect", "+20 Spirit"]),
      it("WRIST", "Vambraces of Prophecy", "EPIC", 66, "inv_bracer_09", ["+14 Intellect", "+10 Spirit"]),
      it("HANDS", "Gloves of Prophecy", "EPIC", 66, "inv_gauntlets_14", ["+15 Intellect", "+10 Spirit"]),
      it("WAIST", "Girdle of Prophecy", "EPIC", 66, "inv_belt_22", ["+22 Intellect", "+10 Spirit"]),
      it("LEGS", "Pants of Prophecy", "EPIC", 66, "inv_pants_08", ["+24 Intellect", "+20 Spirit"]),
      it("FEET", "Boots of Prophecy", "EPIC", 66, "inv_boots_07", ["+18 Intellect", "+15 Spirit"]),
      it("FINGER_1", "Cauterizing Band", "EPIC", 71, "inv_jewelry_ring_31", ["+12 Intellect", "+9 Stamina"]),
      it("FINGER_2", "Rosewine Circle", "RARE", 63, "inv_jewelry_ring_14", ["+9 Intellect", "+8 Spirit"]),
      it("TRINKET_1", "Mindtap Talisman", "RARE", 57, "inv_jewelry_talisman_04", ["Restores 11 mana per 5 sec"]),
      it("TRINKET_2", "Royal Seal of Eldre'Thalas", "RARE", 62, "inv_jewelry_ring_ahnqiraj_04", ["+20 Healing"]),
      it("MAIN_HAND", "Benediction", "EPIC", 75, "inv_staff_30", ["+20 Intellect", "+30 Spirit"], "Staff"),
      it("RANGED", "Wand of Biting Cold", "RARE", 58, "inv_wand_07", ["Frost damage"], "Wand"),
    ],
  },
  {
    name: "Grimbeard", surname: "Ironforge", realm: "PvP", realmSlug: "pvp", level: 58, race: "Dwarf", className: "Paladin",
    spec: "Retribution", faction: "ALLIANCE", gender: "Male", guild: "Ironforge Vanguard", itemLevel: 59, lastLogin: 1794900000000,
    items: [
      it("HEAD", "Lionheart Helm", "EPIC", 65, "inv_helmet_36", ["+18 Strength", "2% Crit"]),
      it("NECK", "Mark of Fordring", "RARE", 60, "inv_jewelry_talisman_07", ["+26 Attack Power"]),
      it("SHOULDER", "Spaulders of Valor", "RARE", 58, "inv_shoulder_30", ["+17 Strength", "+11 Stamina"]),
      it("BACK", "Cape of the Black Baron", "RARE", 62, "inv_misc_cape_11", ["+15 Agility", "+20 Attack Power"]),
      it("CHEST", "Breastplate of Valor", "RARE", 58, "inv_chest_plate03", ["+24 Strength", "+10 Stamina"]),
      it("WRIST", "Bracers of Valor", "RARE", 58, "inv_bracer_17", ["+14 Strength"]),
      it("HANDS", "Gauntlets of Valor", "RARE", 58, "inv_gauntlets_26", ["+17 Strength"]),
      it("WAIST", "Belt of Valor", "RARE", 58, "inv_belt_34", ["+14 Strength", "+8 Stamina"]),
      it("LEGS", "Legplates of Valor", "RARE", 58, "inv_pants_mail_15", ["+23 Strength", "+11 Stamina"]),
      it("FEET", "Boots of Valor", "RARE", 58, "inv_boots_plate_03", ["+20 Stamina", "+8 Strength"]),
      it("FINGER_1", "Painweaver Band", "RARE", 63, "inv_jewelry_ring_09", ["+16 Attack Power", "1% Crit"]),
      it("FINGER_2", "Tarnished Elven Ring", "RARE", 63, "inv_jewelry_ring_05", ["+15 Agility"]),
      it("TRINKET_1", "Blackhand's Breadth", "RARE", 63, "inv_misc_gem_bloodstone_01", ["2% Crit"]),
      it("MAIN_HAND", "Ironfoe", "EPIC", 63, "inv_hammer_04", ["Chance on hit: 2 extra attacks"], "Mace"),
      it("OFF_HAND", "Draconian Deflector", "RARE", 63, "inv_shield_02", ["+7 Stamina", "+2153 Armor"], "Shield"),
    ],
  },
  {
    name: "Vexmorrow", surname: "Darkweave", realm: "PvP", realmSlug: "pvp", level: 60, race: "Undead", className: "Warlock",
    spec: "Destruction", faction: "HORDE", gender: "Male", guild: "Deathknell Covenant", itemLevel: 66, lastLogin: 1795080000000,
    items: [
      it("HEAD", "Felheart Horns", "EPIC", 66, "inv_helmet_08", ["+20 Stamina", "+20 Intellect"]),
      it("NECK", "Choker of the Fire Lord", "EPIC", 78, "inv_jewelry_necklace_17", ["+34 Spell Power"]),
      it("SHOULDER", "Felheart Shoulder Pads", "EPIC", 66, "inv_shoulder_23", ["+18 Stamina", "+11 Intellect"]),
      it("BACK", "Cloak of the Shrouded Mists", "EPIC", 71, "inv_misc_cape_18", ["+12 Agility"]),
      it("CHEST", "Felheart Robes", "EPIC", 66, "inv_chest_cloth_09", ["+31 Stamina", "+20 Intellect"]),
      it("WRIST", "Felheart Bracers", "EPIC", 66, "inv_bracer_07", ["+18 Stamina", "+11 Intellect"]),
      it("HANDS", "Felheart Gloves", "EPIC", 66, "inv_gauntlets_19", ["+17 Stamina", "+15 Intellect"]),
      it("WAIST", "Felheart Belt", "EPIC", 66, "inv_belt_13", ["+18 Stamina", "+15 Intellect"]),
      it("LEGS", "Felheart Pants", "EPIC", 66, "inv_pants_cloth_14", ["+19 Stamina", "+20 Intellect"]),
      it("FEET", "Felheart Slippers", "EPIC", 66, "inv_boots_cloth_05", ["+18 Stamina", "+11 Intellect"]),
      it("FINGER_1", "Ring of Spell Power", "EPIC", 66, "inv_jewelry_ring_38", ["+33 Spell Power"]),
      it("FINGER_2", "Freezing Band", "RARE", 63, "inv_jewelry_ring_22", ["+10 Frost Resistance"]),
      it("TRINKET_1", "Talisman of Ephemeral Power", "EPIC", 66, "inv_misc_stonetablet_11", ["Use: +175 Spell Power"]),
      it("MAIN_HAND", "Azuresong Mageblade", "EPIC", 71, "inv_sword_39", ["+40 Spell Power", "+7 Intellect"], "Sword"),
      it("OFF_HAND", "Fire Runed Grimoire", "EPIC", 66, "inv_misc_book_09", ["+21 Spell Power"], "Held In Off-hand"),
      it("RANGED", "Touch of Chaos", "RARE", 62, "inv_wand_09", ["Shadow damage"], "Wand"),
    ],
  },
  {
    name: "Sylvaris", surname: "Greenwood", realm: "Normal", realmSlug: "normal", level: 55, race: "Human", className: "Hunter",
    spec: "Marksmanship", faction: "ALLIANCE", gender: "Female", guild: "Westfall Rangers", itemLevel: 54, lastLogin: 1794800000000,
    items: [
      it("HEAD", "Beaststalker's Cap", "RARE", 59, "inv_helmet_01", ["+20 Agility", "+10 Stamina"]),
      it("NECK", "Imperial Jewel", "RARE", 60, "inv_jewelry_necklace_04", ["+16 Agility"]),
      it("SHOULDER", "Beaststalker's Mantle", "RARE", 59, "inv_shoulder_10", ["+15 Agility"]),
      it("BACK", "Cape of the Wild", "UNCOMMON", 50, "inv_misc_cape_06", ["+7 Agility"]),
      it("CHEST", "Beaststalker's Tunic", "RARE", 59, "inv_chest_chain_03", ["+21 Agility", "+16 Stamina"]),
      it("HANDS", "Beaststalker's Gloves", "RARE", 59, "inv_gauntlets_10", ["+14 Agility"]),
      it("WAIST", "Beaststalker's Belt", "RARE", 59, "inv_belt_28", ["+14 Agility"]),
      it("LEGS", "Beaststalker's Pants", "RARE", 59, "inv_pants_mail_03", ["+18 Agility", "+12 Stamina"]),
      it("FEET", "Beaststalker's Boots", "RARE", 59, "inv_boots_08", ["+16 Agility"]),
      it("FINGER_1", "Hunter's Ring", "UNCOMMON", 52, "inv_jewelry_ring_12", ["+6 Agility"]),
      it("TRINKET_1", "Devilsaur Eye", "RARE", 60, "inv_misc_eye_01", ["Use: +150 Attack Power"]),
      it("MAIN_HAND", "Wolfrunner's Blade", "UNCOMMON", 48, "inv_sword_26", ["+5 Agility"], "Sword"),
      it("RANGED", "Verdant Keeper's Aim", "RARE", 60, "inv_weapon_bow_02", ["+5 Agility"], "Bow"),
    ],
  },
];

export function findSampleCharacter(firstName: string, lastName: string): Character | undefined {
  const first = firstName.trim().toLowerCase();
  const last = lastName.trim().toLowerCase();
  return SAMPLE_CHARACTERS.find(
    (c) => c.name.toLowerCase() === first && (c.surname?.toLowerCase() ?? "") === last,
  );
}
