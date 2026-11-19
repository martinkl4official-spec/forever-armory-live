import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ScrollText, Search as SearchIcon, UserX } from "lucide-react";

import logo from "@/assets/wow-forever-logo.webp";
import heroImage from "@/assets/hero-landscape.webp";
import { Button } from "@/components/ui/button";
import { CharacterArmory } from "@/components/wow/CharacterArmory";
import { SearchBar } from "@/components/wow/SearchBar";
import { getArmoryStatus, lookupCharacter } from "@/lib/characters.functions";
import { SAMPLE_CHARACTERS } from "@/lib/sample-characters";
import { characterFullName } from "@/lib/wow-types";

const searchSchema = z.object({
  first: z.string().optional(),
  last: z.string().optional(),
});

const statusQuery = queryOptions({ queryKey: ["armory-status"], queryFn: () => getArmoryStatus(), staleTime: 1000 * 60 * 5 });

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(statusQuery),
  head: () => ({
    meta: [
      { title: "WoW Forever Armory — 3D Character Lookup" },
      {
        name: "description",
        content: "Search any World of Warcraft Forever character by name and see them in 3D with every equipped item.",
      },
      { property: "og:title", content: "WoW Forever Armory — 3D Character Lookup" },
      {
        property: "og:description",
        content: "Search any World of Warcraft Forever character by name and see them in 3D with every equipped item.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { first, last } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const lookup = useServerFn(lookupCharacter);
  const { data: status } = useQuery(statusQuery);

  const hasName = !!first && !!last;

  const result = useQuery({
    queryKey: ["character", "v2", first?.toLowerCase(), last?.toLowerCase()],
    queryFn: () => lookup({ data: { firstName: first!, lastName: last! } }),
    enabled: hasName,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });

  function search(firstName: string, lastName: string) {
    navigate({ search: { first: firstName, last: lastName } });
    requestAnimationFrame(() => document.getElementById("armory")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const connected = status?.connected ?? false;
  const searchedLabel = hasName ? `${first} ${last}` : "";

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 -z-20 size-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="absolute inset-0 -z-10 bg-bottom-fade" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-10 text-center md:items-start md:pb-28 md:pt-14 md:text-left">
          <img src={logo} alt="WoW Forever" className="logo-shadow animate-float-slow w-56 md:w-72" width={900} height={618} />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-accent">The Forever Armory</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Every hero. <span className="text-gold">Every piece of gear.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            Look up any WoW Forever character by first and last name and inspect them in 3D, down to the last ring.
          </p>

          <div className="mt-8 w-full max-w-3xl">
            <SearchBar
              initialFirst={first}
              initialLast={last}
              loading={result.isFetching}
              onSearch={search}
            />
          </div>

          {!connected && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="text-xs text-muted-foreground">Try a sample hero:</span>
              {SAMPLE_CHARACTERS.map((c) => (
                <Button
                  key={`${c.name}-${c.surname}`}
                  variant="chip"
                  size="sm"
                  onClick={() => search(c.name, c.surname!)}
                >
                  {characterFullName(c)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <div id="armory" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-24">
        {!hasName && <EmptyState />}
        {hasName && result.isPending && <LoadingState />}
        {hasName && result.data?.status === "ok" && (
          <CharacterArmory character={result.data.character} source={result.data.source} />
        )}
        {hasName && result.data?.status === "not_found" && (
          <Message icon={UserX} title={`No hero named “${searchedLabel}” found`}>
            {result.data.source === "sample"
              ? "Live search isn't connected yet — try one of the sample heroes above."
              : "Check the spelling of both names, then search again. Profiles appear for characters level 10+ after they log out."}
          </Message>
        )}
        {hasName && (result.data?.status === "error" || result.isError) && (
          <Message icon={ScrollText} title="The armory didn't answer">
            {result.data?.status === "error" ? result.data.message : "Please try again in a moment."}
          </Message>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <Message icon={SearchIcon} title="Search for a hero to begin">
      Enter a first and last name above — their 3D figure and equipped items will appear here.
    </Message>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr_1fr]" aria-busy="true">
      {[0, 1, 2].map((col) => (
        <div key={col} className="flex flex-col gap-2.5">
          {col === 1 ? (
            <div className="h-[460px] animate-pulse rounded-3xl bg-surface shadow-soft lg:h-[640px]" />
          ) : (
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[68px] animate-pulse rounded-2xl bg-surface shadow-soft" />)
          )}
        </div>
      ))}
    </div>
  );
}

function Message({ icon: Icon, title, children }: { icon: typeof SearchIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="panel mx-auto flex max-w-xl flex-col items-center px-8 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow">
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
