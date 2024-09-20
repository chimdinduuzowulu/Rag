import React, { useState, useEffect } from 'react';
import { getQuizQuestions } from '../api/gemini';

const Quiz = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await getQuizQuestions('Generate a quiz based on user performance.');
        setQuestions(JSON.parse(response).questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  if (isLoading) return <p className="text-lg font-semibold text-blue-600">Loading...</p>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="quiz-container p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      {question && (
        <>
          <p className="text-lg mb-4">{question.text}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
