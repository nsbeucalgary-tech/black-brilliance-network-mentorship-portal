import type { UserExperience } from "../../types/User";
import { Section } from "./Section";


interface ExperienceSectionProps {
    experiences: UserExperience[];
    expCompany: string;
    setExpCompany: (v: string) => void;
    expRole: string;
    setExpRole: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
    endDate: string;
    setEndDate: (v: string) => void;
    isCurrent: boolean;
    setIsCurrent: (v: boolean) => void;
    addExperience: () => void;
    removeExperience: (i: number) => void;
}

export function ExperienceSection({
    experiences,
    expCompany,
    setExpCompany,
    expRole,
    setExpRole,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isCurrent,
    setIsCurrent,
    addExperience,
    removeExperience,
}: ExperienceSectionProps) {
    return (
        <Section title="Experience">
            {experiences.length > 0 && (
                <div className="mb-4 space-y-2">
                    {experiences.map((exp, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-[#d4e5c3] bg-[#f4f9ee] px-4 py-3"
                        >
                            <div>
                                <p className="text-sm font-semibold text-[#2d3a1f]">
                                    {exp.role}
                                </p>
                                <p className="text-xs text-[#7a9b5c]">
                                    {exp.company} · {exp.period}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeExperience(i)}
                                className="text-xs text-[#c0392b] hover:underline ml-4 shrink-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Company">
                        <input
                            className="exp-input"
                            placeholder="e.g. Acme Corp"
                            value={expCompany}
                            onChange={(e) => setExpCompany(e.target.value)}
                        />
                    </Field>
                    <Field label="Role / Title">
                        <input
                            className="exp-input"
                            placeholder="e.g. Senior Engineer"
                            value={expRole}
                            onChange={(e) => setExpRole(e.target.value)}
                        />
                    </Field>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Field label="Start Date" className="flex-1">
                        <input
                            type="month"
                            className="exp-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Field>

                    <Field
                        label="End Date"
                        className="flex-1"
                        labelClassName={
                            isCurrent ? "text-[#c9dfaa]" : undefined
                        }
                    >
                        <input
                            type="month"
                            className="exp-input disabled:opacity-40 disabled:cursor-not-allowed"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={isCurrent}
                        />
                    </Field>

                    <label className="flex items-center gap-2.5 cursor-pointer pb-2.5 flex-shrink-0">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isCurrent}
                                onChange={(e) => setIsCurrent(e.target.checked)}
                            />
                            <div className="w-9 h-5 rounded-full bg-[#c9dfaa] peer-checked:bg-[#283618] transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                        <span className="text-sm font-medium text-[#3d4a2b] select-none">
                            Present
                        </span>
                    </label>
                </div>
            </div>

            <button
                type="button"
                onClick={addExperience}
                disabled={
                    !expCompany ||
                    !expRole ||
                    !startDate ||
                    (!isCurrent && !endDate)
                }
                className="mt-3 rounded-xl border border-[#d4e5c3] bg-white px-4 py-2 text-sm font-semibold text-[#2d3a1f] hover:bg-[#e8f3dd] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                + Add Experience
            </button>
        </Section>
    );
}

function Field({
    label,
    children,
    className,
    labelClassName,
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
    labelClassName?: string;
}) {
    return (
        <div className={`flex flex-col gap-1 ${className ?? ""}`}>
            <label
                className={`text-xs font-semibold tracking-wide uppercase transition-colors ${labelClassName ?? "text-[#3d4a2b]"}`}
            >
                {label}
            </label>
            {children}
        </div>
    );
}
