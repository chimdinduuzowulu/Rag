import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch quiz questions from Gemini API (use a placeholder API for now)
    axios.get('https://api.example.com/quiz-questions')
      .then(response => setQuestions(response.data.questions))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, answer]);
    setCurrentQuestion(currentQuestion + 1);
  };

  return (
    <div className="quiz-container">
      {questions.length > 0 && currentQuestion < questions.length ? (
        <div className="question-card bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
          <ul>
            {questions[currentQuestion].answers.map((answer, index) => (
              <li key={index} onClick={() => handleAnswer(answer)}
                  className="bg-blue-100 p-2 rounded-lg mb-2 cursor-pointer hover:bg-blue-200">
                {answer}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold">Quiz Completed</h2>
          <p>Your Score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
