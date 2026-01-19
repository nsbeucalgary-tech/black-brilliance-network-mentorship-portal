import { Icon } from "@iconify/react";

interface MentorExpertiseProps {
    items: string[];
}

export default function MentorExpertise({ items }: MentorExpertiseProps) {
    return (
        <section className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
                <Icon icon="mdi:diamond-stone" width={22} height={22} />
                <h2 className="m-0 text-[22px] font-extrabold text-[#1f2430] max-[520px]:text-[20px]">Expertise</h2>
                <span className="text-[14px] font-semibold text-[#848b9c]">I can help with</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {items.map((item) => (
                    <span key={item} className="rounded-2xl bg-[#d8deeb] px-3.5 py-2 text-[13px] font-bold text-[#2f3543]">
                        {item}
                    </span>
                ))}
            </div>
        </section>
    );
}
