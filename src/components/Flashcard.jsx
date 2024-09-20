import React, { useState } from 'react';
import { getFlashcards } from '../api/gemini';

const Flashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAddFlashcard = async () => {
    try {
      const response = await getFlashcards(`Create a flashcard with question: ${question} and answer: ${answer}`);
      setFlashcards([...flashcards, { question, answer }]);
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleAddFlashcard}
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Add Flashcard
      </button>
      <ul className="mt-6 space-y-2">
        {flashcards.map((card, index) => (
          <li key={index} className="border p-4 rounded bg-gray-50">
            <p className="font-bold">Q: {card.question}</p>
            <p>A: {card.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Flashcard;
