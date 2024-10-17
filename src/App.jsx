import React, { useState, useEffect } from "react";
import {
  getQuizQuestions,
  getFlashcards,
  getProgressRecommendations,
} from "./api/gemini";
import QuizComponent from "./components/QuizComponent";
import FlashcardComponent from "./components/FlashcardComponent";
import ProgressComponent from "./components/ProgressComponent";
import InputForm from "./components/InputForm";
import { processFileContent } from "./utils/fileProcessor";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function App() {
  const [input, setInput] = useState("");
  const [flashcards, setFlashcards] = useState(
    () => JSON.parse(localStorage.getItem("flashcards")) || []
  );
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState("");
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [quizResults, setQuizResults] = useState(
    () => JSON.parse(localStorage.getItem("quizResults")) || []
  );
  const [flashcardsLearned, setFlashcardsLearned] = useState(
    () => JSON.parse(localStorage.getItem("flashcardsLearned")) || 0
  );
  const [timeSpent, setTimeSpent] = useState(
    () => JSON.parse(localStorage.getItem("timeSpent")) || 0
  );

  const handleQuiz = async () => {
    const inputData = fileContent || input;
    setLoadingQuiz(true);
    try {
      const result = await getQuizQuestions(inputData);
      setQuestions(result);
    } catch (error) {
      console.error("Failed to fetch quiz questions:", error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleFlashcards = async () => {
    const inputData = fileContent || input;
    setLoadingFlashcards(true);
    try {
      const result = await getFlashcards(inputData);
      let newFlashcards = [];
      if (Array.isArray(result)) {
        newFlashcards = result.map((item) => ({
          question: item.question || "Question Placeholder",
          answer: item.answer || "Answer Placeholder",
          learned: false,
        }));
      } else if (typeof result === "string") {
        newFlashcards = result.split("\n").map((item) => ({
          question: item,
          answer: "Answer Placeholder",
          learned: false,
        }));
      } else {
        throw new Error("Invalid data format from getFlashcards API");
      }
      setFlashcards(newFlashcards);
      localStorage.setItem("flashcards", JSON.stringify(newFlashcards));
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleRecommendations = async () => {
    const inputData = JSON.stringify({
      quizzesCompleted: quizResults.length,
      flashcardsLearned,
    });
    setLoadingRecommendations(true);
    try {
      const result = await getProgressRecommendations(inputData);
      setRecommendations(formatResponse(result));
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    const content = await processFileContent(uploadedFile);
    setFileContent(content);
  };

  const addManualFlashcard = (question, answer) => {
    const newFlashcard = { question, answer, learned: false };
    const updatedFlashcards = [...flashcards, newFlashcard];
    setFlashcards(updatedFlashcards);
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
  };

  const markFlashcardAsLearned = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index].learned = true;
    setFlashcards(updatedFlashcards);
    setFlashcardsLearned((prevLearned) => prevLearned + 1);
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
    localStorage.setItem(
      "flashcardsLearned",
      JSON.stringify(flashcardsLearned + 1)
    );
  };

  const formatResponse = (response) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/😊/g, "<span>😊</span>")
      .replace(/\n/g, "<br />")
      .replace(/(?:^|\s)\u2022\s(.*?)(?=\n|\r|$)/g, "<li>$1</li>")
      .replace(/<li>/g, "<ul><li>")
      .replace(/<\/li>/g, "</li></ul>");
  };

  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  const correctAnswers = quizResults.reduce(
    (acc, quiz) => acc + (quiz.correct ? 1 : 0),
    0
  );

  useEffect(() => {
    const totalCorrectAnswers = quizResults.reduce(
      (sum, quiz) => sum + quiz.correct,
      0
    );
    const totalCompletedQuizzes = quizResults.reduce(
      (sum, quiz) => sum + quiz.total,
      0
    );
    localStorage.setItem("totalCorrectAnswers", totalCorrectAnswers);
    localStorage.setItem("totalCompletedQuizzes", totalCompletedQuizzes);
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
    localStorage.setItem(
      "flashcardsLearned",
      JSON.stringify(flashcardsLearned)
    );
    localStorage.setItem("timeSpent", JSON.stringify(timeSpent));
  }, [quizResults, flashcardsLearned, timeSpent]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight animate-fadeIn">
        RAG PROJECT
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Upload Document:
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
            onChange={handleFileUpload}
            className="w-full text-sm p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-around gap-4 mb-6">
          <button
            onClick={() => {
              handleQuiz();
              scrollToSection("quiz");
            }}
            className="w-1/3 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md shadow-md hover:scale-105 transition-transform"
          >
            Send to Gemini
          </button>
          <button
            onClick={() => {
              handleFlashcards();
              scrollToSection("flashcards");
            }}
            className="w-1/3 py-2 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-md shadow-md hover:scale-105 transition-transform"
          >
            Flashcards
          </button>
          <button
            onClick={() => {
              handleRecommendations();
              scrollToSection("progress");
            }}
            className="w-1/3 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-md shadow-md hover:scale-105 transition-transform"
          >
            Recommendations
          </button>
        </div>

        {loadingQuiz ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="text-4xl text-blue-600 animate-spin" />
            <p className="ml-2 text-blue-600">
              Please wait! Data is processing...
            </p>
          </div>
        ) : (
          questions.length > 0 && (
            <div id="quiz">
              <QuizComponent
                questions={questions}
                setQuizResults={setQuizResults}
              />
            </div>
          )
        )}

        {loadingFlashcards ? (
          <div className="flex items-center justify-center mt-6">
            <AiOutlineLoading3Quarters className="text-4xl text-green-600 animate-spin" />
            <p className="ml-2 text-green-600">
              Please wait! flashcards is generating...
            </p>
          </div>
        ) : (
          flashcards.length > 0 && (
            <div id="flashcards" className="mt-6">
              <FlashcardComponent
                flashcards={flashcards}
                markFlashcardAsLearned={markFlashcardAsLearned}
              />
            </div>
          )
        )}

        {loadingRecommendations ? (
          <div className="flex items-center justify-center mt-6">
            <AiOutlineLoading3Quarters className="text-4xl text-purple-600 animate-spin" />
            <p className="ml-2 text-purple-600">Loading.....</p>
          </div>
        ) : (
          recommendations && (
            <div id="progress" className="mt-6">
              <ProgressComponent recommendations={recommendations} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
