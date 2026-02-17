import { Icon } from "@iconify/react";

interface MentorLinksProps {
    links: { label: string; href: string; icon: string }[];
}

export default function MentorLinks({ links }: MentorLinksProps) {
    return (
        <aside className="sticky top-5 min-w-0 max-[1000px]:static">
            <div className="grid gap-[18px]">
                <div className="grid gap-3">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            className="inline-flex flex-wrap items-center gap-2.5 break-all font-bold text-[#1f2430]"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Icon icon={link.icon} width={18} height={18} />
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-[#c9d1e0] bg-[#d8deeb] px-3.5 py-2.5 font-bold text-[#2f3543] max-[720px]:w-full max-[720px]:justify-center">
                    <Icon icon="bi:chat-left-text" width={16} height={16} />
                    Chat
                </button>
            </div>
        </aside>
    );
}
