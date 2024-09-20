import React from 'react';

const QuizComponent = ({ questions }) => {
  return (
    <div className="quiz-container">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index} className="mb-2">
            <strong>Q{index + 1}:</strong> {question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizComponent;
