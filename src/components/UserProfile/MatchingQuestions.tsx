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
        <section className="matching-container">
            <div className="section-title" style={{ marginBottom: 10 }}>
                <span className="matching-title">( Matching Questions )</span>
                <span className="floating-dots">...</span>
            </div>
            <div>
                {questions.map((question) => (
                    <div key={question.id} className="question-card">
                        <p className="question-label">{question.title}</p>
                        {question.options ? (
                            <div className="field-row">
                                <select className="select-field" defaultValue={question.answer ?? ""}>
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
                                <span className="kebab">...</span>
                            </div>
                        ) : null}
                        {question.multiline && (
                            <textarea className="textarea-field" defaultValue={question.answer} />
                        )}
                        <p className="helper-text">{question.helper}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
