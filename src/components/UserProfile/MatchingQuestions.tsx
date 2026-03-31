interface MatchingQuestion {
    id: string;
    title: string;
    helper: string;
    options?: string[];
    answer?: string;
    multiline?: boolean;
}

interface MatchingQuestionsProps {
    questions: MatchingQuestion[];
}

export default function MatchingQuestions({ questions }: MatchingQuestionsProps) {
    return (
        <section className="rounded-[18px] border border-[#d5e2c6] bg-[#e9f5db] px-[30px] py-7 shadow-[0_15px_45px_rgba(73,86,56,0.08)] max-[720px]:px-5 max-[720px]:py-6 max-[520px]:px-4 max-[520px]:py-5">
            <div className="mb-2.5 flex items-center gap-2">
                <span className="text-[16px] font-bold text-[#565b49]">( Matching Questions )</span>
                <span className="text-[18px] tracking-[2px] text-[#6f7862]">...</span>
            </div>
            <div>
                {questions.map((question) => (
                    <div key={question.id} className="grid gap-2.5 border-b border-[#dfe7d1] py-4 last:border-b-0 last:pb-0">
                        <p className="m-0 text-[15px] font-bold text-[#3d4336]">{question.title}</p>
                        {question.options ? (
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                                <select
                                    className="h-11 w-full rounded-lg border border-[#cfd9c4] bg-[#f9fbf5] px-3 py-2 text-[14px] text-[#2d3128] sm:flex-1"
                                    defaultValue={question.answer ?? ""}
                                >
                                    {!question.answer && (
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                    )}
                                    {question.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <span className="grid h-[34px] w-[34px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#cfd9c4] bg-[#f9fbf5] font-bold text-[#5b6551]">
                                    ...
                                </span>
                            </div>
                        ) : null}
                        {question.multiline && (
                            <textarea
                                className="min-h-[110px] w-full resize-y rounded-[10px] border border-[#cfd9c4] bg-[#f9fbf5] p-3 text-[14px] text-[#2d3128]"
                                defaultValue={question.answer}
                            />
                        )}
                        <p className="m-0 text-[13px] leading-[1.5] text-[#7b7f73]">{question.helper}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
