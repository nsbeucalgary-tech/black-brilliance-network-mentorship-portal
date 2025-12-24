import SectionHeader from "./SectionHeader";

interface InterestsSectionProps {
    interests: string[];
}

export default function InterestsSection({ interests }: InterestsSectionProps) {
    return (
        <section className="section-card">
            <SectionHeader title="Interests" />
            <div className="interests-row">
                {interests.map((interest) => (
                    <span key={interest} className="interest-pill">
                        {interest}
                    </span>
                ))}
            </div>
        </section>
    );
}
