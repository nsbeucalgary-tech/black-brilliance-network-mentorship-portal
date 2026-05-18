import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../_db_controller/init";
import { useAuth } from "../auth/useAuthContext";
import { UserController } from "../services/UserController";
import { UserRole, type UserExperience } from "../types/User";


const userController = new UserController(db);

type Role = "mentor" | "mentee";

const INTERESTS = [
    "Engineering",
    "Product",
    "Design",
    "Finance",
    "Marketing",
    "Data Science",
    "Medicine",
    "Law",
    "Education",
    "Entrepreneurship",
    "Research",
    "Non-profit",
    "Government",
    "Media",
    "Consulting",
];

const PRONOUNS = [
    "He/Him",
    "She/Her",
    "They/Them",
    "Ze/Zir",
    "Prefer not to say",
];

export default function OnboardingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 2 fields — shared
    const [pronouns, setPronouns] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [title, setTitle] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    // Experience entry
    const [experiences, setExperiences] = useState<UserExperience[]>([]);
    const [expCompany, setExpCompany] = useState("");
    const [expRole, setExpRole] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCurrent, setIsCurrent] = useState(false);

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 8
                  ? [...prev, interest]
                  : prev,
        );
    };

    const addExperience = () => {
        if (!expCompany || !expRole || !startDate) return;

        const period = `${startDate} - ${isCurrent ? "Present" : endDate}`;

        setExperiences((prev) => [
            ...prev,
            {
                company: expCompany,
                role: expRole,
                period,
            },
        ]);

        setExpCompany("");
        setExpRole("");
        setStartDate("");
        setEndDate("");
        setIsCurrent(false);
    };

    const removeExperience = (index: number) => {
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRoleSelect = (selected: Role) => {
        setRole(selected);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!user || !role) return;
        setLoading(true);
        setError("");

        try {
            await userController.updateUser(user.uid, {
                role: role === "mentor" ? UserRole.MENTOR : UserRole.MENTEE,
                pronouns: pronouns || undefined,
                location: location || undefined,
                bio: bio || undefined,
                title: title || undefined,
                website_url: websiteUrl || undefined,
                linkedin_url: linkedinUrl || undefined,
                interests:
                    selectedInterests.length > 0
                        ? selectedInterests
                        : undefined,
                experiences: experiences.length > 0 ? experiences : undefined,
            });
            navigate("/dashboard");
        } catch (e) {
            console.error("[Onboarding] Failed to save profile:", e);
            setError("Failed to save your profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-[#e8f3dd] px-8 py-4 flex items-center gap-3">
                <div className="flex h-8 w-8 gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#2d3a1f]" />
                    <div className="mt-2 h-2 w-2 rounded-full bg-[#2d3a1f]" />
                </div>
                <div className="text-base font-medium leading-tight">
                    <span className="block text-[#2d3a1f]">Black</span>
                    <span className="block text-[#7a9b5c]">Brilliance</span>
                </div>
            </header>

            {/* Progress bar */}
            <div className="h-1 bg-[#e8f3dd]">
                <div
                    className="h-full bg-[#2d3a1f] transition-all duration-500"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                />
            </div>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                {step === 1 ? (
                    <StepOne onSelect={handleRoleSelect} />
                ) : (
                    <StepTwo
                        role={role!}
                        pronouns={pronouns}
                        setPronouns={setPronouns}
                        location={location}
                        setLocation={setLocation}
                        bio={bio}
                        setBio={setBio}
                        title={title}
                        setTitle={setTitle}
                        websiteUrl={websiteUrl}
                        setWebsiteUrl={setWebsiteUrl}
                        linkedinUrl={linkedinUrl}
                        setLinkedinUrl={setLinkedinUrl}
                        selectedInterests={selectedInterests}
                        toggleInterest={toggleInterest}
                        experiences={experiences}
                        expCompany={expCompany}
                        setExpCompany={setExpCompany}
                        expRole={expRole}
                        setExpRole={setExpRole}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        isCurrent={isCurrent}
                        setIsCurrent={setIsCurrent}
                        addExperience={addExperience}
                        removeExperience={removeExperience}
                        onBack={() => setStep(1)}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                )}
            </main>
        </div>
    );
}

// ── Step 1: Role Selection ────────────────────────────────────────────────────

function StepOne({ onSelect }: { onSelect: (role: Role) => void }) {
    return (
        <div className="w-full max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-widest text-[#7a9b5c] uppercase mb-3">
                Step 1 of 2
            </p>
            <h1 className="text-4xl font-extrabold text-[#2d3a1f] mb-3 tracking-tight">
                How will you use BBN?
            </h1>
            <p className="text-[#6b7a5e] mb-12 text-base">
                This helps us match you with the right people and personalise
                your experience.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Mentor card */}
                <button
                    type="button"
                    onClick={() => onSelect("mentor")}
                    className="group relative overflow-hidden rounded-2xl border-2 border-[#d4e5c3] bg-white p-8 text-left hover:border-[#2d3a1f] hover:shadow-[0_8px_30px_rgba(45,58,31,0.12)] transition-all duration-200"
                >
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3dd] text-3xl group-hover:bg-[#2d3a1f] transition-colors duration-200">
                        <span className="group-hover:grayscale-0">🎓</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#2d3a1f] mb-2">
                        I'm a Mentor
                    </h2>
                    <p className="text-sm text-[#6b7a5e] leading-relaxed">
                        I'm an industry professional or alumnus who wants to
                        guide and support students in their career journey.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2d3a1f] group-hover:gap-3 transition-all">
                        Join as Mentor
                        <span>→</span>
                    </div>
                </button>

                {/* Mentee card */}
                <button
                    type="button"
                    onClick={() => onSelect("mentee")}
                    className="group relative overflow-hidden rounded-2xl border-2 border-[#d4e5c3] bg-white p-8 text-left hover:border-[#2d3a1f] hover:shadow-[0_8px_30px_rgba(45,58,31,0.12)] transition-all duration-200"
                >
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3dd] text-3xl group-hover:bg-[#2d3a1f] transition-colors duration-200">
                        <span>🚀</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#2d3a1f] mb-2">
                        I'm a Mentee
                    </h2>
                    <p className="text-sm text-[#6b7a5e] leading-relaxed">
                        I'm a student or early-career professional looking for
                        guidance, networking, and career development.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2d3a1f] group-hover:gap-3 transition-all">
                        Join as Mentee
                        <span>→</span>
                    </div>
                </button>
            </div>
        </div>
    );
}

// ── Step 2: Profile Form ──────────────────────────────────────────────────────

interface StepTwoProps {
    role: Role;
    pronouns: string;
    setPronouns: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
    bio: string;
    setBio: (v: string) => void;
    title: string;
    setTitle: (v: string) => void;
    websiteUrl: string;
    setWebsiteUrl: (v: string) => void;
    linkedinUrl: string;
    setLinkedinUrl: (v: string) => void;
    selectedInterests: string[];
    toggleInterest: (v: string) => void;
    experiences: UserExperience[];
    expCompany: string;
    setExpCompany: (v: string) => void;
    expRole: string;
    setExpRole: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
    endDate: string;
    setEndDate: (v: string) => void;
    isCurrent: boolean;
    setIsCurrent: (v: boolean) => void;
    addExperience: () => void;
    removeExperience: (i: number) => void;
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
    error: string;
}

function StepTwo({
    role,
    pronouns,
    setPronouns,
    location,
    setLocation,
    bio,
    setBio,
    title,
    setTitle,
    websiteUrl,
    setWebsiteUrl,
    linkedinUrl,
    setLinkedinUrl,
    selectedInterests,
    toggleInterest,
    experiences,
    expCompany,
    setExpCompany,
    expRole,
    setExpRole,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isCurrent,
    setIsCurrent,
    addExperience,
    removeExperience,
    onBack,
    onSubmit,
    loading,
    error,
}: StepTwoProps) {
    return (
        <div className="w-full max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-[#7a9b5c] uppercase mb-3">
                Step 2 of 2
            </p>
            <h1 className="text-4xl font-extrabold text-[#2d3a1f] mb-2 tracking-tight">
                Build your profile
            </h1>
            <p className="text-[#6b7a5e] mb-8 text-base">
                You're joining as a{" "}
                <span className="font-semibold text-[#2d3a1f] capitalize">
                    {role}
                </span>
                . Fill in as much as you'd like — you can always update this
                later.
            </p>

            <div className="space-y-6">
                {/* Basic info */}
                <Section title="Basic Info">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Pronouns</label>
                            <select
                                className="input"
                                value={pronouns}
                                onChange={(e) => setPronouns(e.target.value)}
                            >
                                <option value="">Select pronouns</option>
                                {PRONOUNS.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Location</label>
                            <input
                                className="input"
                                placeholder="e.g. Calgary, Alberta"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">
                            {role === "mentor"
                                ? "Current Role"
                                : "Program / Field of Study"}
                        </label>
                        <input
                            className="input"
                            placeholder={
                                role === "mentor"
                                    ? "e.g. Software Engineer at Google"
                                    : "e.g. Computer Engineering, University of Calgary"
                            }
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </Section>

                {/* About */}
                <Section title="About You">
                    <label className="label">Bio</label>
                    <textarea
                        className="input min-h-[110px] resize-y"
                        placeholder={
                            role === "mentor"
                                ? "Share your background and what you hope to offer as a mentor..."
                                : "Tell mentors a bit about yourself and your goals..."
                        }
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={500}
                    />
                    <p className="mt-1 text-right text-xs text-[#9aad8a]">
                        {bio.length}/500
                    </p>
                </Section>

                {/* Links */}
                <Section title="Links">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Website</label>
                            <input
                                className="input"
                                placeholder="https://yourwebsite.com"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">LinkedIn</label>
                            <input
                                className="input"
                                placeholder="https://linkedin.com/in/yourname"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                            />
                        </div>
                    </div>
                </Section>

                {/* Interests */}
                <Section
                    title={`Interests ${selectedInterests.length > 0 ? `(${selectedInterests.length}/8)` : ""}`}
                >
                    <p className="text-xs text-[#7a9b5c] mb-3">
                        Select up to 8 areas that interest you.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {INTERESTS.map((interest) => {
                            const active = selectedInterests.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
                                        active
                                            ? "bg-[#2d3a1f] border-[#2d3a1f] text-white"
                                            : "bg-white border-[#d4e5c3] text-[#4a5c35] hover:border-[#7a9b5c]"
                                    }`}
                                >
                                    {interest}
                                </button>
                            );
                        })}
                    </div>
                </Section>

                {/* Experience */}
                <Section title="Experience">
                    {experiences.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {experiences.map((exp, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border border-[#d4e5c3] bg-[#f4f9ee] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#2d3a1f]">
                                            {exp.role}
                                        </p>
                                        <p className="text-xs text-[#7a9b5c]">
                                            {exp.company} · {exp.period}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(i)}
                                        className="text-xs text-[#c0392b] hover:underline ml-4 shrink-0"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-[#3d4a2b] tracking-wide uppercase">
                                    Company
                                </label>
                                <input
                                    className="w-full rounded-xl border border-[#c9dfaa] bg-[#f4faec] px-4 py-2.5 text-sm text-[#1e2912] placeholder-[#6b7d50] outline-none focus:border-[#AAD576] focus:ring-2 focus:ring-[#AAD576]/20 transition-all"
                                    placeholder="e.g. Acme Corp"
                                    value={expCompany}
                                    onChange={(e) =>
                                        setExpCompany(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-[#3d4a2b] tracking-wide uppercase">
                                    Role / Title
                                </label>
                                <input
                                    className="w-full rounded-xl border border-[#c9dfaa] bg-[#f4faec] px-4 py-2.5 text-sm text-[#1e2912] placeholder-[#6b7d50] outline-none focus:border-[#AAD576] focus:ring-2 focus:ring-[#AAD576]/20 transition-all"
                                    placeholder="e.g. Senior Engineer"
                                    value={expRole}
                                    onChange={(e) => setExpRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-xs font-semibold text-[#3d4a2b] tracking-wide uppercase">
                                    Start Date
                                </label>
                                <input
                                    type="month"
                                    className="w-full rounded-xl border border-[#c9dfaa] bg-[#f4faec] px-4 py-2.5 text-sm text-[#1e2912] outline-none focus:border-[#AAD576] focus:ring-2 focus:ring-[#AAD576]/20 transition-all"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                <label
                                    className={`text-xs font-semibold tracking-wide uppercase transition-colors ${isCurrent ? "text-[#c9dfaa]" : "text-[#3d4a2b]"}`}
                                >
                                    End Date
                                </label>
                                <input
                                    type="month"
                                    className="w-full rounded-xl border border-[#c9dfaa] bg-[#f4faec] px-4 py-2.5 text-sm text-[#1e2912] outline-none focus:border-[#AAD576] focus:ring-2 focus:ring-[#AAD576]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    disabled={isCurrent}
                                />
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer pb-2.5 flex-shrink-0">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isCurrent}
                                        onChange={(e) =>
                                            setIsCurrent(e.target.checked)
                                        }
                                    />
                                    <div className="w-9 h-5 rounded-full bg-[#c9dfaa] peer-checked:bg-[#283618] transition-colors" />
                                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                                </div>
                                <span className="text-sm font-medium text-[#3d4a2b] select-none">
                                    Present
                                </span>
                            </label>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={addExperience}
                        disabled={
                            !expCompany ||
                            !expRole ||
                            !startDate ||
                            (!isCurrent && !endDate)
                        }
                        className="mt-3 rounded-xl border border-[#d4e5c3] bg-white px-4 py-2 text-sm font-semibold text-[#2d3a1f] hover:bg-[#e8f3dd] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        + Add Experience
                    </button>
                </Section>

                {error && (
                    <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 pb-8">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-sm font-medium text-[#7a9b5c] hover:text-[#2d3a1f] transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onSubmit()}
                            className="text-sm text-[#7a9b5c] hover:text-[#2d3a1f] transition-colors"
                        >
                            Skip for now
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="rounded-full bg-[#2d3a1f] px-8 py-3 text-sm font-semibold text-white hover:bg-[#3d4a2b] disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Saving..." : "Complete Profile →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-[#e8f3dd] bg-[#fafcf7] p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#2d3a1f] uppercase mb-4">
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
