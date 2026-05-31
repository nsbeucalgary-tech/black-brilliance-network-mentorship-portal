interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
    return (
        <div className="rounded-2xl border border-[#e8f3dd] bg-[#fafcf7] p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#2d3a1f] uppercase mb-4">
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
