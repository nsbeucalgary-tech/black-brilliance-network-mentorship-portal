import type { Role } from "./Types";


interface StepOneProps {
    onSelect: (role: Role) => void;
}

export function StepOne({ onSelect }: StepOneProps) {
    return (
        <div className="w-full max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-widest text-[#7a9b5c] uppercase mb-3">
                Step 1 of 2
            </p>
            <h1 className="text-4xl font-extrabold text-[#2d3a1f] mb-3 tracking-tight">
                How will you use BBN?
            </h1>
            <p className="text-[#6b7a5e] mb-12 text-base">
                This helps us match you with the right people and personalise
                your experience.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <RoleCard
                    emoji="🎓"
                    title="I'm a Mentor"
                    description="I'm an industry professional or alumnus who wants to guide and support students in their career journey."
                    cta="Join as Mentor"
                    onClick={() => onSelect("mentor")}
                />
                <RoleCard
                    emoji="🚀"
                    title="I'm a Mentee"
                    description="I'm a student or early-career professional looking for guidance, networking, and career development."
                    cta="Join as Mentee"
                    onClick={() => onSelect("mentee")}
                />
            </div>
        </div>
    );
}

interface RoleCardProps {
    emoji: string;
    title: string;
    description: string;
    cta: string;
    onClick: () => void;
}

function RoleCard({ emoji, title, description, cta, onClick }: RoleCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl border-2 border-[#d4e5c3] bg-white p-8 text-left hover:border-[#2d3a1f] hover:shadow-[0_8px_30px_rgba(45,58,31,0.12)] transition-all duration-200"
        >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3dd] text-3xl group-hover:bg-[#2d3a1f] transition-colors duration-200">
                <span>{emoji}</span>
            </div>
            <h2 className="text-xl font-bold text-[#2d3a1f] mb-2">{title}</h2>
            <p className="text-sm text-[#6b7a5e] leading-relaxed">
                {description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2d3a1f] group-hover:gap-3 transition-all">
                {cta}
                <span>→</span>
            </div>
        </button>
    );
}
