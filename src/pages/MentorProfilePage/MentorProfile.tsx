import { useLocation } from "react-router-dom";

import { useAuth } from "../../auth/useAuthContext";
import MentorAbout from "../../components/MentorProfile/MentorAbout";
import MentorExperience from "../../components/MentorProfile/MentorExperience";
import MentorExpertise from "../../components/MentorProfile/MentorExpertise";
import MentorHeader from "../../components/MentorProfile/MentorHeader";
import MentorLinks from "../../components/MentorProfile/MentorLinks";
import mentorCover from "../../assets/images/bg 2.png";
import type { User } from "../../types/User";

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

export default function MentorProfilePage() {
    const { dbUser } = useAuth();
    const location = useLocation();
    const viewedProfile = (location.state as { profile?: User } | null)?.profile;
    const profile = viewedProfile ?? dbUser;

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 text-[#7a9b5c]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4e5c3] border-t-[#2d3a1f]" />
                    <p className="text-sm font-medium">Loading mentor profile...</p>
                </div>
            </div>
        );
    }

    const mentorIdentity = {
        name: profile.full_name,
        pronouns: profile.pronouns ?? "",
        title: profile.title ?? "Mentor",
        location: profile.location ?? "",
    };

    const mentorLinks = [
        profile.website_url
            ? {
                  label: profile.website_url.replace(/^https?:\/\//, ""),
                  href: profile.website_url,
                  icon: "mdi:link-variant",
              }
            : null,
        profile.linkedin_url
            ? {
                  label: profile.linkedin_url.replace(/^https?:\/\//, ""),
                  href: profile.linkedin_url,
                  icon: "mdi:linkedin",
              }
            : null,
    ].filter(Boolean) as { label: string; href: string; icon: string }[];

    const mentorExperiences = Array.from(
        (profile.experiences ?? []).reduce(
            (groups, experience, index) => {
                const current = groups.get(experience.company) ?? {
                    company: experience.company,
                    tenure: "",
                    color: COMPANY_COLOURS[index % COMPANY_COLOURS.length],
                    roles: [] as { title: string; period: string }[],
                };

                current.roles.push({
                    title: experience.role,
                    period: experience.period,
                });
                groups.set(experience.company, current);
                return groups;
            },
            new Map<
                string,
                {
                    company: string;
                    tenure: string;
                    color: string;
                    roles: { title: string; period: string }[];
                }
            >(),
        ).values(),
    );

    const mentorExpertise = profile.interests ?? [];

    return (
        <div className="min-h-screen bg-white text-[#1f2430]">
            <div className="relative">
                <MentorHeader
                    coverImage={mentorCover}
                    avatarUrl={profile.avatar_url}
                />
                <div className="absolute left-[270px] -bottom-10 z-[1] grid gap-0.5 max-[1000px]:static max-[1000px]:mt-24 max-[1000px]:justify-items-center max-[1000px]:px-5 max-[1000px]:text-center max-[520px]:mt-[84px] max-[520px]:px-3.5">
                    <div className="flex flex-wrap items-center gap-2.5 max-[1000px]:justify-center">
                        <h1 className="m-0 text-[32px] font-extrabold tracking-[-0.3px] break-words max-[720px]:text-[26px]">
                            {mentorIdentity.name}
                        </h1>
                        {mentorIdentity.pronouns && (
                            <span className="text-[13px] font-semibold text-[#5f6672]">
                                {mentorIdentity.pronouns}
                            </span>
                        )}
                    </div>
                    <p className="m-0 text-[16px] font-semibold text-[#3c4452] break-words max-[720px]:text-[14px]">
                        {mentorIdentity.title}
                    </p>
                    <p className="m-0 text-[14px] text-[#7a8291]">
                        {mentorIdentity.location}
                    </p>
                </div>
            </div>
            <div className="mt-4 ml-auto flex w-fit flex-col items-start gap-2.5 pr-14 max-[1000px]:mx-auto max-[1000px]:w-fit max-[1000px]:items-start max-[1000px]:px-0 max-[1000px]:pr-0 max-[1000px]:text-left">
                <div className="flex flex-col items-start gap-2.5">
                    {mentorExperiences.map((experience) => (
                        <span
                            key={experience.company}
                            className="inline-flex items-center gap-2.5 text-[14px] font-bold text-[#3c4235]"
                        >
                            <span
                                className="h-[14px] w-[14px] rounded-full border border-[#d0d9cb] bg-white shadow-[0_0_0_2px_#e8eee0_inset]"
                                style={{ backgroundColor: experience.color }}
                            />
                            {experience.company}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-[120px] grid gap-8 px-14 pb-[72px] pt-5 grid-cols-[minmax(0,220px)_minmax(0,1fr)] max-[1000px]:grid-cols-1 max-[1000px]:px-5 max-[1000px]:pb-12 max-[1000px]:pt-7 max-[720px]:mt-24 max-[720px]:gap-6 max-[720px]:px-[18px] max-[720px]:pb-10 max-[720px]:pt-6 max-[520px]:mt-[88px] max-[520px]:px-3.5 max-[520px]:pb-8 max-[520px]:pt-5">
                <MentorLinks links={mentorLinks} />
                <main className="grid min-w-0 gap-8">
                    <div className="order-1">
                        <MentorAbout
                            content={
                                profile.bio ?? "This mentor hasn't added a bio yet."
                            }
                        />
                    </div>
                    {mentorExperiences.length > 0 && (
                        <div className="order-3 max-[720px]:order-2">
                            <MentorExperience experiences={mentorExperiences} />
                        </div>
                    )}
                    {mentorExpertise.length > 0 && (
                        <div className="order-2 max-[720px]:order-3">
                            <MentorExpertise items={mentorExpertise} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
