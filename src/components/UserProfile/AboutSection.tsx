import SectionHeader from "./SectionHeader";

interface AboutSectionProps {
    content: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
    return (
        <section className="grid gap-3">
            <SectionHeader title="About" />
            <p className="m-0 text-[15px] leading-[1.65] text-[#4b5145]">{content}</p>
        </section>
    );
}
