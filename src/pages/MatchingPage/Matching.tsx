import { useEffect, useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import FiltersDrawer from "../../components/matching/FiltersDrawer";
import MatchesGrid from "../../components/matching/MatchesGrid";
import type { Match } from "../../components/matching/MatchCard";
import { useAuth } from "../../auth/useAuthContext";
import { UserController } from "../../services/UserController";
import { db } from "../../config/firebase";
import DefaultAvatar from "../../assets/images/default-avatar.jpg"

type Tab = "TOP_MATCHES" | "FAVOURITES";
type SortMode = "BEST_MATCH" | "NAME";

export default function Matching() {
    const { dbUser } = useAuth();
    const [users, setUsers] = useState<Match[]>([]);
    const [tab, setTab] = useState<Tab>("TOP_MATCHES");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sortMode, setSortMode] = useState<SortMode>("BEST_MATCH");
    const currentUserId = dbUser?.uid;
    const userController = useMemo(() => {
        return new UserController(db);
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
                        title: u.title ?? (() => {
                            const exp = u.experiences?.at(0);
                            if (exp?.role && exp?.company) return `${exp.role} at ${exp.company}`;
                            if (exp?.role) return exp.role;
                            return "Professional";
                        })(),
                        matchPercent: Math.floor(Math.random() * 20) + 80,
                        avatarUrl:
                            u.avatar_url || DefaultAvatar,
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

        if (sortMode === "BEST_MATCH") {
            rows.sort((a, b) => b.matchPercent - a.matchPercent);
        }

        if (sortMode === "NAME") {
            rows.sort((a, b) => a.name.localeCompare(b.name));
        }

        return rows;
    }, [users, tab, sortMode]);


    return (
        <div className="min-h-full bg-white">
            <FiltersDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {/* Page content */}
            <main className="max-w-none px-10 py-8">
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-10 border-b border-[#e8f3dd]">
                        {(["TOP_MATCHES", "FAVOURITES"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={`pb-3 text-xs tracking-widest font-semibold transition-colors ${tab === t
                                    ? "text-[#2d3a1f] border-b-2 border-[#2d3a1f] -mb-px"
                                    : "text-[#8fa878] hover:text-[#4a5c35]"
                                    }`}
                                onClick={() => setTab(t)}
                            >
                                {t.replace("_", " ")}
                            </button>
                        ))}
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
