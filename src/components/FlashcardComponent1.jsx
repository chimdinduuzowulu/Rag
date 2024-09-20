import React from 'react';

const FlashcardComponent = ({ flashcards }) => {
  return (
    <div className="flashcard-container">
      <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
      <ul>
        {flashcards.map((flashcard, index) => (
          <li key={index} className="border p-4 mb-4 rounded-lg">
            <strong>Concept {index + 1}:</strong> {flashcard}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlashcardComponent;
