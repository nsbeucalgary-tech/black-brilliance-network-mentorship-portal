import { Icon } from "@iconify/react";

interface SectionHeaderProps {
    title: string;
    showIcon?: boolean;
}

export default function SectionHeader({ title, showIcon = true }: SectionHeaderProps) {
    return (
        <div className="section-title">
            <span>{title}</span>
            {showIcon && (
                <span className="icon-bubble" aria-label="Edit section">
                    <Icon icon="meteor-icons:pencil" width={16} height={16} />
                </span>
            )}
        </div>
    );
}
