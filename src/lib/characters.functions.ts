import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchCharacter, fetchRealms, getAccessToken } from "./blizzard.server";
import { SAMPLE_REALMS, findSampleCharacter } from "./sample-characters";
import type { LookupResult, Realm } from "./wow-types";

const namePart = z.string().trim().regex(/^\p{L}{2,12}$/u, "Each name is 2–12 letters");

const lookupSchema = z.object({
  firstName: namePart,
  lastName: namePart,
});

export const getArmoryStatus = createServerFn({ method: "GET" }).handler(async () => {
  const connected = !!process.env["BLIZZARD_CLIENT_ID"] && !!process.env["BLIZZARD_CLIENT_SECRET"];
  return { connected };
});

export const getRealms = createServerFn({ method: "GET" }).handler(async (): Promise<Realm[]> => {
  const id = process.env["BLIZZARD_CLIENT_ID"];
  const secret = process.env["BLIZZARD_CLIENT_SECRET"];
  if (!id || !secret) return SAMPLE_REALMS;
  try {
    const realms = await fetchRealms(await getAccessToken(id, secret));
    return realms.length ? realms : SAMPLE_REALMS;
  } catch (e) {
    console.error("Realm list failed", e);
    return [];
  }
});

export const lookupCharacter = createServerFn({ method: "GET" })
  .validator((input) => lookupSchema.parse(input))
  .handler(async ({ data }): Promise<LookupResult> => {
    const id = process.env["BLIZZARD_CLIENT_ID"];
    const secret = process.env["BLIZZARD_CLIENT_SECRET"];

    if (!id || !secret) {
      const character = findSampleCharacter(data.firstName, data.lastName);
      return character
        ? { status: "ok", source: "sample", character }
        : { status: "not_found", source: "sample" };
    }

    try {
      const token = await getAccessToken(id, secret);
      const character = await fetchCharacter(data.firstName, data.lastName, token);
      return character
        ? { status: "ok", source: "blizzard", character }
        : { status: "not_found", source: "blizzard" };
    } catch (e) {
      console.error("Character lookup failed", e);
      return { status: "error", message: "The armory is not answering right now. Try again in a moment." };
    }
  });
