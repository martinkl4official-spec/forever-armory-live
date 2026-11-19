import { useState } from "react";
import { Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EquippedItem, Quality } from "@/lib/wow-types";

const QUALITY_TEXT: Record<Quality, string> = {
  POOR: "text-quality-poor", COMMON: "text-quality-common", UNCOMMON: "text-quality-uncommon",
  RARE: "text-quality-rare", EPIC: "text-quality-epic", LEGENDARY: "text-quality-legendary",
  ARTIFACT: "text-quality-legendary", HEIRLOOM: "text-quality-rare",
};
const QUALITY_RING: Record<Quality, string> = {
  POOR: "ring-quality-poor/60", COMMON: "ring-quality-common/50", UNCOMMON: "ring-quality-uncommon/70",
  RARE: "ring-quality-rare/70", EPIC: "ring-quality-epic/70", LEGENDARY: "ring-quality-legendary/80",
  ARTIFACT: "ring-quality-legendary/80", HEIRLOOM: "ring-quality-rare/70",
};
const QUALITY_GLOW: Record<Quality, string> = {
  POOR: "", COMMON: "", UNCOMMON: "group-hover:shadow-[0_0_24px_-6px_var(--quality-uncommon)]",
  RARE: "group-hover:shadow-[0_0_24px_-6px_var(--quality-rare)]",
  EPIC: "group-hover:shadow-[0_0_24px_-6px_var(--quality-epic)]",
  LEGENDARY: "shadow-[0_0_20px_-8px_var(--quality-legendary)] group-hover:shadow-[0_0_30px_-4px_var(--quality-legendary)]",
  ARTIFACT: "", HEIRLOOM: "",
};

export function ItemCard({ item, slotLabel, align = "left", delay = 0 }: { item?: EquippedItem | undefined; slotLabel: string; align?: "left" | "right"; delay?: number }) {
  const [iconFailed, setIconFailed] = useState(false);

  if (!item) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-surface/40 p-2.5",
          align === "right" && "lg:flex-row-reverse lg:text-right",
        )}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background/60">
          <Shield className="size-5 text-muted-foreground/40" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">{slotLabel}</p>
          <p className="text-sm text-muted-foreground/50">Empty</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      title={[item.name, ...item.stats].join("\n")}
      className={cn(
        "group animate-rise-in flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 p-2.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-float",
        align === "right" && "lg:flex-row-reverse lg:text-right",
      )}
    >
      <div className={cn("relative size-12 shrink-0 overflow-hidden rounded-xl bg-background ring-2 transition-shadow", QUALITY_RING[item.quality], QUALITY_GLOW[item.quality])}>
        {item.iconUrl && !iconFailed ? (
          <img src={item.iconUrl} alt="" loading="lazy" onError={() => setIconFailed(true)} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Shield className={cn("size-5", QUALITY_TEXT[item.quality])} aria-hidden />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {slotLabel}
          {item.itemLevel ? <span className="text-muted-foreground/60"> · ilvl {item.itemLevel}</span> : null}
        </p>
        <p className={cn("truncate text-sm font-semibold", QUALITY_TEXT[item.quality])}>{item.name}</p>
        {item.stats.length > 0 && <p className="truncate text-xs text-muted-foreground/80">{item.stats.slice(0, 2).join(" · ")}</p>}
      </div>
    </div>
  );
}
