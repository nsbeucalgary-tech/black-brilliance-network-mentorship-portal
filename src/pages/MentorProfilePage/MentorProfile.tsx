import MentorAbout from "../../components/MentorProfile/MentorAbout";
import MentorExperience from "../../components/MentorProfile/MentorExperience";
import MentorExpertise from "../../components/MentorProfile/MentorExpertise";
import MentorHeader from "../../components/MentorProfile/MentorHeader";
import MentorLinks from "../../components/MentorProfile/MentorLinks";
import mentorCover from "../../assets/images/bg 2.png";
import mentorAvatar from "../../assets/images/face-portrait-manager-happy-black-600nw-2278812777 12.png";
import "./MentorProfile.css";

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
        <div className="mentor-page">
            <div className="mentor-hero-wrapper">
                <MentorHeader
                    experiences={mentorExperiences}
                    coverImage={mentorCover}
                    avatarUrl={mentorAvatar}
                />
                <div className="mentor-identity-block">
                    <div className="mentor-name-row">
                        <h1 className="mentor-name">{mentorIdentity.name}</h1>
                        <span className="mentor-pronoun">{mentorIdentity.pronouns}</span>
                    </div>
                    <p className="mentor-title">{mentorIdentity.title}</p>
                    <p className="mentor-location">{mentorIdentity.location}</p>
                </div>
            </div>
            <div className="mentor-badges-block">
                <div className="mentor-badges-inline">
                    {mentorExperiences.map((experience) => (
                        <span key={experience.company} className="mentor-badge">
                            <span className="mentor-badge-dot" style={{ backgroundColor: experience.color }} />
                            {experience.company}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mentor-layout">
                <MentorLinks links={mentorLinks} />
                <main className="mentor-main">
                    <MentorAbout
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ..."
                    />
                    <MentorExpertise items={mentorExpertise} />
                    <MentorExperience experiences={mentorExperiences} />
                </main>
            </div>
        </div>
    );
}
