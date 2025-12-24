import SectionHeader from "./SectionHeader";

interface AboutSectionProps {
    content: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
    return (
        <section className="section-card">
            <SectionHeader title="About" />
            <p className="about-text">{content}</p>
        </section>
    );
}
