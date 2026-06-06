import type { UserExperience } from "../../types/User";

type ProfileContentProps = {
    bio?: string;
    experiences: UserExperience[];
};

export default function ProfileContent({ bio, experiences }: ProfileContentProps) {
    return (
        <main className="space-y-8 xl:space-y-10">
            <section className="space-y-2 xl:space-y-3 text-black">
                <h2 className="text-lg font-bold lg:text-xl xl:text-2xl">About</h2>
                <p className="text-sm leading-7 lg:text-base xl:text-lg xl:leading-8">
                    {bio || "No bio yet."}
                </p>
            </section>

            <section className="space-y-3 xl:space-y-4">
                <h2 className="text-lg font-bold text-BBNDarkGreen lg:text-xl xl:text-2xl">Experience</h2>
                {experiences.length === 0 ? (
                    <p className="text-sm text-BBNDarkAvocadoGreen lg:text-base">No experience added yet.</p>
                ) : (
                    <div className="grid gap-4 border-BBNBrightGreen pl-4 xl:gap-5 xl:pl-5">
                        {experiences.map((exp, index) => {
                            const isLast = index === experiences.length - 1;
                            return (
                                <div key={index} className="flex group min-h-20 cursor-default">
                                    {/* Timeline Visual Track */}
                                    <div className="flex flex-col items-center mr-4 w-4 shrink-0">
                                        {/* Dot with hover interaction */}
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full mt-1.5 transition-all duration-300 group-hover:scale-125 group-hover:bg-BBNDarkGreen" />

                                        {/* Connecting Line with hover interaction */}
                                        {!isLast && (
                                            <div className="w-0.5 bg-neutral-300 rounded-full grow mt-2.5 mb-1 transition-colors duration-300 group-hover:bg-neutral-400" />
                                        )}
                                    </div>

                                    {/* Content Area with subtle micro-interaction */}
                                    <div className="flex flex-col pb-6 transform transition-all duration-300 group-hover:translate-x-1">
                                        <h3 className="text-base font-bold text-neutral-900 leading-tight lg:text-lg">
                                            {exp.role}
                                        </h3>
                                        <p className="text-sm font-semibold text-neutral-600 mt-0.5 lg:text-base">
                                            {exp.company}
                                        </p>
                                        <span className="text-sm text-neutral-500 font-normal lg:text-base">
                                            {exp.period}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}