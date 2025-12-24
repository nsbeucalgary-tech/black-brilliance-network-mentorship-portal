interface MentorHeaderProps {
    experiences: { company: string; color: string }[];
    coverImage?: string;
    avatarUrl?: string;
}

export default function MentorHeader({ experiences, coverImage, avatarUrl }: MentorHeaderProps) {
    const avatarStyle = avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined;

    return (
        <header className="mentor-hero">
            <div className="mentor-cover" style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}} />
            <div className="mentor-badges">
                {experiences.map((experience) => (
                    <span key={experience.company} className="mentor-badge">
                        <span className="mentor-badge-dot" style={{ backgroundColor: experience.color }} />
                        {experience.company}
                    </span>
                ))}
            </div>
            <div className="mentor-avatar" style={avatarStyle} aria-label="Mentor avatar" />
        </header>
    );
}
