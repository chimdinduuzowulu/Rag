import React, { useState } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from '../src/api/gemini';
import QuizComponent from './components/QuizComponent';
import FlashcardComponent from './components/FlashcardComponent';
import ProgressComponent from './components/ProgressComponent';
import InputForm from './components/InputForm';

function App() {
  // State to manage input and response data
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState('');

  // Function to handle fetching quiz questions
  const handleQuiz = async () => {
    const result = await getQuizQuestions(input);
    setQuestions(result.split('\n')); // Assuming the result is a string with new lines separating questions
  };

  // Function to handle fetching flashcards
  const handleFlashcards = async () => {
    const result = await getFlashcards(input);
    setFlashcards(result.split('\n')); // Assuming the result is a string with new lines separating flashcards
  };

  // Function to handle fetching progress recommendations
  const handleRecommendations = async () => {
    const result = await getProgressRecommendations(input);
    setRecommendations(result);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">AI Learning Assistant</h1>

      {/* Input form for user input */}
      <InputForm input={input} setInput={setInput} onSubmit={handleQuiz} />

      {/* Buttons for different functionalities */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all" onClick={handleQuiz}>
          Get Quiz
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all" onClick={handleFlashcards}>
          Get Flashcards
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all" onClick={handleRecommendations}>
          Get Recommendations
        </button>
      </div>

      {/* Rendering the components conditionally based on the response data */}
      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quiz Questions:</h2>
          <QuizComponent questions={questions} />
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Flashcards:</h2>
          <FlashcardComponent flashcards={flashcards} />
        </div>
      )}

      {recommendations && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Progress Recommendations:</h2>
          <ProgressComponent recommendations={recommendations} />
        </div>
      )}
    </div>
  );
}

export default App;
