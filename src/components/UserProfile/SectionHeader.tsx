import { Icon } from "@iconify/react";

interface SectionHeaderProps {
    title: string;
    showIcon?: boolean;
}

export default function SectionHeader({ title, showIcon = true }: SectionHeaderProps) {
    return (
        <div className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#3c4235]">
            <span>{title}</span>
            {showIcon && (
                <span
                    className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border border-[#cfd9c6] bg-[#e9f5db] text-[12px] text-[#526043]"
                    aria-label="Edit section"
                >
                    <Icon icon="meteor-icons:pencil" width={16} height={16} />
                </span>
            )}
        </div>
    );
}
