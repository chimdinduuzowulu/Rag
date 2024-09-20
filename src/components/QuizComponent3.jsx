import React, { useState } from 'react';

const QuizComponent = ({ questions, setQuizResults }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle answer selection or input
  const handleAnswerChange = (e, questionIdx) => {
    setAnswers({
      ...answers,
      [questionIdx]: e.target.value,
    });
  };

  // Handle quiz submission
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Calculate correct answers
    const correctAnswers = questions.reduce((score, question, idx) => {
      const userAnswer = answers[idx];
      return userAnswer && userAnswer.toLowerCase() === question.correct.toLowerCase() ? score + 1 : score;
    }, 0);

    // Update quiz results
    setQuizResults((prevResults) => [
      ...prevResults,
      { correct: correctAnswers, total: questions.length },
    ]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Quiz</h2>
      <form onSubmit={handleQuizSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{question.question}</p>

            {/* Handle different question types */}
            {question.type === 'multiple-choice' && (
              <div>
                {question.options.map((option, idx) => (
                  <label key={idx} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(e, index)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'true-false' && (
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="true"
                    onChange={(e) => handleAnswerChange(e, index)}
                  />
                  True
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="false"
                    onChange={(e) => handleAnswerChange(e, index)}
                  />
                  False
                </label>
              </div>
            )}

            {question.type === 'fill-in-the-blank' && (
              <input
                type="text"
                name={`question-${index}`}
                className="border p-2 w-full"
                placeholder="Your answer"
                onChange={(e) => handleAnswerChange(e, index)}
              />
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* Display score after submission */}
      {submitted && (
        <div className="mt-4">
          <h3 className="text-xl">Your Score: {questions.filter((_, idx) => answers[idx]?.toLowerCase() === questions[idx].correct?.toLowerCase()).length}/{questions.length}</h3>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
