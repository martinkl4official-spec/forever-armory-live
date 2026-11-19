import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Crown, Clock, Sparkles, Swords, UserRound } from "lucide-react";

import { chooseHands, chooseModel } from "@/lib/character-model";
import { cn } from "@/lib/utils";
import {
  LEFT_SLOTS,
  RIGHT_SLOTS,
  SLOT_LABELS,
  WEAPON_SLOTS,
  characterFullName,
  type Character,
  type SlotType,
} from "@/lib/wow-types";
import { CharacterPortrait } from "./CharacterPortrait";
import { ItemCard } from "./ItemCard";

const CharacterViewer = lazy(() => import("./CharacterViewer"));

function Stage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}

function ModelFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UserRound className="size-7" aria-hidden />
      </div>
      <p className="text-sm font-medium text-foreground">3D figure unavailable</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        Gear still loads below. The model file couldn&apos;t be fetched in this environment.
      </p>
    </div>
  );
}

class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D character viewer failed", error, info.componentStack);
  }

  render() {
    if (this.state.failed) return <ModelFallback />;
    return this.props.children;
  }
}

function SlotColumn({ slots, character, align, offset }: { slots: SlotType[]; character: Character; align: "left" | "right"; offset: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {slots.map((slot, i) => (
        <ItemCard
          key={slot}
          slotLabel={SLOT_LABELS[slot]}
          item={character.items.find((it) => it.slot === slot)}
          align={align}
          delay={(offset + i) * 40}
        />
      ))}
    </div>
  );
}

export function CharacterArmory({ character, source }: { character: Character; source: "blizzard" | "sample" }) {
  const model = chooseModel(character.race, character.className);
  const hands = chooseHands(character);
  const isHorde = character.faction === "HORDE";
  const equipped = character.items.length;
  const displayName = characterFullName(character);
  const lastSeen = character.lastLogin
    ? new Date(character.lastLogin).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <section aria-label={`${displayName} armory`} className="animate-rise-in">
      {/* Character header */}
      <div className="panel mb-6 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-bold shadow-soft ring-2",
              isHorde ? "bg-horde/15 text-horde ring-horde/50" : "bg-alliance/15 text-alliance ring-alliance/50",
            )}
          >
            {character.level}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gold md:text-4xl">{displayName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Level {character.level} {character.race}{" "}
              <span className="font-semibold text-foreground">
                {character.spec ? `${character.spec} ` : ""}
                {character.className}
              </span>{" "}
              · {character.realm}
            </p>
            {character.guild && <p className="mt-0.5 text-sm text-accent">&lt;{character.guild}&gt;</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: Sparkles, label: "Item level", value: character.itemLevel ?? "—" },
            { icon: Swords, label: "Equipped", value: `${equipped}/19` },
            { icon: Clock, label: "Last seen", value: lastSeen ?? "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-background/50 px-4 py-3 shadow-inner">
              <Icon className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="text-base font-semibold text-foreground">{value}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paperdoll: items left / 3D / items right */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">
          <SlotColumn slots={LEFT_SLOTS} character={character} align="left" offset={0} />
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative h-[520px] overflow-hidden rounded-3xl border border-border/60 bg-stage shadow-float lg:h-full lg:min-h-[680px]">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 text-xs text-muted-foreground shadow-soft backdrop-blur">
              <Crown className={cn("size-3.5", isHorde ? "text-horde" : "text-alliance")} aria-hidden />
              {isHorde ? "Horde" : character.faction === "ALLIANCE" ? "Alliance" : "Neutral"}
            </div>
            {character.renderUrl ? (
              <CharacterPortrait character={character} />
            ) : (
              <>
                <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1.5 text-xs text-muted-foreground shadow-soft backdrop-blur">
                  Drag to rotate · scroll to zoom
                </p>
                <ClientOnly fallback={<Stage />}>
                  <ViewerErrorBoundary>
                    <Suspense fallback={<Stage />}>
                      <CharacterViewer model={model} right={hands.right} left={hands.left} />
                    </Suspense>
                  </ViewerErrorBoundary>
                </ClientOnly>
              </>
            )}
          </div>
        </div>

        <div className="order-3">
          <SlotColumn slots={RIGHT_SLOTS} character={character} align="right" offset={8} />
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {WEAPON_SLOTS.map((slot, i) => (
          <ItemCard key={slot} slotLabel={SLOT_LABELS[slot]} item={character.items.find((it) => it.slot === slot)} delay={(16 + i) * 40} />
        ))}
      </div>

      {source === "sample" && (
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Showing a sample hero — live WoW Forever data appears once the Blizzard connection is set up.
        </p>
      )}
    </section>
  );
}
