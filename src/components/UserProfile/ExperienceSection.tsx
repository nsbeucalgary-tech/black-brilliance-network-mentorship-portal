import SectionHeader from "./SectionHeader";

interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    color: string;
}

interface ExperienceSectionProps {
    experiences: ExperienceItem[];
    className?: string;
}

export default function ExperienceSection({ experiences, className = "" }: ExperienceSectionProps) {
    return (
        <div className={className}>
            <SectionHeader title="Experience" />
            <div className="grid gap-[18px] border-l border-[#c7d1bb] pl-3.5">
                {experiences.map((experience) => (
                    <div key={experience.company} className="relative pl-3.5 text-[#353a2e]">
                        <span
                            className="absolute -left-5 top-1.5 h-3 w-3 rounded-full border-[3px] border-[#f7f9f0] shadow-[0_0_0_1px_#c7d1bb]"
                            style={{ backgroundColor: experience.color }}
                        />
                        <p className="m-0 font-bold">{experience.company}</p>
                        <p className="my-1 text-[14px] text-[#505645]">{experience.role}</p>
                        <p className="m-0 text-[13px] text-[#7b7f73]">{experience.period}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
