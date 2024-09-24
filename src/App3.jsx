import React, { useState, useEffect } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from './api/gemini';
import QuizComponent from './components/QuizComponent';
import FlashcardComponent from './components/FlashcardComponent';
import ProgressComponent from './components/ProgressComponent';
import InputForm from './components/InputForm';
import { processFileContent } from './utils/fileProcessor'; // Import a helper to handle file parsing

function App() {
  // State to manage input, response data, and flashcards
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState(() => JSON.parse(localStorage.getItem('flashcards')) || []);
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState('');

  // File upload states
  const [file, setFile] = useState(null); // State for uploaded file
  const [fileContent, setFileContent] = useState(''); // Extracted file content

  // Tracking user performance (quizzes, flashcards learned)
  const [quizResults, setQuizResults] = useState(() => JSON.parse(localStorage.getItem('quizResults')) || []);
  const [flashcardsLearned, setFlashcardsLearned] = useState(() => JSON.parse(localStorage.getItem('flashcardsLearned')) || 0);

  // Handle quiz generation using either user input or uploaded file content
  const handleQuiz = async () => {
    const inputData = fileContent || input; // Use file content if uploaded, else use input
    try {
      const result = await getQuizQuestions(inputData);
      setQuestions(result);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    }
  };

  // Handle flashcards generation using either user input or uploaded file content
  const handleFlashcards = async () => {
    const inputData = fileContent || input; // Use file content if uploaded, else use input
    try {
      const result = await getFlashcards(inputData);
      const newFlashcards = result.split('\n').map(item => ({
        question: item,
        answer: "Answer Placeholder", // Replace this with dynamic answers if available
        learned: false,
      }));
      setFlashcards(newFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(newFlashcards));
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
    }
  };

  // Handle progress recommendations
  const handleRecommendations = async () => {
    const inputData = JSON.stringify({
      quizzesCompleted: quizResults.length,
      flashcardsLearned,
    });
    try {
      const result = await getProgressRecommendations(inputData);
      setRecommendations(formatResponse(result));
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    
    // Process file to extract text content
    const content = await processFileContent(uploadedFile);
    setFileContent(content);
  };

  // Function to add a flashcard manually
  const addManualFlashcard = (question, answer) => {
    const newFlashcard = { question, answer, learned: false };
    const updatedFlashcards = [...flashcards, newFlashcard];
    setFlashcards(updatedFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
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
      <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>

      {/* Input form for user input */}
      <InputForm input={input} setInput={setInput} />

      {/* File upload functionality for RAG */}
      <div className="my-4">
        <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">Upload Document (Optional):</label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
      </div>

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
        {flashcards.length > 0 && (
          <FlashcardComponent
            flashcards={flashcards}
            setFlashcardsLearned={setFlashcardsLearned}
            addFlashcard={addManualFlashcard}
          />
        )}
      </div>
      <div id="progress">
        {recommendations && <ProgressComponent recommendations={recommendations} />}
      </div>
    </div>
  );
}

export default App;
