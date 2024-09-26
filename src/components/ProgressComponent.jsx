import React from 'react';

// TailwindCSS styles and chart icons
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';

const ProgressComponent = ({ quizzesCompleted, correctAnswers, flashcardsLearned, timeSpent, recommendations }) => {
  const totalQuizzes = 10; // Example total number of quizzes
  const totalFlashcards = 50; // Example total number of flashcards

  // Calculating percentages
  const quizCompletionPercentage = Math.round((quizzesCompleted / totalQuizzes) * 100);
  const flashcardsLearnedPercentage = Math.round((flashcardsLearned / totalFlashcards) * 100);
  const correctAnswerRate = Math.round((correctAnswers / quizzesCompleted) * 100);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Progress Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Progress */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Quiz Progress</h3>
          <p className="text-gray-700 mb-4">Quizzes completed: {quizzesCompleted}/{totalQuizzes}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${quizCompletionPercentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">{quizCompletionPercentage}% completed</p>
        </div>

        {/* Flashcard Progress */}
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-green-600">Flashcards Learned</h3>
          <p className="text-gray-700 mb-4">Flashcards learned: {flashcardsLearned}/{totalFlashcards}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-green-600 h-4 rounded-full" style={{ width: `${flashcardsLearnedPercentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">{flashcardsLearnedPercentage}% of flashcards learned</p>
        </div>

        {/* Correct Answer Rate */}
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-purple-600">Correct Answer Rate</h3>
          {quizzesCompleted > 0 ? (
            <>
              <p className="text-gray-700 mb-4">Correct answers: {correctAnswers}/{quizzesCompleted}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div className="bg-purple-600 h-4 rounded-full" style={{ width: `${correctAnswerRate}%` }}></div>
              </div>
              <p className="text-sm text-gray-600">{correctAnswerRate}% correct answers</p>
            </>
          ) : (
            <p className="text-gray-600">Complete quizzes to track your answer rate.</p>
          )}
        </div>

        {/* Time Spent on Topics */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-yellow-600">Time Spent on Topics</h3>
          <p className="text-gray-700 mb-4">Total time spent: {timeSpent} minutes</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-yellow-600 h-4 rounded-full" style={{ width: `${(timeSpent / 100) * 100}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">{timeSpent} minutes spent studying</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Recommendations</h3>
        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: recommendations }}></div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-4 bg-white shadow-sm rounded-lg">
          <AiOutlineCheckCircle className="text-green-500 text-4xl" />
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-700">Strengths</h4>
            <p className="text-gray-600">Your best area is in completing quizzes with accuracy.</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white shadow-sm rounded-lg">
          <AiOutlineWarning className="text-red-500 text-4xl" />
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-700">Weaknesses</h4>
            <p className="text-gray-600">You need to spend more time on difficult flashcards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressComponent;
