import ExperienceSection from "./ExperienceSection";
import SectionHeader from "./SectionHeader";

interface LinkItem {
    label: string;
    href: string;
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
        <aside className="grid min-w-0 gap-6 sticky top-8 max-[1100px]:static max-[1100px]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            <div className="mx-auto mb-2 grid h-[152px] w-[152px] place-items-center rounded-full bg-[#1f1f1f] text-[32px] font-semibold tracking-[1px] text-[#fefefe] shadow-[0_10px_35px_rgba(0,0,0,0.08)] max-[1100px]:hidden">
                {initials}
            </div>
            <div className="px-1">
                <SectionHeader title="Links" />
                <div className="grid gap-2.5">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            className="flex flex-wrap items-center gap-2.5 break-all font-semibold text-[#2d3128]"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="h-2.5 w-2.5 rounded-full bg-[#4f5d45]" />
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
            <ExperienceSection className="px-1 max-[720px]:hidden" experiences={experiences} />
        </aside>
    );
}
