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
        <section className="mentor-section">
            <h2 className="mentor-section-title">Experience</h2>
            <div className="mentor-experience-list">
                {experiences.map((exp) => (
                    <div key={exp.company} className="mentor-experience-card">
                        <div className="mentor-exp-header">
                            <Icon icon="simple-icons:google" width={22} height={22} />
                            <div>
                                <p className="mentor-exp-company">{exp.company}</p>
                                <p className="mentor-exp-tenure">{exp.tenure}</p>
                            </div>
                        </div>
                        <div className="mentor-exp-roles">
                            {exp.roles.map((role) => (
                                <div key={`${exp.company}-${role.title}-${role.period}`} className="mentor-exp-role">
                                    <div className="mentor-exp-line" />
                                    <div>
                                        <p className="mentor-role-title">{role.title}</p>
                                        <p className="mentor-role-period">{role.period}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
