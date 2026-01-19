import SectionHeader from "./SectionHeader";

interface InterestsSectionProps {
    interests: string[];
}

export default function InterestsSection({ interests }: InterestsSectionProps) {
    return (
        <section className="grid gap-3">
            <SectionHeader title="Interests" />
            <div className="flex flex-wrap gap-2.5">
                {interests.map((interest) => (
                    <span
                        key={interest}
                        className="rounded-2xl border border-[#d9e5c7] bg-[#e9f5db] px-4 py-2.5 text-[13.5px] font-semibold tracking-[-0.1px] text-[#4b5145]"
                    >
                        {interest}
                    </span>
                ))}
            </div>
        </section>
    );
}
