import React, { useState } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from '../src/api/gemini';
import QuizComponent from './components/QuizComponent';
import FlashcardComponent from './components/FlashcardComponent';
import ProgressComponent from './components/ProgressComponent';
import InputForm from './components/InputForm';

function App() {
  // State to manage input and response data
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState('');
  const [questions, setQuestions] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Function to format all responses with better styling
  const formatResponse = (response) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/😊/g, '<span>😊</span>') // Emoji
      .replace(/\n/g, '<br />') // Line breaks
      .replace(/(?:^|\s)\u2022\s(.*?)(?=\n|\r|$)/g, '<li>$1</li>') // Bullet points
      .replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>'); // Wrap bullet points with <ul>
  };

  // Function to handle fetching quiz questions
  const handleQuiz = async () => {
    const result = await getQuizQuestions(input);
    const formattedResult = formatResponse(result); // Apply the format
    setQuestions(formattedResult); // Set the formatted result
  };

  // Function to handle fetching flashcards
  const handleFlashcards = async () => {
    const result = await getFlashcards(input);
    const formattedResult = formatResponse(result); // Apply the format
    setFlashcards(formattedResult); // Set the formatted result
  };

  // Function to handle fetching progress recommendations
  const handleRecommendations = async () => {
    const result = await getProgressRecommendations(input);
    const formattedResult = formatResponse(result); // Apply the format
    setRecommendations(formattedResult); // Set the formatted result
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
      {questions && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quiz Questions:</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div dangerouslySetInnerHTML={{ __html: questions }} />
          </div>
        </div>
      )}

      {flashcards && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Flashcards:</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div dangerouslySetInnerHTML={{ __html: flashcards }} />
          </div>
        </div>
      )}

      {recommendations && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Progress Recommendations:</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div dangerouslySetInnerHTML={{ __html: recommendations }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
