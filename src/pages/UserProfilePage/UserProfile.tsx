import AboutSection from "../../components/UserProfile/AboutSection";
import ExperienceSection from "../../components/UserProfile/ExperienceSection";
import InterestsSection from "../../components/UserProfile/InterestsSection";
import MatchingQuestions from "../../components/UserProfile/MatchingQuestions";
import ProfileHeader from "../../components/UserProfile/ProfileHeader";
import ProfileSidebar from "../../components/UserProfile/ProfileSidebar";

const userProfile = {
    name: "Jane Doe",
    pronouns: "She/Her",
    title: "Marketing and Operation Manager at Google",
    location: "Calgary, Alberta",
};

const interests = ["lorem", "ipsum", "dolor", "sit", "amet", "ipsum", "dolor"];

const links = [
    { label: "www.website.com", href: "https://www.website.com" },
    { label: "linkedin.com/", href: "https://www.linkedin.com" },
];

const experiences = [
    {
        company: "Google LLC",
        role: "Manager",
        period: "Jan 2025 - Present",
        color: "#eab308",
    },
    {
        company: "Icom",
        role: "Lorem",
        period: "Jan 2020 - Jun 2025",
        color: "#9ca3af",
    },
];

const matchingQuestions = [
    {
        id: "race",
        title: "Please specify your race",
        helper:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        options: ["Black", "Asian", "Latino", "Native American", "White"],
        answer: "Black",
        multiline: true,
    },
    {
        id: "q1",
        title: "Lorem Ipsum dolor sit amet",
        helper:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        options: ["Option one", "Option two", "Option three"],
    },
    {
        id: "q2",
        title: "Lorem Ipsum dolor sit amet",
        helper:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        options: ["Option one", "Option two", "Option three"],
    },
    {
        id: "q3",
        title: "Lorem Ipsum dolor sit amet",
        helper:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        options: ["Option one", "Option two", "Option three"],
    },
];

export default function UserProfilePage() {
    return (
        <div className="min-h-screen bg-white px-16 pb-[72px] pt-12 text-[#1f211f] max-[1100px]:px-6 max-[1100px]:pb-12 max-[1100px]:pt-8 max-[720px]:px-5 max-[720px]:pb-10 max-[720px]:pt-6 max-[520px]:px-4 max-[520px]:pb-8 max-[520px]:pt-5">
            <div className="grid items-start gap-8 grid-cols-[minmax(0,260px)_minmax(0,1fr)] max-[1100px]:grid-cols-1">
                <div className="col-start-2 row-start-1 max-[1100px]:col-start-1 max-[1100px]:row-start-1">
                    <ProfileHeader
                        initials="JD"
                        name={userProfile.name}
                        pronouns={userProfile.pronouns}
                        title={userProfile.title}
                        location={userProfile.location}
                        experiences={experiences}
                    />
                </div>
                <div className="col-start-1 row-start-1 row-span-2 max-[1100px]:col-start-1 max-[1100px]:row-start-2 max-[1100px]:row-span-1">
                    <ProfileSidebar initials="JD" links={links} experiences={experiences} />
                </div>
                <main className="col-start-2 row-start-2 grid min-w-0 gap-8 max-[1100px]:col-start-1 max-[1100px]:row-start-3">
                    <AboutSection
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ..."
                    />
                    <ExperienceSection className="hidden max-[720px]:block" experiences={experiences} />
                    <InterestsSection interests={interests} />
                    <MatchingQuestions questions={matchingQuestions} />
                </main>
            </div>
        </div>
    );
}
