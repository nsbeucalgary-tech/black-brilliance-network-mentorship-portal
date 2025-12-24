import AboutSection from "../../components/UserProfile/AboutSection";
import InterestsSection from "../../components/UserProfile/InterestsSection";
import MatchingQuestions from "../../components/UserProfile/MatchingQuestions";
import ProfileHeader from "../../components/UserProfile/ProfileHeader";
import ProfileSidebar from "../../components/UserProfile/ProfileSidebar";
import "./UserProfile.css";

const userProfile = {
    name: "Jane Doe",
    pronouns: "She/Her",
    title: "Marketing and Operation Manager at Google",
    location: "Calgary, Alberta",
};

const interests = ["lorem", "ipsum", "dolor", "sit", "amet", "ipsum", "dolor"];

const links = [
    { label: "www.website.com", href: "https://www.website.com", icon: "link" },
    { label: "linkedin.com/", href: "https://www.linkedin.com", icon: "linkedin" },
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
        <div className="profile-page">
            <div className="profile-grid">
                <ProfileSidebar initials="JD" links={links} experiences={experiences} />
                <main className="profile-main">
                    <ProfileHeader
                        name={userProfile.name}
                        pronouns={userProfile.pronouns}
                        title={userProfile.title}
                        location={userProfile.location}
                        experiences={experiences}
                    />
                    <AboutSection
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ..."
                    />
                    <InterestsSection interests={interests} />
                    <MatchingQuestions questions={matchingQuestions} />
                </main>
            </div>
        </div>
    );
}
