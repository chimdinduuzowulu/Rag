import React, { useState } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from '../src/api/gemini';
import QuizComponent from './components/QuizComponent';
import FlashcardComponent from './components/FlashcardComponent';
import ProgressComponent from './components/ProgressComponent';
import InputForm from './components/InputForm';

function App() {
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState('');

  const handleQuiz = async () => {
    const result = await getQuizQuestions(input);
    setQuestions(result.split('\n')); // Assuming the result is a string with new lines separating questions
  };

  const handleFlashcards = async () => {
    const result = await getFlashcards(input);
    setFlashcards(result.split('\n')); // Assuming the result is a string with new lines separating flashcards
  };

  const handleRecommendations = async () => {
    const result = await getProgressRecommendations(input);
    setRecommendations(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>

      <InputForm input={input} setInput={setInput} onSubmit={handleQuiz} />

      <div className="flex gap-4 mb-4 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleQuiz}>
          Get Quiz
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleFlashcards}>
          Get Flashcards
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={handleRecommendations}>
          Get Recommendations
        </button>
      </div>

      {questions.length > 0 && <QuizComponent questions={questions} />}
      {flashcards.length > 0 && <FlashcardComponent flashcards={flashcards} />}
      {recommendations && <ProgressComponent recommendations={recommendations} />}
    </div>
  );
}

export default App;
