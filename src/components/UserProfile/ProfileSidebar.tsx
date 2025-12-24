import SectionHeader from "./SectionHeader";

interface LinkItem {
    label: string;
    href: string;
    icon?: string;
}

interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    color: string;
}

interface ProfileSidebarProps {
    initials: string;
    links: LinkItem[];
    experiences: ExperienceItem[];
}

export default function ProfileSidebar({ initials, links, experiences }: ProfileSidebarProps) {
    return (
        <aside className="profile-sidebar">
            <div className="profile-avatar">{initials}</div>
            <div className="sidebar-card">
                <SectionHeader title="Links" />
                <div className="links-list">
                    {links.map((link) => (
                        <a key={link.label} className="link-item" href={link.href} target="_blank" rel="noreferrer">
                            <span className="link-dot" />
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
            <div className="sidebar-card">
                <SectionHeader title="Experience" />
                <div className="experience-card">
                    {experiences.map((experience) => (
                        <div key={experience.company} className="experience-item">
                            <span className="experience-dot" style={{ backgroundColor: experience.color }} />
                            <p className="experience-company">{experience.company}</p>
                            <p className="experience-role">{experience.role}</p>
                            <p className="experience-period">{experience.period}</p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
