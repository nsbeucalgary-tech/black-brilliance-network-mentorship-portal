import { Icon } from "@iconify/react";

interface ExperienceItem {
    company: string;
    tenure: string;
    roles: { title: string; period: string }[];
}

interface MentorExperienceProps {
    experiences: ExperienceItem[];
}

export default function MentorExperience({ experiences }: MentorExperienceProps) {
    return (
        <section className="grid gap-3">
            <h2 className="m-0 text-[22px] font-extrabold text-[#1f2430] max-[520px]:text-[20px]">Experience</h2>
            <div className="grid gap-[18px]">
                {experiences.map((exp) => {
                    const iconName = exp.company.toLowerCase().includes("google")
                        ? "simple-icons:google"
                        : "mdi:school-outline";

                    return (
                        <div key={exp.company} className="grid gap-3">
                            <div className="flex items-center gap-2.5">
                                <Icon icon={iconName} width={22} height={22} />
                                <div>
                                    <p className="m-0 text-[16px] font-bold text-[#1f2430]">{exp.company}</p>
                                    <p className="m-0 text-[14px] text-[#7a8291]">{exp.tenure}</p>
                                </div>
                            </div>
                            <div className="grid gap-3 pl-2.5">
                                {exp.roles.map((role) => (
                                    <div
                                        key={`${exp.company}-${role.title}-${role.period}`}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-0.5 h-[34px] w-[2px] bg-[#cdd3e0]" />
                                        <div>
                                            <p className="m-0 font-bold text-[#2f3543]">{role.title}</p>
                                            <p className="mt-0.5 text-[13px] text-[#7c8394]">{role.period}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
