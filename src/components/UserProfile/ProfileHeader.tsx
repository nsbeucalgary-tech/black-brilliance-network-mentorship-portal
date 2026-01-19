import { Icon } from "@iconify/react";

interface Experience {
    company: string;
    color: string;
}
interface ProfileHeaderProps {
    initials?: string;
    name: string;
    pronouns: string;
    title: string;
    location: string;
    experiences: Experience[];
}

export default function ProfileHeader({ initials, name, pronouns, title, location, experiences }: ProfileHeaderProps) {
    return (
        <header className="flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:justify-between">
            <div className="flex flex-col gap-1.5">
                {initials ? (
                    <div className="hidden max-[1100px]:grid">
                        <div className="mb-2 grid h-[132px] w-[132px] place-items-center rounded-full bg-[#1f1f1f] text-[28px] font-semibold tracking-[1px] text-[#fefefe] shadow-[0_10px_35px_rgba(0,0,0,0.08)] max-[520px]:h-[112px] max-[520px]:w-[112px] max-[520px]:text-[24px]">
                            {initials}
                        </div>
                    </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="m-0 text-[32px] font-extrabold tracking-[-0.3px] break-words max-[720px]:text-[28px] max-[520px]:text-[24px]">
                        {name}
                    </h1>
                    <span className="rounded-[12px] border border-[#d5e1c8] bg-[#e9f5db] px-2.5 py-1 text-[13px] font-semibold text-[#4e5c4a]">
                        {pronouns}
                    </span>
                </div>
                <p className="m-0 text-[16px] font-semibold text-[#4a5043] break-words max-[520px]:text-[14px]">{title}</p>
                <p className="m-0 text-[14px] text-[#7a7f71]">{location}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
                {experiences.map((experience) => (
                    <div key={experience.company} className="flex items-center gap-2.5 text-[14px] font-bold text-[#3c4235]">
                        <span
                            className="h-[18px] w-[18px] rounded-full border border-[#d0d9cb] bg-white shadow-[0_0_0_2px_#e8eee0_inset]"
                            style={{ backgroundColor: experience.color }}
                        />
                        <span>{experience.company}</span>
                    </div>
                ))}
                <span
                    className="grid h-[26px] w-[26px] place-items-center rounded-full border border-[#cfd9c6] bg-[#e9f5db] text-[12px] text-[#526043]"
                    aria-label="Edit profile"
                >
                    <Icon icon="meteor-icons:pencil" width={16} height={16} />
                </span>
            </div>
        </header>
    );
}
