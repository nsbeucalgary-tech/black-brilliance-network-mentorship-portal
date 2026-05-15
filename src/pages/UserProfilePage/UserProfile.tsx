import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuthContext";

import AboutSection from "../../components/UserProfile/AboutSection";
import ExperienceSection from "../../components/UserProfile/ExperienceSection";
import InterestsSection from "../../components/UserProfile/InterestsSection";
import MatchingQuestions from "../../components/UserProfile/MatchingQuestions";
import ProfileHeader from "../../components/UserProfile/ProfileHeader";
import ProfileSidebar from "../../components/UserProfile/ProfileSidebar";
import { getInitials } from "../../utils";

/** Assign a deterministic colour to each company based on its first char */
const COMPANY_COLOURS = [
    "#eab308",
    "#3b82f6",
    "#10b981",
    "#f97316",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#9ca3af",
];
function companyColour(company: string, index: number): string {
    return COMPANY_COLOURS[index % COMPANY_COLOURS.length];
}

const matchingQuestions = [
    {
        id: "race",
        title: "Please specify your race",
        helper: "This helps us ensure diverse and meaningful mentorship connections.",
        options: [
            "Black",
            "Asian",
            "Latino",
            "Native American",
            "White",
            "Prefer not to say",
        ],
        multiline: false,
    },
    {
        id: "goals",
        title: "What are your primary goals in this program?",
        helper: "Knowing your goals helps us match you with the right mentor or mentee.",
        options: [
            "Career development",
            "Networking",
            "Skill building",
            "Industry insight",
            "Personal growth",
        ],
    },
    {
        id: "commitment",
        title: "How many hours per month can you commit?",
        helper: "Helps us align expectations between mentors and mentees.",
        options: ["1–2 hrs", "3–5 hrs", "6–10 hrs", "10+ hrs"],
    },
];

export default function UserProfilePage() {
    const { dbUser } = useAuth();
    const navigate = useNavigate();

    // ── Loading state ──────────────────────────────────────────────────────
    if (!dbUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 text-[#7a9b5c]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4e5c3] border-t-[#2d3a1f]" />
                    <p className="text-sm font-medium">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    // ── Derive display data from dbUser ────────────────────────────────────
    const initials = getInitials(dbUser.full_name);

    const links = [
        dbUser.website_url
            ? {
                  label: dbUser.website_url.replace(/^https?:\/\//, ""),
                  href: dbUser.website_url,
              }
            : null,
        dbUser.linkedin_url
            ? {
                  label: dbUser.linkedin_url.replace(/^https?:\/\//, ""),
                  href: dbUser.linkedin_url,
              }
            : null,
    ].filter(Boolean) as { label: string; href: string }[];

    const experiences = (dbUser.experiences ?? []).map((exp, i) => ({
        ...exp,
        color: companyColour(exp.company, i),
    }));

    const interests = dbUser.interests ?? [];
    const isIncomplete = !dbUser.bio || !dbUser.title || !dbUser.location;

    return (
        <div
            className="min-h-screen bg-white px-16 pb-[72px] pt-12 text-[#1f211f]
                        max-[1100px]:px-6 max-[1100px]:pb-12 max-[1100px]:pt-8
                        max-[720px]:px-5  max-[720px]:pb-10  max-[720px]:pt-6
                        max-[520px]:px-4  max-[520px]:pb-8   max-[520px]:pt-5"
        >
            {/* Incomplete profile nudge */}
            {isIncomplete && (
                <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#c5dbb0] bg-[#e8f3dd] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">✏️</span>
                        <p className="text-sm font-medium text-[#2d3a1f]">
                            Your profile is incomplete. Add more details so
                            people can learn about you.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/onboarding")}
                        className="shrink-0 rounded-full bg-[#2d3a1f] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3d4a2b] transition-colors"
                    >
                        Complete profile
                    </button>
                </div>
            )}

            <div
                className="grid items-start gap-8
                            grid-cols-[minmax(0,260px)_minmax(0,1fr)]
                            max-[1100px]:grid-cols-1"
            >
                {/* Profile header — right column, first row */}
                <div className="col-start-2 row-start-1 max-[1100px]:col-start-1 max-[1100px]:row-start-1">
                    <ProfileHeader
                        initials={initials}
                        name={dbUser.full_name}
                        pronouns={dbUser.pronouns ?? ""}
                        title={dbUser.title ?? ""}
                        location={dbUser.location ?? ""}
                        experiences={experiences}
                    />
                </div>

                {/* Sidebar — left column, spans two rows */}
                <div
                    className="col-start-1 row-start-1 row-span-2
                                max-[1100px]:col-start-1 max-[1100px]:row-start-2 max-[1100px]:row-span-1"
                >
                    <ProfileSidebar
                        initials={initials}
                        links={links}
                        experiences={experiences}
                    />
                </div>

                {/* Main content — right column, second row */}
                <main
                    className="col-start-2 row-start-2 grid min-w-0 gap-8
                                 max-[1100px]:col-start-1 max-[1100px]:row-start-3"
                >
                    <AboutSection
                        content={
                            dbUser.bio ??
                            "No bio yet. Click 'Complete profile' to add one."
                        }
                    />
                    <ExperienceSection
                        className="hidden max-[720px]:block"
                        experiences={experiences}
                    />
                    {interests.length > 0 && (
                        <InterestsSection interests={interests} />
                    )}
                    <MatchingQuestions questions={matchingQuestions} />
                </main>
            </div>
        </div>
    );
}
