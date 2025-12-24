import { Icon } from "@iconify/react";

interface MentorLinksProps {
    links: { label: string; href: string; icon: string }[];
}

export default function MentorLinks({ links }: MentorLinksProps) {
    return (
        <aside className="mentor-links">
            <div className="mentor-links-inner">
                <div className="mentor-links-list">
                    {links.map((link) => (
                        <a key={link.label} className="mentor-link" href={link.href} target="_blank" rel="noreferrer">
                            <Icon icon={link.icon} width={18} height={18} />
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
                <button className="mentor-chat">
                    <Icon icon="bi:chat-left-text" width={16} height={16} />
                    Chat
                </button>
            </div>
        </aside>
    );
}
