import { useEffect, useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAME_PART = /^\p{L}{2,12}$/u;

export function SearchBar({
  initialFirst = "",
  initialLast = "",
  loading,
  onSearch,
}: {
  initialFirst?: string | undefined;
  initialLast?: string | undefined;
  loading?: boolean | undefined;
  onSearch: (firstName: string, lastName: string) => void;
}) {
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setFirstName(initialFirst), [initialFirst]);
  useEffect(() => setLastName(initialLast), [initialLast]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const first = firstName.trim();
    const last = lastName.trim();
    if (!NAME_PART.test(first) || !NAME_PART.test(last)) {
      setError("First and last names are each 2–12 letters, no spaces or numbers.");
      return;
    }
    setError(null);
    onSearch(first, last);
  }

  return (
    <form onSubmit={submit} className="w-full" role="search" aria-label="Search characters">
      <div className="panel flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-background/60 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-ring/60">
          <Search className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="sr-only">First name</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-background/60 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-ring/60">
          <span className="sr-only">Last name</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
        <Button type="submit" variant="hero" size="xl" disabled={loading} className="sm:px-8">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          Search
        </Button>
      </div>
      {error && <p className="mt-3 pl-2 text-sm text-destructive">{error}</p>}
    </form>
  );
}
