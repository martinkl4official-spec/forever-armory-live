import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";

import { characterFullName, type Character } from "@/lib/wow-types";

const BREATHE_AMP = 0.02;
const BREATHE_LIFT = 6;
const BREATHE_MS = 3400;
/** Blizzard main-raw has large empty margins — zoom so the hero fills the stage. */
const PORTRAIT_HEIGHT = "155%";

/** Official Blizzard Forever character render with a gentle breathing idle. */
export function CharacterPortrait({ character }: { character: Character }) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const breatheRef = useRef<HTMLDivElement>(null);
  const src = character.renderUrl;
  const label = characterFullName(character);

  useEffect(() => {
    setReady(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (!src || failed) return;
    let frame = 0;
    const tick = (now: number) => {
      const breathe = breatheRef.current;
      if (breathe) {
        const t = (now % BREATHE_MS) / BREATHE_MS;
        const wave = Math.sin(t * Math.PI * 2);
        breathe.style.transform = `translateY(${-wave * BREATHE_LIFT}px) scale(${1 + wave * BREATHE_AMP})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [src, failed]);

  if (!src || failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="size-7" aria-hidden />
        </div>
        <p className="text-sm font-medium text-foreground">Portrait unavailable</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Blizzard hasn&apos;t published a render for this hero yet (common below level 10 or before logout).
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 72%, #2a2d3a 0%, #12141a 55%, #0a0b10 100%)",
      }}
      role="img"
      aria-label={`${label} character portrait`}
    >
      <div
        ref={breatheRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "50% 55%" }}
      >
        {!ready && (
          <div className="flex size-full items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        )}
        <img
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{
            height: PORTRAIT_HEIGHT,
            width: "auto",
            opacity: ready ? 1 : 0,
            filter: "drop-shadow(0 28px 42px rgba(0,0,0,0.7))",
          }}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}
