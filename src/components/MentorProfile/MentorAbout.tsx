interface MentorAboutProps {
    content: string;
}

export default function MentorAbout({ content }: MentorAboutProps) {
    return (
        <section className="grid gap-3">
            <h2 className="m-0 text-[22px] font-extrabold text-[#1f2430] max-[520px]:text-[20px]">About</h2>
            <p className="m-0 text-[15px] leading-[1.65] text-[#4b5160]">{content}</p>
        </section>
    );
}
