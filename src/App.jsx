import React, { useState, useEffect } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from './api/gemini';
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

  // Tracking user performance (quizzes, flashcards learned)
  const [quizResults, setQuizResults] = useState(() => JSON.parse(localStorage.getItem('quizResults')) || []);
  const [flashcardsLearned, setFlashcardsLearned] = useState(() => JSON.parse(localStorage.getItem('flashcardsLearned')) || 0);

  // Function to handle fetching quiz questions
  /* const handleQuiz = async () => {
    const result = await getQuizQuestions(input);
    setQuestions(result.split('\n')); // Assuming the result is a string with new lines separating questions
  }; */

  // Function to handle fetching quiz questions
const handleQuiz = async () => {
  try {
    const result = await getQuizQuestions(input);
    setQuestions(result);  // The result is now a structured array of question objects
  } catch (error) {
    console.error('Failed to fetch quiz questions:', error);
  }
};


  // Function to handle fetching flashcards
  const handleFlashcards = async () => {
    const result = await getFlashcards(input);
    setFlashcards(result.split('\n')); // Assuming the result is a string with new lines separating flashcards
  };

  // Function to handle fetching progress recommendations
  const handleRecommendations = async () => {
    const inputData = JSON.stringify({
      quizzesCompleted: quizResults.length,
      flashcardsLearned,
    });
    const result = await getProgressRecommendations(inputData);
    setRecommendations(formatResponse(result));
  };

  // Function to format the response for better styling
  const formatResponse = (response) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/😊/g, '<span>😊</span>') // Emoji
      .replace(/\n/g, '<br />') // Line breaks
      .replace(/(?:^|\s)\u2022\s(.*?)(?=\n|\r|$)/g, '<li>$1</li>') // Bullet points
      .replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>'); // Wrap bullet points with <ul>
  };

  // Automatically scroll to sections when buttons are clicked
  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  // Save quiz results and flashcards learned in localStorage
  useEffect(() => {
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    localStorage.setItem('flashcardsLearned', JSON.stringify(flashcardsLearned));
  }, [quizResults, flashcardsLearned]);

  return (
    <div className="container mx-auto p-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>

      {/* Input form for user input */}
      <InputForm input={input} setInput={setInput} />

      {/* Buttons for different functionalities */}
      <div className="flex gap-4 mb-4 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { handleQuiz(); scrollToSection('quiz'); }}>
          Get Quiz
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => { handleFlashcards(); scrollToSection('flashcards'); }}>
          Get Flashcards
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={() => { handleRecommendations(); scrollToSection('progress'); }}>
          Get Recommendations
        </button>
      </div>

      {/* Rendering the components conditionally based on the response data */}
      <div id="quiz">
        {questions.length > 0 && <QuizComponent questions={questions} setQuizResults={setQuizResults} />}
      </div>
      <div id="flashcards">
        {flashcards.length > 0 && <FlashcardComponent flashcards={flashcards} setFlashcardsLearned={setFlashcardsLearned} />}
      </div>
      <div id="progress">
        {recommendations && <ProgressComponent recommendations={recommendations} />}
      </div>
    </div>
  );
}

export default App;
