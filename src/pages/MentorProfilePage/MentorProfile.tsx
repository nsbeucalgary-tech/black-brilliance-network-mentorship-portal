import MentorAbout from "../../components/MentorProfile/MentorAbout";
import MentorExperience from "../../components/MentorProfile/MentorExperience";
import MentorExpertise from "../../components/MentorProfile/MentorExpertise";
import MentorHeader from "../../components/MentorProfile/MentorHeader";
import MentorLinks from "../../components/MentorProfile/MentorLinks";
import mentorCover from "../../assets/images/bg 2.png";
import mentorAvatar from "../../assets/images/face-portrait-manager-happy-black-600nw-2278812777 12.png";

const mentorIdentity = {
    name: "Temidayo Ope",
    pronouns: "She/Her",
    title: "Marketing and Operation Manager at Google",
    location: "Calgary, Alberta",
};

const mentorLinks = [
    { label: "www.website.com", href: "https://www.website.com", icon: "mdi:link-variant" },
    { label: "linkedin.com/", href: "https://www.linkedin.com", icon: "mdi:linkedin" },
];

const mentorExperiences = [
    {
        company: "Google LLC",
        tenure: "25 yrs",
        color: "#eab308",
        roles: [
            { title: "Manager", period: "Jan 2025 - Present" },
            { title: "Intern", period: "Jan 2000 - Jun 2025" },
        ],
    },
    {
        company: "University of Calgary",
        tenure: "",
        color: "#dc7b36",
        roles: [],
    },
];

const mentorExpertise = ["lorem", "ipsum", "dolor", "sit", "amet"];

export default function MentorProfilePage() {
    return (
        <div className="min-h-screen bg-white text-[#1f2430]">
            <div className="relative">
                <MentorHeader
                    coverImage={mentorCover}
                    avatarUrl={mentorAvatar}
                />
                <div className="absolute left-[270px] -bottom-10 z-[1] grid gap-0.5 max-[1000px]:static max-[1000px]:mt-24 max-[1000px]:justify-items-center max-[1000px]:px-5 max-[1000px]:text-center max-[520px]:mt-[84px] max-[520px]:px-3.5">
                    <div className="flex flex-wrap items-center gap-2.5 max-[1000px]:justify-center">
                        <h1 className="m-0 text-[32px] font-extrabold tracking-[-0.3px] break-words max-[720px]:text-[26px]">
                            {mentorIdentity.name}
                        </h1>
                        <span className="text-[13px] font-semibold text-[#5f6672]">{mentorIdentity.pronouns}</span>
                    </div>
                    <p className="m-0 text-[16px] font-semibold text-[#3c4452] break-words max-[720px]:text-[14px]">
                        {mentorIdentity.title}
                    </p>
                    <p className="m-0 text-[14px] text-[#7a8291]">{mentorIdentity.location}</p>
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
                            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ..."
                        />
                    </div>
                    <div className="order-3 max-[720px]:order-2">
                        <MentorExperience experiences={mentorExperiences} />
                    </div>
                    <div className="order-2 max-[720px]:order-3">
                        <MentorExpertise items={mentorExpertise} />
                    </div>
                </main>
            </div>
        </div>
    );
}
