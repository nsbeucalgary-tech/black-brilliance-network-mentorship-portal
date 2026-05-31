import type { UserExperience } from "../../types/User";
import { PRONOUNS, INTERESTS } from "./Constants";
import { ExperienceSection } from "./ExperienceSection";
import { Section } from "./Section";
import type { Role } from "./Types";


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

export function StepTwo({
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

                <ExperienceSection
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
                />

                {error && (
                    <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

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
                            onClick={onSubmit}
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
