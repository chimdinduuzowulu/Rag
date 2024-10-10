import React, { useState, useEffect } from 'react';
import { getQuizQuestions, getFlashcards, getProgressRecommendations } from './api/gemini';
import QuizComponent from './components/QuizComponent';
import FlashcardComponent from './components/FlashcardComponent';
import ProgressComponent from './components/ProgressComponent';
import InputForm from './components/InputForm';
import { processFileContent } from './utils/fileProcessor'; // Import a helper to handle file parsing
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Import loading spinner

function App() {
  // State to manage input, response data, and flashcards
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState(() => JSON.parse(localStorage.getItem('flashcards')) || []);
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState('');

  // Loading state for quiz, flashcards, and recommendation
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // File upload states
  const [file, setFile] = useState(null); // State for uploaded file
  const [fileContent, setFileContent] = useState(''); // Extracted file content

  // Tracking user performance (quizzes, flashcards learned)
  const [quizResults, setQuizResults] = useState(() => JSON.parse(localStorage.getItem('quizResults')) || []);
  const [flashcardsLearned, setFlashcardsLearned] = useState(() => JSON.parse(localStorage.getItem('flashcardsLearned')) || 0);

  // New state to track time spent (for the "Time Spent on Topics" feature)
  const [timeSpent, setTimeSpent] = useState(() => JSON.parse(localStorage.getItem('timeSpent')) || 0);

  // Handle quiz generation using either user input or uploaded file content
  const handleQuiz = async () => {
    const inputData = fileContent || input; // Use file content if uploaded, else use input
    setLoadingQuiz(true); // Start loading
    try {
      const result = await getQuizQuestions(inputData);
      setQuestions(result);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    } finally {
      setLoadingQuiz(false); // Stop loading
    }
  };

// Handle flashcards generation using either user input or uploaded file content
const handleFlashcards = async () => {
  const inputData = fileContent || input; // Use file content if uploaded, else use input
  setLoadingFlashcards(true); // Start loading
  try {
    const result = await getFlashcards(inputData);

    // Check if result is an array of flashcards directly or needs parsing
    let newFlashcards = [];
    if (Array.isArray(result)) {
      // If the API returned an array of flashcards
      newFlashcards = result.map(item => ({
        question: item.question || "Question Placeholder", // Ensure there's a question field
        answer: item.answer || "Answer Placeholder", // Ensure there's an answer field
        learned: false,
      }));
    } else if (typeof result === 'string') {
      // If the API returned a string
      newFlashcards = result.split('\n').map(item => ({
        question: item,
        answer: "Answer Placeholder", // Replace this with dynamic answers if available
        learned: false,
      }));
    } else {
      console.error('Unexpected result format:', result);
      throw new Error('Invalid data format from getFlashcards API');
    }

    // Update the flashcards state and localStorage
    setFlashcards(newFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(newFlashcards));
  } catch (error) {
    console.error('Failed to fetch flashcards:', error);
  } finally {
    setLoadingFlashcards(false); // Stop loading
  }
};


  // Handle flashcards generation using either user input or uploaded file content
  // const handleFlashcards = async () => {
  //   const inputData = fileContent || input; // Use file content if uploaded, else use input
  //   setLoadingFlashcards(true); // Start loading
  //   try {
  //     const result = await getFlashcards(inputData);
  //     const newFlashcards = result.split('\n').map(item => ({
  //       question: item,
  //       answer: "Answer Placeholder", // Replace this with dynamic answers if available
  //       learned: false,
  //     }));
  //     setFlashcards(newFlashcards);
  //     localStorage.setItem('flashcards', JSON.stringify(newFlashcards));
  //   } catch (error) {
  //     console.error('Failed to fetch flashcards:', error);
  //   } finally {
  //     setLoadingFlashcards(false); // Stop loading
  //   }
  // };


  // Handle progress recommendations
  const handleRecommendations = async () => {
    const inputData = JSON.stringify({
      quizzesCompleted: quizResults.length,
      flashcardsLearned,
    });
    setLoadingRecommendations(true); // Start loading
    try {
      const result = await getProgressRecommendations(inputData);
      setRecommendations(formatResponse(result));
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoadingRecommendations(false); // Stop loading
    }
  };

  // Function to handle file upload
  const handleFileUpload = async event => {
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

  // Function to mark a flashcard as learned
  const markFlashcardAsLearned = index => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index].learned = true;
    setFlashcards(updatedFlashcards);
    setFlashcardsLearned(prevLearned => prevLearned + 1);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
    localStorage.setItem('flashcardsLearned', JSON.stringify(flashcardsLearned + 1));
  };

  // Function to format the response for better styling
  const formatResponse = response => {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/😊/g, '<span>😊</span>') // Emoji
      .replace(/\n/g, '<br />') // Line breaks
      .replace(/(?:^|\s)\u2022\s(.*?)(?=\n|\r|$)/g, '<li>$1</li>') // Bullet points
      .replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>'); // Wrap bullet points with <ul>
  };

  // Automatically scroll to sections when buttons are clicked
  const scrollToSection = section => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate correct answers from quiz results
  const correctAnswers = quizResults.reduce((acc, quiz) => acc + (quiz.correct ? 1 : 0), 0);

  // Save quiz results, flashcards learned, and time spent in localStorage
  useEffect(() => {
    const totalCorrectAnswers = quizResults.reduce((sum, quiz) => sum + quiz.correct, 0);
    const totalCompletedQuizzes = quizResults.reduce((sum, quiz) => sum + quiz.total, 0);

    localStorage.setItem('totalCorrectAnswers', totalCorrectAnswers);
  localStorage.setItem('totalCompletedQuizzes', totalCompletedQuizzes);
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    localStorage.setItem('flashcardsLearned', JSON.stringify(flashcardsLearned));
    localStorage.setItem('timeSpent', JSON.stringify(timeSpent)); // Save time spent
  }, [quizResults, flashcardsLearned, timeSpent]);

  // Optionally, track time spent (this can be a simple implementation, depending on requirements)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSpent(prevTime => prevTime + 1);
    }, 60000); // Increment time every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>

      {/* Input form for user input */}
      <InputForm input={input} setInput={setInput} />

      {/* File upload functionality for RAG */}
      <div className="my-4">
        <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
          Upload Document (Optional):
        </label>
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            handleQuiz();
            scrollToSection('quiz');
          }}
        >
          Get Quiz
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            handleFlashcards();
            scrollToSection('flashcards');
          }}
        >
          Get Flashcards
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => {
            handleRecommendations();
            scrollToSection('progress');
          }}
        >
          Get Recommendations
        </button>
      </div>

      {/* Rendering the components conditionally based on the response data */}
      {/* Conditional rendering with loading spinners */}
      <div id="quiz">
        {loadingQuiz ? (
          <div className="flex justify-center items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
            <p className="ml-2 text-blue-500">Fetching quiz...</p>
          </div>
        ) : (
          questions.length > 0 && <QuizComponent questions={questions} setQuizResults={setQuizResults} />
        )}
      </div>

      <div id="flashcards">
        {loadingFlashcards ? (
          <div className="flex justify-center items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-500" />
            <p className="ml-2 text-green-500">Fetching flashcards...</p>
          </div>
        ) : (
          flashcards.length > 0 && (
            <FlashcardComponent
              flashcards={flashcards}
              setFlashcardsLearned={setFlashcardsLearned}
              markFlashcardAsLearned={markFlashcardAsLearned} // Pass the function here
              addFlashcard={addManualFlashcard}
            />
          )
        )}
      </div>

      <div id="progress">
        {loadingRecommendations ? (
          <div className="flex justify-center items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-purple-500" />
            <p className="ml-2 text-purple-500">Fetching recommendations...</p>
          </div>
        ) : recommendations ? (
          <ProgressComponent
            recommendations={recommendations}
            quizzesCompleted={quizResults.length}
            correctAnswers={correctAnswers}
            flashcardsLearned={flashcardsLearned}
            timeSpent={timeSpent}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
