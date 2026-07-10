import { Plus, Trash2 } from "lucide-react";
import type { EditableFields, EditableFieldsSetter } from "./types";

const PRONOUNS = ["He/Him", "She/Her", "They/Them", "Prefer not to say"];
const INTERESTS = [
    "Engineering",
    "Product",
    "Design",
    "Finance",
    "Marketing",
    "Data Science",
    "Medicine",
    "Law",
    "Education",
    "Entrepreneurship",
    "Research",
    "Non-profit",
    "Government",
    "Media",
    "Consulting",
];

type ProfileEditFormProps = {
    fields: EditableFields;
    setFields: EditableFieldsSetter;
};

export default function ProfileEditForm({
    fields,
    setFields,
}: ProfileEditFormProps) {
    const addExperience = () => {
        setFields((s) => ({
            ...s,
            experiences: [
                ...s.experiences,
                {
                    company: "",
                    role: "",
                    start_date: "",
                    end_date: "",
                    is_present: false,
                },
            ],
        }));
    };

    const updateExperience = (
        index: number,
        updater: (exp: (typeof fields.experiences)[number]) => (typeof fields.experiences)[number],
    ) => {
        setFields((s) => ({
            ...s,
            experiences: s.experiences.map((exp, i) =>
                i === index ? updater(exp) : exp,
            ),
        }));
    };

    const removeExperience = (index: number) => {
        setFields((s) => ({
            ...s,
            experiences: s.experiences.filter((_, i) => i !== index),
        }));
    };

    const toggleInterest = (interest: string) => {
        setFields((s) => ({
            ...s,
            interests: s.interests.includes(interest)
                ? s.interests.filter((item) => item !== interest)
                : s.interests.length < 8
                  ? [...s.interests, interest]
                  : s.interests,
        }));
    };

    return (
        <section className="grid gap-4 rounded-xl border border-BBNBrightGreen bg-BBNAmnesiacWhite p-4 xl:gap-5 xl:p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
                <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                    Pronouns
                    <select
                        className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:px-4 xl:py-2.5"
                        value={fields.pronouns}
                        onChange={(e) =>
                            setFields((s) => ({ ...s, pronouns: e.target.value }))
                        }
                    >
                        <option value="">Select pronouns</option>
                        {PRONOUNS.map((pronoun) => (
                            <option key={pronoun} value={pronoun}>
                                {pronoun}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                    Title
                    <input
                        className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:px-4 xl:py-2.5"
                        value={fields.title}
                        onChange={(e) =>
                            setFields((s) => ({ ...s, title: e.target.value }))
                        }
                    />
                </label>
                <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                    Location
                    <input
                        className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:px-4 xl:py-2.5"
                        value={fields.location}
                        onChange={(e) =>
                            setFields((s) => ({ ...s, location: e.target.value }))
                        }
                    />
                </label>
                <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                    Website URL
                    <input
                        className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:px-4 xl:py-2.5"
                        value={fields.website_url}
                        onChange={(e) =>
                            setFields((s) => ({ ...s, website_url: e.target.value }))
                        }
                    />
                </label>
                <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                    LinkedIn URL
                    <input
                        className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:px-4 xl:py-2.5"
                        value={fields.linkedin_url}
                        onChange={(e) =>
                            setFields((s) => ({ ...s, linkedin_url: e.target.value }))
                        }
                    />
                </label>
                <div className="grid gap-2 text-sm font-medium text-BBNDarkGreen md:col-span-2 xl:text-base">
                    <p>
                        Interests{" "}
                        {fields.interests.length > 0
                            ? `(${fields.interests.length}/8)`
                            : ""}
                    </p>
                    <p className="text-xs text-BBNDarkAvocadoGreen xl:text-sm">
                        Select up to 8 areas that interest you.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {INTERESTS.map((interest) => {
                            const active = fields.interests.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors xl:px-5 xl:py-2.5 xl:text-sm ${
                                        active
                                            ? "border-BBNDarkGreen bg-BBNDarkGreen text-white"
                                            : "border-BBNBrightGreen bg-white text-BBNDarkAvocadoGreen hover:border-BBNDarkAvocadoGreen"
                                    }`}
                                >
                                    {interest}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <label className="grid gap-1 text-sm font-medium text-BBNDarkGreen xl:text-base">
                About
                <textarea
                    className="min-h-28 rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 xl:min-h-32 xl:px-4 xl:py-2.5"
                    value={fields.bio}
                    onChange={(e) =>
                        setFields((s) => ({ ...s, bio: e.target.value }))
                    }
                />
            </label>

            <div className="grid gap-3 xl:gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-BBNDarkGreen xl:text-base">
                        Experience
                    </h3>
                </div>

                {fields.experiences.length === 0 ? (
                    <p className="text-xs text-BBNDarkAvocadoGreen xl:text-sm">
                        No experiences yet. Use Add at the bottom to create one.
                    </p>
                ) : (
                    <div className="grid gap-3 xl:gap-4">
                        {fields.experiences.map((exp, index) => (
                            <div
                                key={`exp-${index}`}
                                className="grid gap-3 rounded-lg border border-BBNBrightGreen bg-white p-3 xl:gap-4 xl:p-4"
                            >
                                <div className="grid gap-3 md:grid-cols-2">
                                    <label className="grid gap-1 text-xs font-medium text-BBNDarkGreen xl:text-sm">
                                        Company
                                        <input
                                            className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm xl:px-4 xl:py-2.5 xl:text-base"
                                            value={exp.company}
                                            onChange={(e) =>
                                                updateExperience(index, (curr) => ({
                                                    ...curr,
                                                    company: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label className="grid gap-1 text-xs font-medium text-BBNDarkGreen xl:text-sm">
                                        Role
                                        <input
                                            className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm xl:px-4 xl:py-2.5 xl:text-base"
                                            value={exp.role}
                                            onChange={(e) =>
                                                updateExperience(index, (curr) => ({
                                                    ...curr,
                                                    role: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                </div>

                                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                                    <label className="grid gap-1 text-xs font-medium text-BBNDarkGreen xl:text-sm">
                                        Start Date
                                        <input
                                            type="month"
                                            className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm xl:px-4 xl:py-2.5 xl:text-base"
                                            value={exp.start_date}
                                            max={
                                                !exp.is_present && exp.end_date
                                                    ? exp.end_date
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                updateExperience(index, (curr) => ({
                                                    ...curr,
                                                    start_date: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label className="grid gap-1 text-xs font-medium text-BBNDarkGreen xl:text-sm">
                                        End Date
                                        <input
                                            type="month"
                                            disabled={exp.is_present}
                                            className="rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-BBNLightGreen xl:px-4 xl:py-2.5 xl:text-base"
                                            value={exp.is_present ? "" : exp.end_date}
                                            min={exp.start_date || undefined}
                                            onChange={(e) =>
                                                updateExperience(index, (curr) => ({
                                                    ...curr,
                                                    end_date: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label className="inline-flex items-center gap-2 rounded-lg border border-BBNBrightGreen px-3 py-2 text-xs font-medium text-BBNDarkGreen xl:gap-2.5 xl:px-4 xl:py-2.5 xl:text-sm">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={exp.is_present}
                                            onChange={(e) =>
                                                updateExperience(index, (curr) => {
                                                    const isPresent = e.target.checked;
                                                    return {
                                                        ...curr,
                                                        is_present: isPresent,
                                                        // Preserve a real month value when toggling.
                                                        // Only clear the sentinel "Present" value.
                                                        end_date:
                                                            !isPresent &&
                                                            curr.end_date === "Present"
                                                                ? ""
                                                                : curr.end_date,
                                                    };
                                                })
                                            }
                                        />
                                        <span className="relative h-5 w-9 rounded-full bg-BBNBrightGreen transition-colors peer-checked:bg-BBNDarkGreen after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4 xl:h-6 xl:w-11 xl:after:h-5 xl:after:w-5 xl:peer-checked:after:translate-x-5" />
                                        Present
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="group inline-flex w-fit items-center gap-1 px-2 py-1 border rounded-lg border-BBNBrightGreen text-xs font-semibold text-BBNDarkAvocadoGreen hover:bg-BBNLightGreen xl:text-sm"
                                >
                                    <Trash2 size={14} aria-hidden className="group-hover:scale-125 transition-transform duration-200" />
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={addExperience}
                    className="group inline-flex w-fit items-center gap-1 rounded-lg border border-BBNBrightGreen bg-white px-2.5 py-1.5 text-xs font-semibold text-BBNDarkGreen hover:bg-BBNLightGreen xl:px-3.5 xl:py-2 xl:text-sm"
                >
                    <Plus size={14} aria-hidden className="group-hover:scale-125 transition-transform duration-200" />
                    Add
                </button>
            </div>
        </section>
    );
}
