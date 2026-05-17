import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import FilterChip from "../../components/matching/FilterChip";
import FiltersDrawer from "../../components/matching/FiltersDrawer";
import MatchesGrid from "../../components/matching/MatchesGrid";
import type { Match } from "../../components/matching/MatchCard";
import { Funnel } from "lucide-react";

type Tab = "TOP_MATCHES" | "FAVOURITES";
type SortMode = "BEST_MATCH" | "NAME";

export default function Matching() {
  const [tab, setTab] = useState<Tab>("TOP_MATCHES");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("BEST_MATCH");

  // Mock profiles (swap for DB later)
  const matches: Match[] = [
    ...Array.from({ length: 12 }).map((_, i) => ({
      id: `seed-${i}`,
      name: i % 2 === 0 ? "Temidayo ope" : "Collin Bobbins",
      title: "Marketing and Operation Manager",
      company: "Google",
      matchPercent: i % 5 !== 0 ? 99 : 87,
      avatarUrl:
        i % 2 === 0
          ? "https://i.pinimg.com/236x/74/7f/bb/747fbb0ba576d5453583a8e26c51fa2e.jpg"
          : "https://i.pinimg.com/170x/b5/4f/c0/b54fc0fc3bd8a5775a08061ee30843a1.jpg",
      isFavourite: i % 3 === 0,
    })),
  ];

  // UI filtering/sorting for realism (replace with DB query later)
  const visibleMatches = useMemo(() => {
    let rows = [...matches];

    if (tab === "FAVOURITES") rows = rows.filter((m) => m.isFavourite);

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q)
      );
    }

    if (sortMode === "BEST_MATCH") rows.sort((a, b) => b.matchPercent - a.matchPercent);
    if (sortMode === "NAME") rows.sort((a, b) => a.name.localeCompare(b.name));

    return rows;
  }, [matches, tab, search, sortMode]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-white overflow-y-auto">
        <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        
        {/* Page content */}
        <main className="max-w-none  px-4 lg:px-10 py-8">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 lg:gap-10 border-b border-[#e8f3dd]">
              {(["TOP_MATCHES", "FAVOURITES"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`pb-3 text-xs tracking-widest font-semibold transition-colors ${tab === t
                    ? "text-BBNDarkGreen border-b-2 border-[#2d3a1f] -mb-px"
                    : "text-gray-400 hover:text-[#4a5c35]"
                    }`}
                  onClick={() => setTab(t)}
                >
                  {t.replace("_", " ")}
                </button>
              ))}

              {/* Search bar */}
              <div className="flex-1 flex justify-end pb-4">
                <div className="flex w-full min-w-32 max-w-2xl items-center gap-2 rounded-full bg-gray-200 px-4 py-2">
                  <Search
                    className="w-4 h-4 text-black shrink-0"
                  />
                  <input
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Controls row — chips scroll on mobile; sort/filters on their own row */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Filter chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-1 sm:min-w-0">
                <FilterChip
                  label="Google"
                  onClick={() => alert("Google")}
                />
                <FilterChip
                  label="Calgary, Alberta"
                  onClick={() => alert("Calgary")}
                />
                <FilterChip
                  label="University of Calgary"
                  onClick={() => alert("UCalgary")}
                />
                <FilterChip
                  label="Keywords"
                  onClick={() => alert("Keywords")}
                />
              </div>

              {/* Sort + Filters */}
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:shrink-0 sm:justify-end">
                <div className="flex items-center gap-2 text-sm text-[#4a5c35]">
                  <span className="font-medium">Sort:</span>
                  <select
                    className="rounded-lg border border-[#c5dbb0] bg-white px-3 py-2 text-sm text-[#2d3a1f] focus:outline-none focus:ring-2 focus:ring-[#7a9b5c]"
                    value={sortMode}
                    onChange={(e) =>
                      setSortMode(e.target.value as SortMode)
                    }
                  >
                    <option value="BEST_MATCH">
                      Best Match
                    </option>
                    <option value="NAME">Name</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c5dbb0] bg-white px-4 py-2 text-sm font-medium text-[#3d4a2b] hover:bg-[#e8f3dd] transition-colors"
                  onClick={() => setDrawerOpen(true)}
                >
                  <Funnel className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Results row */}
            <div className="flex items-center gap-3 text-sm text-[#7a9b5c]">
              <span>
                Showing {visibleMatches.length} of {matches.length}{" "}
                results
              </span>
              <button
                type="button"
                className="font-semibold text-[#2d3a1f] hover:underline"
                onClick={() => setTab("TOP_MATCHES")}
              >
                show all
              </button>
            </div>

            {/* Grid */}
            <MatchesGrid matches={visibleMatches} />
          </div>
        </main>
      </div>
    </div>
  );
}
