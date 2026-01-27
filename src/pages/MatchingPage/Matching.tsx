import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import FilterChip from "../../components/matching/FilterChip";
import FiltersDrawer from "../../components/matching/FiltersDrawer";
import MatchesGrid from "../../components/matching/MatchesGrid";
import type { Match } from "../../components/matching/MatchCard";

import BBNLogo from "../../assets/BBNLogo.svg";

type Tab = "TOP_MATCHES" | "FAVOURITES";
type SortMode = "BEST_MATCH" | "NAME";

export default function Matching() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("TOP_MATCHES");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("BEST_MATCH");

  // Top-right dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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

  const linkBase =
    "flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900";
  const linkActive = "text-neutral-900 border-b-2 border-neutral-900";

  return (
    // Fullscreen overlay so Matching ignores the sidebar layout without editing LoggedInLayout
    <div className="!mt-2 fixed inset-0 z-50 bg-white overflow-y-auto">
      <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Top navbar */}
      <header className="flex w-full border-b bg-white">
        <div className="flex w-full items-center justify-between px-10 py-3">
          {/* Logo */}
          <button
            type="button"
            className="!ml-3 flex items-center gap-3"
            onClick={() => navigate("/home")}
            aria-label="Go Home"
          >
            <img src={BBNLogo} alt="BBN" className="h-8 w-8" />
          </button>

          {/* Nav links */}
          <nav className="!ml-3 flex items-center gap-6">
            <NavLink
              to="/home"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              <span className="text-neutral-400"></span>
              Home
            </NavLink>

            <NavLink
              to="/matching"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              <span className="text-neutral-400"></span>
              Matching
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              <span className="text-neutral-400"></span>
              Events
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              <span className="text-neutral-400"></span>
              Profile
            </NavLink>
          </nav>

          {/* Avatar dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex align-left items-center gap-2 rounded-full px-2 py-1 hover:bg-neutral-100 !mb-2"
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                JD
              </div>
              <span className="text-sm text-neutral-700">▾</span>
            </button>

            {profileOpen && (
              <div className="!z-70 text-center absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold text-neutral-900">Jane Doe</p>
                  <p className="text-xs text-neutral-500">jane.doe@email.com</p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    className="w-full !ml-1.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    My Profile
                  </button>

                  <button
                    type="button"
                    className="w-full !ml-1.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => alert("Settings (todo)")}
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    className="w-full !ml-1.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => alert("Log out (todo)")}
                  >
                    Log out
                  </button>

                  <button
                    type="button"
                    className="w-full !ml-1.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => alert("Help (todo)")}
                  >
                    Help
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="!mx-3 max-w-none px-10 py-8">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-12">
            <button
              type="button"
              className={`text-xs tracking-widest ${
                tab === "TOP_MATCHES"
                  ? "text-neutral-800 font-semibold"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
              onClick={() => setTab("TOP_MATCHES")}
            >
              TOP MATCHES
            </button>

            <button
              type="button"
              className={`text-xs tracking-widest ${
                tab === "FAVOURITES"
                  ? "text-neutral-800 font-semibold"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
              onClick={() => setTab("FAVOURITES")}
            >
              FAVOURITES
            </button>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-4">
            {/* Chips */}
            <div className="flex items-center gap-3">
              <FilterChip label="Google" onClick={() => alert("Google")} />
              <FilterChip label="Calgary, Alberta" onClick={() => alert("Calgary")} />
              <FilterChip
                label="University of Calgary"
                onClick={() => alert("UCalgary")}
              />
              <FilterChip label="Keywords" onClick={() => alert("Keywords")} />
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center">
              <div className="flex w-[520px] items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">
                <span className="text-neutral-500"></span>
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  placeholder="Professional Manager"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Sort + Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span>Sort:</span>
                <select
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                >
                  <option value="BEST_MATCH">Best Match</option>
                  <option value="NAME">Name</option>
                </select>
              </div>

              <button
                type="button"
                className="inline-flex !pr-2 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                onClick={() => setDrawerOpen(true)}
              >
                <span className="text-neutral-500"></span>
                Filters
              </button>
            </div>
          </div>

          {/* Results row */}
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>Showing x of y results</span>
            <button
              type="button"
              className="font-semibold text-neutral-800 hover:underline"
              onClick={() => alert("show all")}
            >
              show all
            </button>
          </div>

          {/* Grid */}
          <MatchesGrid matches={visibleMatches} />
        </div>
      </main>
    </div>
  );
}
