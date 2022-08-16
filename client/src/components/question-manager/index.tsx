import "./style.scss";

interface QuestionManagerProps {
    questions: string[];
    questionsEnabled: boolean;
    removeQuestionAtIndex: (index: number) => void;
}

function QuestionManager({
    questions,
    questionsEnabled,
    removeQuestionAtIndex,
}: QuestionManagerProps) {
    return (
        <div className="question-manager">
            <h2>Responses</h2>
            {!questionsEnabled && <p style={{color: "red"}}>Responses disabled.</p>}
            {questions.map((question, i) => (
                <div key={i} className="question-editor">
                    {question}
                    <button
                        onClick={() => removeQuestionAtIndex(i)}
                        className="question-editor-delete"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default QuestionManager;
