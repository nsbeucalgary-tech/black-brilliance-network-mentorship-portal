import { Icon } from "@iconify/react";

interface MentorExpertiseProps {
    items: string[];
}

export default function MentorExpertise({ items }: MentorExpertiseProps) {
    return (
        <section className="mentor-section">
            <div className="mentor-expertise-header">
                <Icon icon="mdi:diamond-stone" width={22} height={22} />
                <h2 className="mentor-section-title">Expertise</h2>
                <span className="mentor-help-text">I can help with</span>
            </div>
            <div className="mentor-pill-row">
                {items.map((item) => (
                    <span key={item} className="mentor-pill">
                        {item}
                    </span>
                ))}
            </div>
        </section>
    );
}
