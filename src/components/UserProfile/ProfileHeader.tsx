import { Icon } from "@iconify/react";

interface Experience {
    company: string;
    color: string;
}
interface ProfileHeaderProps {
    name: string;
    pronouns: string;
    title: string;
    location: string;
    experiences: Experience[];
}

export default function ProfileHeader({ name, pronouns, title, location, experiences }: ProfileHeaderProps) {
    return (
        <header className="profile-header">
            <div className="profile-heading">
                <div className="profile-name-row">
                    <h1 className="profile-name">{name}</h1>
                    <span className="pronoun-pill">{pronouns}</span>
                </div>
                <p className="profile-title">{title}</p>
                <p className="profile-location">{location}</p>
            </div>
            <div className="profile-meta">
                {experiences.map((experience) => (
                    <div key={experience.company} className="meta-experience">
                        <span className="meta-dot" style={{ backgroundColor: experience.color }} />
                        <span className="meta-label">{experience.company}</span>
                    </div>
                ))}
                <span className="icon-bubble" aria-label="Edit profile">
                    <Icon icon="meteor-icons:pencil" width={16} height={16} />
                </span>
            </div>
        </header>
    );
}
