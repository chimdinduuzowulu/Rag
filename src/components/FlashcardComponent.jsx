import React from 'react';

const FlashcardComponent = ({ flashcards, setFlashcardsLearned }) => {
  const markAsLearned = () => {
    setFlashcardsLearned(prev => prev + 1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Flashcards</h2>
      {flashcards.map((flashcard, index) => (
        <div key={index}>
          <p>{flashcard.question}</p>
          <button onClick={markAsLearned}>Learned</button>
        </div>
      ))}
    </div>
  );
};

export default FlashcardComponent;
