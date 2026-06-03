import type { UserExperience } from "../../types/User";

type ProfileContentProps = {
    bio?: string;
    experiences: UserExperience[];
};

export default function ProfileContent({ bio, experiences }: ProfileContentProps) {
    return (
        <main className="space-y-8 xl:space-y-10">
            <section className="space-y-2 xl:space-y-3">
                <h2 className="text-lg font-bold text-BBNDarkGreen xl:text-2xl">About</h2>
                <p className="text-sm leading-7 text-BBNDarkAvocadoGreen xl:text-base xl:leading-8">
                    {bio || "No bio yet."}
                </p>
            </section>

            <section className="space-y-3 xl:space-y-4">
                <h2 className="text-lg font-bold text-BBNDarkGreen xl:text-2xl">Experience</h2>
                {experiences.length === 0 ? (
                    <p className="text-sm text-BBNDarkAvocadoGreen xl:text-base">No experience added yet.</p>
                ) : (
                    <div className="grid gap-4 border-BBNBrightGreen pl-4 xl:gap-5 xl:pl-5">
                        {experiences.map((exp, index) => {
                            const isLast = index === experiences.length - 1;
                            return (
                                <div key={index} className="flex group min-h-[76px]">
                                    {/* Timeline Visual Track */}
                                    <div className="flex flex-col exps-center mr-4 w-4 shrink-0">
                                        {/* Dot */}
                                        <div className="w-2 h-2 bg-[#b0b0b0] rounded-full mt-[6px]" />

                                        {/* Connecting Line (hidden on the last exp) */}
                                        {!isLast && (
                                            <div className="w-1 bg-[#b0b0b0] rounded-full grow mt-2.5 mb-1" />
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex flex-col pb-6">
                                        <h3 className="text-[16px] font-bold text-[#1a1a1a] leading-tight">
                                            {exp.role}
                                        </h3>
                                        <p className="text-[14px] font-semibold text-[#4a4a4a] mt-0.5">
                                            {exp.company}
                                        </p>
                                        <span className="text-[14px] text-[#313030] font-normal">
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
