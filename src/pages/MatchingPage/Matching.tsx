import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";

import FilterChip from "../../components/matching/FilterChip";
import FiltersDrawer from "../../components/matching/FiltersDrawer";
import MatchesGrid from "../../components/matching/MatchesGrid";
import type { Match } from "../../components/matching/MatchCard";
import { useAuth } from "../../auth/useAuthContext";
import { db } from "../../_db_controller/init";
import { MentorshipRelationshipController } from "../../services/MentorshipRelationshipController";
import { UserController } from "../../services/UserController";
import {
    MentorshipRelationshipStatus,
    type MentorshipRelationship,
} from "../../types/MentorshipRelationship";
import { UserRole, type User } from "../../types/User";

type MenteeTab = "TOP_MATCHES" | "FAVOURITES";
type MentorTab = "REQUESTS" | "ACTIVE";
type SortMode = "BEST_MATCH" | "NAME";

type RelationshipWithUser = {
    relationship: MentorshipRelationship;
    counterpart: User | null;
};

const userController = new UserController(db);
const relationshipController = new MentorshipRelationshipController(db);

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function getRelationshipId(relationship: MentorshipRelationship): string {
    return `${relationship.mentor_id}__${relationship.mentee_id}`;
}

function buildMatchPercent(currentUser: User, mentor: User): number {
    const currentInterests = new Set(
        (currentUser.interests ?? []).map((interest) => interest.toLowerCase()),
    );
    const mentorInterests = new Set(
        (mentor.interests ?? []).map((interest) => interest.toLowerCase()),
    );

    const sharedInterestCount = [...currentInterests].filter((interest) =>
        mentorInterests.has(interest),
    ).length;
    const denominator = Math.max(currentInterests.size, mentorInterests.size, 1);
    const sharedInterestScore = Math.round(
        (sharedInterestCount / denominator) * 25,
    );

    const sameLocation =
        currentUser.location &&
        mentor.location &&
        currentUser.location.toLowerCase() === mentor.location.toLowerCase()
            ? 10
            : 0;

    const profileScore = mentor.bio ? 5 : 0;
    const experienceScore = mentor.experiences?.length ? 5 : 0;

    return Math.min(
        99,
        55 + sharedInterestScore + sameLocation + profileScore + experienceScore,
    );
}

async function loadUsersById(ids: string[]): Promise<Record<string, User | null>> {
    const uniqueIds = [...new Set(ids)];
    const users = await Promise.all(
        uniqueIds.map(async (id) => [id, await userController.getUserById(id)] as const),
    );

    return Object.fromEntries(users);
}

export default function Matching() {
    const navigate = useNavigate();
    const { user, dbUser, logout } = useAuth();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [menteeTab, setMenteeTab] = useState<MenteeTab>("TOP_MATCHES");
    const [mentorTab, setMentorTab] = useState<MentorTab>("REQUESTS");
    const [search, setSearch] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("BEST_MATCH");
    const [mentors, setMentors] = useState<User[]>([]);
    const [relationshipsByMentorId, setRelationshipsByMentorId] = useState<
        Record<string, MentorshipRelationship>
    >({});
    const [pendingRelationships, setPendingRelationships] = useState<
        RelationshipWithUser[]
    >([]);
    const [activeRelationships, setActiveRelationships] = useState<
        RelationshipWithUser[]
    >([]);
    const [favouriteMentorIds, setFavouriteMentorIds] = useState<string[]>([]);
    const [profileOpen, setProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actioningRelationshipId, setActioningRelationshipId] = useState<
        string | null
    >(null);

    const profileRef = useRef<HTMLDivElement | null>(null);

    const openProfile = useCallback(
        (profile: User | null | undefined) => {
            if (!profile) return;

            navigate(
                profile.role === UserRole.MENTOR
                    ? "/mentor-profile"
                    : "/user-profile",
                { state: { profile } },
            );
        },
        [navigate],
    );

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!profileRef.current) return;
            if (!profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const refreshMenteeData = useCallback(async () => {
        if (!user || !dbUser || dbUser.role !== UserRole.MENTEE) return;

        setLoading(true);
        setError("");

        try {
            const [mentorRows, relationshipRows] = await Promise.all([
                userController.getUsersByRole(UserRole.MENTOR),
                relationshipController.getRelationshipsForMentee(user.uid),
            ]);

            const mentorList = mentorRows.filter((mentor) => mentor.uid !== user.uid);
            const mentorsById = Object.fromEntries(
                mentorList.map((mentor) => [mentor.uid, mentor]),
            );

            setMentors(mentorList);
            setRelationshipsByMentorId(
                Object.fromEntries(
                    relationshipRows.map((relationship) => [
                        relationship.mentor_id,
                        relationship,
                    ]),
                ),
            );
            setPendingRelationships(
                relationshipRows
                    .filter(
                        (relationship) =>
                            relationship.status === MentorshipRelationshipStatus.PENDING,
                    )
                    .map((relationship) => ({
                        relationship,
                        counterpart: mentorsById[relationship.mentor_id] ?? null,
                    })),
            );
            setActiveRelationships(
                relationshipRows
                    .filter(
                        (relationship) =>
                            relationship.status === MentorshipRelationshipStatus.ACCEPTED,
                    )
                    .map((relationship) => ({
                        relationship,
                        counterpart: mentorsById[relationship.mentor_id] ?? null,
                    })),
            );
        } catch (loadError) {
            console.error("[Matching] Failed to load mentee data:", loadError);
            setError(
                "We couldn't load your mentor matches right now. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, [user, dbUser]);

    const refreshMentorData = useCallback(async () => {
        if (!user || !dbUser || dbUser.role !== UserRole.MENTOR) return;

        setLoading(true);
        setError("");

        try {
            const [pendingRows, activeRows] = await Promise.all([
                relationshipController.getPendingRequestsForMentor(user.uid),
                relationshipController.getRelationshipsForMentor(
                    user.uid,
                    MentorshipRelationshipStatus.ACCEPTED,
                ),
            ]);

            const usersById = await loadUsersById([
                ...pendingRows.map((relationship) => relationship.mentee_id),
                ...activeRows.map((relationship) => relationship.mentee_id),
            ]);

            setMentors([]);
            setRelationshipsByMentorId({});
            setPendingRelationships(
                pendingRows.map((relationship) => ({
                    relationship,
                    counterpart: usersById[relationship.mentee_id] ?? null,
                })),
            );
            setActiveRelationships(
                activeRows.map((relationship) => ({
                    relationship,
                    counterpart: usersById[relationship.mentee_id] ?? null,
                })),
            );
        } catch (loadError) {
            console.error("[Matching] Failed to load mentor data:", loadError);
            setError(
                "We couldn't load your mentorship requests right now. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, [user, dbUser]);

    const refreshCurrentView = useCallback(async () => {
        if (!dbUser) {
            setLoading(false);
            return;
        }

        if (dbUser.role === UserRole.MENTEE) {
            await refreshMenteeData();
            return;
        }

        if (dbUser.role === UserRole.MENTOR) {
            await refreshMentorData();
            return;
        }

        setLoading(false);
    }, [dbUser, refreshMenteeData, refreshMentorData]);

    useEffect(() => {
        void refreshCurrentView();
    }, [refreshCurrentView]);

    const handleCreateRequest = useCallback(
        async (mentorId: string) => {
            if (!user || dbUser?.role !== UserRole.MENTEE) return;

            const relationshipId = `${mentorId}__${user.uid}`;
            setActioningRelationshipId(relationshipId);
            setError("");

            try {
                await relationshipController.createRequest({
                    mentor_id: mentorId,
                    mentee_id: user.uid,
                });
                await refreshCurrentView();
                setManageOpen(true);
            } catch (requestError) {
                console.error("[Matching] Failed to create request:", requestError);
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Failed to send mentorship request.",
                );
            } finally {
                setActioningRelationshipId(null);
            }
        },
        [user, dbUser, refreshCurrentView],
    );

    const handleCancelRequest = useCallback(
        async (relationship: MentorshipRelationship) => {
            const relationshipId = getRelationshipId(relationship);
            setActioningRelationshipId(relationshipId);
            setError("");

            try {
                await relationshipController.cancelRequest(
                    relationship.mentor_id,
                    relationship.mentee_id,
                );
                await refreshCurrentView();
            } catch (cancelError) {
                console.error("[Matching] Failed to cancel request:", cancelError);
                setError(
                    cancelError instanceof Error
                        ? cancelError.message
                        : "Failed to cancel mentorship request.",
                );
            } finally {
                setActioningRelationshipId(null);
            }
        },
        [refreshCurrentView],
    );

    const handleAcceptRequest = useCallback(
        async (relationship: MentorshipRelationship) => {
            const relationshipId = getRelationshipId(relationship);
            setActioningRelationshipId(relationshipId);
            setError("");

            try {
                await relationshipController.acceptRequest(
                    relationship.mentor_id,
                    relationship.mentee_id,
                );
                await refreshCurrentView();
            } catch (acceptError) {
                console.error("[Matching] Failed to accept request:", acceptError);
                setError(
                    acceptError instanceof Error
                        ? acceptError.message
                        : "Failed to accept mentorship request.",
                );
            } finally {
                setActioningRelationshipId(null);
            }
        },
        [refreshCurrentView],
    );

    const handleRejectRequest = useCallback(
        async (relationship: MentorshipRelationship) => {
            const relationshipId = getRelationshipId(relationship);
            setActioningRelationshipId(relationshipId);
            setError("");

            try {
                await relationshipController.rejectRequest(
                    relationship.mentor_id,
                    relationship.mentee_id,
                );
                await refreshCurrentView();
            } catch (rejectError) {
                console.error("[Matching] Failed to reject request:", rejectError);
                setError(
                    rejectError instanceof Error
                        ? rejectError.message
                        : "Failed to reject mentorship request.",
                );
            } finally {
                setActioningRelationshipId(null);
            }
        },
        [refreshCurrentView],
    );

    const handleEndRelationship = useCallback(
        async (relationship: MentorshipRelationship) => {
            if (!window.confirm("End this mentorship relationship?")) return;

            const relationshipId = getRelationshipId(relationship);
            setActioningRelationshipId(relationshipId);
            setError("");

            try {
                await relationshipController.endRelationship(
                    relationship.mentor_id,
                    relationship.mentee_id,
                );
                await refreshCurrentView();
            } catch (endError) {
                console.error("[Matching] Failed to end relationship:", endError);
                setError(
                    endError instanceof Error
                        ? endError.message
                        : "Failed to end mentorship relationship.",
                );
            } finally {
                setActioningRelationshipId(null);
            }
        },
        [refreshCurrentView],
    );

    const toggleFavouriteMentor = useCallback((mentorId: string) => {
        setFavouriteMentorIds((current) =>
            current.includes(mentorId)
                ? current.filter((id) => id !== mentorId)
                : [...current, mentorId],
        );
    }, []);

    const matches: Match[] = useMemo(() => {
        if (!dbUser || dbUser.role !== UserRole.MENTEE) return [];

        return mentors
            .filter((mentor) => {
                const relationship = relationshipsByMentorId[mentor.uid];
                return (
                    relationship?.status !==
                    MentorshipRelationshipStatus.ACCEPTED
                );
            })
            .map((mentor) => {
            const relationship = relationshipsByMentorId[mentor.uid];
            const relationshipId = `${mentor.uid}__${dbUser.uid}`;
            const isPending =
                relationship?.status === MentorshipRelationshipStatus.PENDING;
            const canRequest =
                !relationship ||
                relationship.status === MentorshipRelationshipStatus.REJECTED ||
                relationship.status === MentorshipRelationshipStatus.CANCELLED ||
                relationship.status === MentorshipRelationshipStatus.ENDED;

            return {
                id: mentor.uid,
                name: mentor.full_name,
                title: mentor.title ?? "Mentor",
                company: mentor.experiences?.[0]?.company,
                location: mentor.location,
                matchPercent: buildMatchPercent(dbUser, mentor),
                avatarUrl: mentor.avatar_url,
                initials: getInitials(mentor.full_name),
                isFavourite: favouriteMentorIds.includes(mentor.uid),
                onToggleFavourite: () => toggleFavouriteMentor(mentor.uid),
                onViewProfile: () => openProfile(mentor),
                statusLabel: isPending
                    ? "Awaiting mentor response"
                    : undefined,
                primaryActionLabel: isPending
                    ? "Request pending"
                    : "Request mentorship",
                primaryActionDisabled: isPending,
                primaryActionLoading:
                    actioningRelationshipId === relationshipId,
                onPrimaryAction: canRequest
                    ? () => void handleCreateRequest(mentor.uid)
                    : undefined,
                };
            });
    }, [
        mentors,
        relationshipsByMentorId,
        dbUser,
        favouriteMentorIds,
        actioningRelationshipId,
        handleCreateRequest,
        openProfile,
        toggleFavouriteMentor,
    ]);

    const visibleMatches = useMemo(() => {
        let rows =
            menteeTab === "FAVOURITES"
                ? matches.filter((match) => match.isFavourite)
                : [...matches];

        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (match) =>
                    match.name.toLowerCase().includes(q) ||
                    match.title.toLowerCase().includes(q) ||
                    (match.company?.toLowerCase().includes(q) ?? false) ||
                    (match.location?.toLowerCase().includes(q) ?? false),
            );
        }

        if (sortMode === "BEST_MATCH") {
            rows.sort((a, b) => b.matchPercent - a.matchPercent);
        }

        if (sortMode === "NAME") {
            rows.sort((a, b) => a.name.localeCompare(b.name));
        }

        return rows;
    }, [matches, menteeTab, search, sortMode]);

    const currentProfileName =
        dbUser?.full_name ?? user?.displayName ?? "Your profile";
    const currentProfileEmail = dbUser?.email ?? user?.email ?? "";
    const currentInitials = getInitials(currentProfileName);

    async function handleLogout() {
        try {
            await logout();
            navigate("/");
        } catch (logoutError) {
            console.error("[Matching] Failed to log out:", logoutError);
        }
    }

    const mentorFilterLabels = useMemo(() => {
        const locations = mentors
            .map((mentor) => mentor.location)
            .filter(Boolean)
            .slice(0, 2) as string[];
        const companies = mentors
            .map((mentor) => mentor.experiences?.[0]?.company)
            .filter(Boolean)
            .slice(0, 2) as string[];

        return [...companies, ...locations].slice(0, 4);
    }, [mentors]);

    return (
        <div className="min-h-screen bg-white px-8 py-8">
            <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {dbUser?.role === UserRole.MENTEE && (
                <ManageRequestsDrawer
                    open={manageOpen}
                    onClose={() => setManageOpen(false)}
                    pendingRelationships={pendingRelationships}
                    activeRelationships={activeRelationships}
                    actioningRelationshipId={actioningRelationshipId}
                    onCancelRequest={handleCancelRequest}
                    onEndRelationship={handleEndRelationship}
                    onViewProfile={openProfile}
                />
            )}

            <div className="mx-auto max-w-[1400px]">
                <div className="mb-6 flex items-start justify-between gap-6">
                    <div className="flex items-start gap-10">
                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                            className="flex items-center gap-3 text-left"
                            aria-label="Go Home"
                        >
                            <div className="flex h-10 w-10 gap-1">
                                <div className="h-3 w-3 rounded-full bg-[#2d3a1f]" />
                                <div className="mt-4 h-3 w-3 rounded-full bg-[#2d3a1f]" />
                            </div>
                            <div className="text-xl font-semibold leading-tight">
                                <span className="block text-[#2d3a1f]">Black</span>
                                <span className="block text-[#7a9b5c]">
                                    Brilliance
                                </span>
                            </div>
                        </button>

                        {dbUser?.role === UserRole.MENTEE ? (
                            <div className="pt-3">
                                <div className="flex items-center gap-12">
                                    {(["TOP_MATCHES", "FAVOURITES"] as MenteeTab[]).map(
                                        (tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                className={`pb-3 text-xs font-semibold tracking-widest transition-colors ${
                                                    menteeTab === tab
                                                        ? "border-b-2 border-[#2d3a1f] text-[#2d3a1f]"
                                                        : "text-[#7a9b5c] hover:text-[#2d3a1f]"
                                                }`}
                                                onClick={() => setMenteeTab(tab)}
                                            >
                                                {tab.replace("_", " ")}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : dbUser?.role === UserRole.MENTOR ? (
                            <div className="pt-3">
                                <div className="flex items-center gap-12">
                                    {(["REQUESTS", "ACTIVE"] as MentorTab[]).map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            className={`pb-3 text-xs font-semibold tracking-widest transition-colors ${
                                                mentorTab === tab
                                                    ? "border-b-2 border-[#2d3a1f] text-[#2d3a1f]"
                                                    : "text-[#7a9b5c] hover:text-[#2d3a1f]"
                                            }`}
                                            onClick={() => setMentorTab(tab)}
                                        >
                                            {tab === "ACTIVE"
                                                ? "ACTIVE MENTORSHIPS"
                                                : "REQUESTS"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                        {dbUser?.role === UserRole.MENTEE && (
                            <button
                                type="button"
                                onClick={() => setManageOpen(true)}
                                className="rounded-full border border-[#c5dbb0] bg-[#f4f9ee] px-4 py-2 text-sm font-semibold text-[#2d3a1f] hover:bg-[#e8f3dd] transition-colors"
                            >
                                Manage Requests
                            </button>
                        )}

                        <button
                            type="button"
                            className="rounded-full p-2 text-[#2d3a1f] hover:bg-[#eef5e6] transition-colors"
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline className="h-6 w-6" />
                        </button>
                        <button
                            type="button"
                            className="rounded-full p-2 text-[#2d3a1f] hover:bg-[#eef5e6] transition-colors"
                            aria-label="Messages"
                        >
                            <HiOutlineMail className="h-6 w-6" />
                        </button>

                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-full hover:bg-[#eef5e6] px-1 py-1 transition-colors"
                                onClick={() => setProfileOpen((value) => !value)}
                                aria-haspopup="menu"
                                aria-expanded={profileOpen}
                            >
                                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#2d3a1f] text-xs font-semibold text-white">
                                    {currentInitials}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[#d4e5c3] bg-white shadow-[0_6px_18px_rgba(45,58,31,0.12)]">
                                    <div className="border-b border-[#e8f3dd] px-4 py-3">
                                        <p className="text-sm font-semibold text-[#2d3a1f]">
                                            {currentProfileName}
                                        </p>
                                        <p className="text-xs text-[#7a9b5c]">
                                            {currentProfileEmail}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        {[
                                            {
                                                label: "My Profile",
                                                action: () => {
                                                    setProfileOpen(false);
                                                    openProfile(dbUser);
                                                },
                                            },
                                            {
                                                label: "Settings",
                                                action: () => alert("Settings (todo)"),
                                            },
                                            {
                                                label: "Log out",
                                                action: () => {
                                                    setProfileOpen(false);
                                                    void handleLogout();
                                                },
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
                </div>

                {error && <ErrorBanner message={error} />}

                {!dbUser ? (
                    <EmptyState message="Loading your matching experience..." />
                ) : loading ? (
                    <EmptyState message="Loading matchmaking data..." />
                ) : dbUser.role === UserRole.MENTEE ? (
                    <section className="space-y-5">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-3">
                                {mentorFilterLabels.map((label) => (
                                    <FilterChip key={label} label={label} />
                                ))}
                                {mentorFilterLabels.length === 0 && (
                                    <>
                                        <FilterChip label="Google" />
                                        <FilterChip label="Calgary, Alberta" />
                                        <FilterChip label="University of Calgary" />
                                        <FilterChip label="Keywords" />
                                    </>
                                )}
                            </div>

                            <div className="flex min-w-[280px] flex-1 items-center justify-end gap-4">
                                <div className="flex w-full max-w-[520px] items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-2">
                                    <svg
                                        className="h-4 w-4 shrink-0 text-[#7a9b5c]"
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
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-[#8fa878]"
                                        placeholder="Professional Manager"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-3 text-sm text-[#4a5c35]">
                                    <span>Sort: </span>
                                    <select
                                        className="bg-transparent text-sm font-medium text-[#2d3a1f] outline-none"
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
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#7a9b5c]">
                            <span>
                                Showing {visibleMatches.length} of {matches.length} results
                            </span>
                            <button
                                type="button"
                                className="font-semibold text-[#2d3a1f] hover:underline"
                                onClick={() => setMenteeTab("TOP_MATCHES")}
                            >
                                show all
                            </button>
                        </div>

                        {visibleMatches.length > 0 ? (
                            <MatchesGrid matches={visibleMatches} />
                        ) : (
                            <EmptyState
                                message={
                                    menteeTab === "FAVOURITES"
                                        ? "No favourite mentors yet."
                                        : "No mentors matched your current search."
                                }
                            />
                        )}
                    </section>
                ) : dbUser.role === UserRole.MENTOR ? (
                    <section className="space-y-6">
                        {mentorTab === "REQUESTS" ? (
                            <RelationshipSection
                                eyebrow="Inbox"
                                title="Pending requests"
                                emptyMessage="No mentee requests are waiting for you right now."
                            >
                                {pendingRelationships.map(({ relationship, counterpart }) => {
                                    const relationshipId = getRelationshipId(relationship);

                                    return (
                                        <RelationshipCard
                                            key={relationshipId}
                                            user={counterpart}
                                            onViewProfile={() => openProfile(counterpart)}
                                            metaLabel="Requested mentorship"
                                            actions={[
                                                {
                                                    label: "Accept",
                                                    onClick: () =>
                                                        void handleAcceptRequest(relationship),
                                                    disabled:
                                                        actioningRelationshipId ===
                                                        relationshipId,
                                                    variant: "primary",
                                                },
                                                {
                                                    label: "Decline",
                                                    onClick: () =>
                                                        void handleRejectRequest(relationship),
                                                    disabled:
                                                        actioningRelationshipId ===
                                                        relationshipId,
                                                    variant: "secondary",
                                                },
                                            ]}
                                        />
                                    );
                                })}
                            </RelationshipSection>
                        ) : (
                            <RelationshipSection
                                eyebrow="Active"
                                title="Current mentees"
                                emptyMessage="You don't have any active mentees yet."
                            >
                                {activeRelationships.map(({ relationship, counterpart }) => {
                                    const relationshipId = getRelationshipId(relationship);

                                    return (
                                        <RelationshipCard
                                            key={relationshipId}
                                            user={counterpart}
                                            onViewProfile={() => openProfile(counterpart)}
                                            metaLabel={`Connected since ${
                                                relationship.started_at?.toLocaleDateString() ??
                                                "recently"
                                            }`}
                                            actions={[
                                                {
                                                    label: "End mentorship",
                                                    onClick: () =>
                                                        void handleEndRelationship(relationship),
                                                    disabled:
                                                        actioningRelationshipId ===
                                                        relationshipId,
                                                    variant: "secondary",
                                                },
                                            ]}
                                        />
                                    );
                                })}
                            </RelationshipSection>
                        )}
                    </section>
                ) : (
                    <EmptyState message="Complete onboarding to unlock matchmaking." />
                )}
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-[#d4e5c3] bg-[#fafcf7] px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#7a9b5c]">{message}</p>
        </div>
    );
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
        </div>
    );
}

function RelationshipSection({
    eyebrow,
    title,
    emptyMessage,
    children,
}: {
    eyebrow: string;
    title: string;
    emptyMessage: string;
    children: React.ReactNode;
}) {
    const hasChildren = Array.isArray(children)
        ? children.length > 0
        : Boolean(children);

    return (
        <section className="rounded-3xl border border-[#d4e5c3] bg-[#fafcf7] p-6">
            <p className="text-xs font-semibold tracking-widest text-[#7a9b5c] uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#2d3a1f]">{title}</h2>

            <div className="mt-6 space-y-4">
                {hasChildren ? (
                    children
                ) : (
                    <p className="rounded-2xl border border-dashed border-[#d4e5c3] px-4 py-8 text-center text-sm text-[#7a9b5c]">
                        {emptyMessage}
                    </p>
                )}
            </div>
        </section>
    );
}

function RelationshipCard({
    user,
    onViewProfile,
    metaLabel,
    actions,
}: {
    user: User | null;
    onViewProfile?: () => void;
    metaLabel: string;
    actions: Array<{
        label: string;
        onClick: () => void;
        disabled: boolean;
        variant: "primary" | "secondary";
    }>;
}) {
    return (
        <article
            className={[
                "rounded-2xl border border-[#d4e5c3] bg-white p-4 transition-colors",
                onViewProfile ? "cursor-pointer hover:bg-[#fafcf7]" : "",
            ].join(" ")}
            onClick={onViewProfile}
            onKeyDown={(event) => {
                if (!onViewProfile) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onViewProfile();
                }
            }}
            role={onViewProfile ? "button" : undefined}
            tabIndex={onViewProfile ? 0 : undefined}
        >
            <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8f3dd] text-sm font-bold text-[#2d3a1f]">
                    {getInitials(user?.full_name ?? "U")}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2d3a1f]">
                        {user?.full_name ?? "Unknown user"}
                    </p>
                    <p className="mt-1 text-sm text-[#6b7a5e]">
                        {user?.title ?? "Profile details coming soon"}
                    </p>
                    {user?.location && (
                        <p className="mt-1 text-xs text-[#8da17a]">
                            {user.location}
                        </p>
                    )}
                    <p className="mt-3 text-xs font-medium text-[#7a9b5c]">
                        {metaLabel}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            action.onClick();
                        }}
                        disabled={action.disabled}
                        className={
                            action.variant === "primary"
                                ? "rounded-full bg-[#2d3a1f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d4a2b] transition-colors disabled:opacity-50"
                                : "rounded-full border border-[#c5dbb0] bg-white px-4 py-2 text-sm font-semibold text-[#3d4a2b] hover:bg-[#e8f3dd] transition-colors disabled:opacity-50"
                        }
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </article>
    );
}

function ManageRequestsDrawer({
    open,
    onClose,
    pendingRelationships,
    activeRelationships,
    actioningRelationshipId,
    onCancelRequest,
    onEndRelationship,
    onViewProfile,
}: {
    open: boolean;
    onClose: () => void;
    pendingRelationships: RelationshipWithUser[];
    activeRelationships: RelationshipWithUser[];
    actioningRelationshipId: string | null;
    onCancelRequest: (relationship: MentorshipRelationship) => Promise<void>;
    onEndRelationship: (relationship: MentorshipRelationship) => Promise<void>;
    onViewProfile: (profile: User | null | undefined) => void;
}) {
    return (
        <>
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-black/20"
                    onClick={onClose}
                    aria-label="Close request manager"
                />
            )}

            <aside
                className={[
                    "fixed right-0 top-0 z-50 h-full w-[420px] overflow-y-auto border-l border-[#d4e5c3] bg-white shadow-xl transition-transform duration-200",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-between border-b border-[#e8f3dd] px-5 py-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#7a9b5c] uppercase">
                            Manage
                        </p>
                        <h2 className="text-lg font-bold text-[#2d3a1f]">
                            Your mentorship requests
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-[#4a5c35] hover:bg-[#e8f3dd] transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-6 p-5">
                    <RelationshipSection
                        eyebrow="Pending"
                        title="Requests awaiting response"
                        emptyMessage="You don't have any pending mentorship requests."
                    >
                        {pendingRelationships.map(({ relationship, counterpart }) => {
                            const relationshipId = getRelationshipId(relationship);

                            return (
                                <RelationshipCard
                                    key={relationshipId}
                                    user={counterpart}
                                    onViewProfile={() => onViewProfile(counterpart)}
                                    metaLabel="Awaiting mentor response"
                                    actions={[
                                        {
                                            label: "Cancel request",
                                            onClick: () =>
                                                void onCancelRequest(relationship),
                                            disabled:
                                                actioningRelationshipId ===
                                                relationshipId,
                                            variant: "secondary",
                                        },
                                    ]}
                                />
                            );
                        })}
                    </RelationshipSection>

                    <RelationshipSection
                        eyebrow="Active"
                        title="Current mentors"
                        emptyMessage="You don't have any active mentorships yet."
                    >
                        {activeRelationships.map(({ relationship, counterpart }) => {
                            const relationshipId = getRelationshipId(relationship);

                            return (
                                <RelationshipCard
                                    key={relationshipId}
                                    user={counterpart}
                                    onViewProfile={() => onViewProfile(counterpart)}
                                    metaLabel={`Connected since ${
                                        relationship.started_at?.toLocaleDateString() ??
                                        "recently"
                                    }`}
                                    actions={[
                                        {
                                            label: "End mentorship",
                                            onClick: () =>
                                                void onEndRelationship(relationship),
                                            disabled:
                                                actioningRelationshipId ===
                                                relationshipId,
                                            variant: "secondary",
                                        },
                                    ]}
                                />
                            );
                        })}
                    </RelationshipSection>
                </div>
            </aside>
        </>
    );
}
