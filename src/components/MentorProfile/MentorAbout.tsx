interface MentorAboutProps {
    content: string;
}

export default function MentorAbout({ content }: MentorAboutProps) {
    return (
        <section className="mentor-section">
            <h2 className="mentor-section-title">About</h2>
            <p className="mentor-body-text">{content}</p>
        </section>
    );
}
