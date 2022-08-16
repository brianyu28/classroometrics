import React from "react";

import { useInputFieldState } from "crmet/util/hooks";

import "./style.scss";

interface QuestionPromptProps {
    submitQuestion: (question: string) => void;
}

function QuestionPrompt({
    submitQuestion,
}: QuestionPromptProps) {

    const [question, setQuestion, updateQuestion] = useInputFieldState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submitQuestion(question);
        setQuestion("");
        return false;
    };

    return (
        <div className="question-prompt">
            <form onSubmit={handleSubmit}>
                <input type="text" value={question} onChange={updateQuestion} placeholder="Submit a question or answer"></input>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default QuestionPrompt;
