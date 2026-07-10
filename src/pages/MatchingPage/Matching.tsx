import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import FilterChip from "../../components/matching/FilterChip";
import FiltersDrawer from "../../components/matching/FiltersDrawer";
import MatchesGrid from "../../components/matching/MatchesGrid";
import type { Match } from "../../components/matching/MatchCard";
import { useAuth } from "../../auth/useAuthContext";
import { UserController } from "../../services/UserController";
import { db } from "../../config/firebase";

type Tab = "TOP_MATCHES" | "FAVOURITES";
type SortMode = "BEST_MATCH" | "NAME";

export default function Matching() {
    const navigate = useNavigate();
    const { dbUser } = useAuth();

    const [users, setUsers] = useState<Match[]>([]);
    const [tab, setTab] = useState<Tab>("TOP_MATCHES");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("BEST_MATCH");

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement | null>(null);
    const currentUserId = dbUser?.uid;
    const userController = useMemo(() => {
        return new UserController(db);
    }, []);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!profileRef.current) return;
            if (!profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // Load users
    useEffect(() => {
        if (!currentUserId) return;

        userController
            .getAllUsers()
            .then((data) => {
                const mappedUsers: Match[] = data
                    .filter((u) => u.uid !== currentUserId)
                    .map((u) => ({
                        id: u.uid,
                        name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
                        title: u.title ?? "Professional",
                        company:
                            u.experiences?.[0]?.company ?? "Unknown Company",
                        matchPercent: Math.floor(Math.random() * 20) + 80,
                        avatarUrl:
                            u.avatar_url || "https://via.placeholder.com/150",
                        isFavourite: false,
                    }));

                setUsers(mappedUsers);
            })
            .catch(console.error);
    }, [currentUserId, userController]);

    const visibleMatches = useMemo(() => {
        let rows = [...users];

        if (tab === "FAVOURITES") {
            rows = rows.filter((m) => m.isFavourite);
        }

        if (search.trim()) {
            const q = search.toLowerCase();

            rows = rows.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.title.toLowerCase().includes(q) ||
                    m.company.toLowerCase().includes(q),
            );
        }

        if (sortMode === "BEST_MATCH") {
            rows.sort((a, b) => b.matchPercent - a.matchPercent);
        }

        if (sortMode === "NAME") {
            rows.sort((a, b) => a.name.localeCompare(b.name));
        }

        return rows;
    }, [users, tab, search, sortMode]);

    const linkBase =
        "flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#4a5c35] hover:text-[#2d3a1f] transition-colors duration-150";
    const linkActive =
        "text-[#2d3a1f] font-semibold border-b-2 border-[#2d3a1f]";

    return (
        <div className="min-h-full bg-white">
            <FiltersDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {/* Top navbar — matches Landing page header style */}
            <header className="flex w-full border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-40">
                <div className="flex w-full items-center justify-between px-10 py-3">
                    {/* Logo — same as Landing */}
                    <button
                        type="button"
                        className="flex items-center gap-3 shrink-0"
                        onClick={() => navigate("/home")}
                        aria-label="Go Home"
                    >
                        <div className="flex h-8 w-8 gap-1">
                            <div className="h-2 w-2 rounded-full bg-[#2d3a1f]" />
                            <div className="mt-2 h-2 w-2 rounded-full bg-[#2d3a1f]" />
                        </div>
                        <div className="text-base font-medium leading-tight">
                            <span className="block text-[#2d3a1f]">Black</span>
                            <span className="block text-[#7a9b5c]">
                                Brilliance
                            </span>
                        </div>
                    </button>

                    {/* Nav links */}
                    <nav className="flex items-center gap-6">
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : ""}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/matching"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : ""}`
                            }
                        >
                            Matching
                        </NavLink>
                        <NavLink
                            to="/calendar"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : ""}`
                            }
                        >
                            Events
                        </NavLink>
                        <NavLink
                            to="/user-profile"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : ""}`
                            }
                        >
                            Profile
                        </NavLink>
                    </nav>

                    {/* Avatar dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-[#e8f3dd] transition-colors"
                            onClick={() => setProfileOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                        >
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#2d3a1f] text-xs font-semibold text-white">
                                JD
                            </div>
                            <span className="text-sm text-[#4a5c35]">▾</span>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-[#d4e5c3] bg-white shadow-[0_6px_18px_rgba(45,58,31,0.12)] z-50">
                                <div className="border-b border-[#e8f3dd] px-4 py-3">
                                    <p className="text-sm font-semibold text-[#2d3a1f]">
                                        Jane Doe
                                    </p>
                                    <p className="text-xs text-[#7a9b5c]">
                                        jane.doe@email.com
                                    </p>
                                </div>
                                <div className="p-2">
                                    {[
                                        {
                                            label: "My Profile",
                                            action: () => {
                                                setProfileOpen(false);
                                                navigate("/user-profile");
                                            },
                                        },
                                        {
                                            label: "Settings",
                                            action: () =>
                                                alert("Settings (todo)"),
                                        },
                                        {
                                            label: "Log out",
                                            action: () =>
                                                alert("Log out (todo)"),
                                        },
                                        {
                                            label: "Help",
                                            action: () => alert("Help (todo)"),
                                        },
                                    ].map(({ label, action }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#3d4a2b] hover:bg-[#e8f3dd] transition-colors"
                                            onClick={action}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="max-w-none px-10 py-8">
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-10 border-b border-[#e8f3dd]">
                        {(["TOP_MATCHES", "FAVOURITES"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={`pb-3 text-xs tracking-widest font-semibold transition-colors ${
                                    tab === t
                                        ? "text-[#2d3a1f] border-b-2 border-[#2d3a1f] -mb-px"
                                        : "text-[#8fa878] hover:text-[#4a5c35]"
                                }`}
                                onClick={() => setTab(t)}
                            >
                                {t.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    {/* Controls row */}
                    <div className="flex w-full items-center gap-4 overflow-auto pb-1">
                        {/* Filter chips */}
                        <div className="flex items-center gap-3 shrink-0">
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

                        {/* Search */}
                        <div className="flex-1 flex justify-center min-w-0">
                            <div className="flex w-full min-w-[180px] items-center gap-2 rounded-full bg-[#e8f3dd] border border-[#c5dbb0] px-4 py-2">
                                <svg
                                    className="w-4 h-4 text-[#7a9b5c] shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    className="w-full bg-transparent text-sm text-[#2d3a1f] outline-none placeholder:text-[#8fa878]"
                                    placeholder="Search by name, title, company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sort + Filters */}
                        <div className="flex items-center gap-3 shrink-0">
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
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                                    />
                                </svg>
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Results row */}
                    <div className="flex items-center gap-3 text-sm text-[#7a9b5c]">
                        <span>
                            Showing {visibleMatches.length} of {users.length}{" "}
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
    );
}
