interface MentorHeaderProps {
    coverImage?: string;
    avatarUrl?: string;
}

export default function MentorHeader({ coverImage, avatarUrl }: MentorHeaderProps) {
    const avatarStyle = avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined;

    return (
        <header className="relative h-[260px] overflow-visible border-b border-[#e2e8f0] max-[720px]:h-[220px] max-[520px]:h-[200px]">
            <div
                className="h-full w-full bg-gradient-to-b from-[#7590b8] via-[#b8c7d9] to-[#dbe2ec] bg-cover bg-center saturate-90"
                style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
            />
            <div
                className="absolute left-14 -bottom-[90px] h-[190px] w-[190px] rounded-full border-[6px] border-white bg-center bg-cover shadow-[0_14px_35px_rgba(0,0,0,0.16)] max-[1000px]:left-1/2 max-[1000px]:-bottom-[72px] max-[1000px]:h-[150px] max-[1000px]:w-[150px] max-[1000px]:-translate-x-1/2 max-[720px]:-bottom-[64px] max-[720px]:h-[130px] max-[720px]:w-[130px] max-[520px]:-bottom-[56px] max-[520px]:h-[112px] max-[520px]:w-[112px] max-[520px]:border-[4px]"
                style={avatarStyle}
                aria-label="Mentor avatar"
            />
        </header>
    );
}
